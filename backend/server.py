from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import shutil
from pathlib import Path
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Any
from datetime import datetime, timedelta, timezone
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# ---------- Config ----------
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin")
JWT_SECRET = os.environ.get("JWT_SECRET", "change-me")
JWT_ALG = "HS256"
JWT_EXP_DAYS = 7

UPLOAD_ROOT = ROOT_DIR / "uploads"
PORTFOLIO_DIR = UPLOAD_ROOT / "portfolio"
PORTFOLIO_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp"}
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB

# ---------- DB ----------
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# ---------- App ----------
app = FastAPI(title="Areeb Rayyan Portfolio API")
api_router = APIRouter(prefix="/api")

# Static uploads served at /api/uploads
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_ROOT)), name="uploads")

# ---------- Auth helpers ----------
bearer = HTTPBearer(auto_error=False)


def _create_token(username: str) -> str:
    payload = {
        "sub": username,
        "exp": datetime.now(timezone.utc) + timedelta(days=JWT_EXP_DAYS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def _decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_admin(creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer)) -> str:
    if not creds or not creds.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = _decode_token(creds.credentials)
    sub = payload.get("sub")
    if sub != ADMIN_USERNAME:
        raise HTTPException(status_code=403, detail="Forbidden")
    return sub


# ---------- Models ----------
class LoginIn(BaseModel):
    username: str
    password: str


class TokenOut(BaseModel):
    token: str
    expires_in_days: int = JWT_EXP_DAYS
    username: str


class PortfolioItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str
    year: str = ""
    description: str = ""
    image_url: str
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PortfolioUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    year: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None


class ContactIn(BaseModel):
    name: str
    email: EmailStr
    project: Optional[str] = ""
    message: str


class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    project: str = ""
    message: str
    read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContentUpdate(BaseModel):
    value: Any


# ---------- Auth Routes ----------
@api_router.post("/auth/login", response_model=TokenOut)
async def login(payload: LoginIn):
    if payload.username != ADMIN_USERNAME or payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = _create_token(payload.username)
    return TokenOut(token=token, username=payload.username)


@api_router.get("/auth/me")
async def me(username: str = Depends(require_admin)):
    return {"username": username}


# ---------- Portfolio Routes ----------
@api_router.get("/portfolio", response_model=List[PortfolioItem])
async def list_portfolio():
    cursor = db.portfolio.find().sort([("order", 1), ("created_at", -1)])
    items = await cursor.to_list(500)
    return [PortfolioItem(**{**it, "id": it.get("id") or str(it.get("_id"))}) for it in items]


@api_router.get("/portfolio/categories")
async def portfolio_categories():
    cats = await db.portfolio.distinct("category")
    cats = [c for c in cats if c]
    return {"categories": ["All"] + sorted(cats)}


def _validate_upload(file: UploadFile) -> str:
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(status_code=400, detail=f"File type {ext or 'unknown'} not allowed. Use jpg, png or webp.")
    return ext


def _save_upload(file: UploadFile, ext: str) -> str:
    fname = f"{uuid.uuid4().hex}{ext}"
    fpath = PORTFOLIO_DIR / fname
    size = 0
    with fpath.open("wb") as f:
        while True:
            chunk = file.file.read(1024 * 1024)
            if not chunk:
                break
            size += len(chunk)
            if size > MAX_UPLOAD_SIZE:
                f.close()
                fpath.unlink(missing_ok=True)
                raise HTTPException(status_code=413, detail="File too large (max 10MB)")
            f.write(chunk)
    return f"/api/uploads/portfolio/{fname}"


@api_router.post("/portfolio", response_model=PortfolioItem)
async def create_portfolio_item(
    title: str = Form(...),
    category: str = Form("Background Removal"),
    year: str = Form(""),
    description: str = Form(""),
    order: int = Form(0),
    image: UploadFile = File(...),
    _: str = Depends(require_admin),
):
    ext = _validate_upload(image)
    image_url = _save_upload(image, ext)
    item = PortfolioItem(
        title=title.strip(),
        category=category.strip() or "Background Removal",
        year=year.strip(),
        description=description.strip(),
        image_url=image_url,
        order=order,
    )
    await db.portfolio.insert_one(item.model_dump())
    return item


@api_router.put("/portfolio/{item_id}", response_model=PortfolioItem)
async def update_portfolio_item(item_id: str, payload: PortfolioUpdate, _: str = Depends(require_admin)):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(status_code=400, detail="No fields to update")
    res = await db.portfolio.find_one_and_update(
        {"id": item_id}, {"$set": update}, return_document=True
    )
    if not res:
        raise HTTPException(status_code=404, detail="Portfolio item not found")
    return PortfolioItem(**res)


@api_router.delete("/portfolio/{item_id}")
async def delete_portfolio_item(item_id: str, _: str = Depends(require_admin)):
    item = await db.portfolio.find_one({"id": item_id})
    if not item:
        raise HTTPException(status_code=404, detail="Portfolio item not found")
    image_url = item.get("image_url", "")
    # Best-effort file cleanup if it's a local upload
    if image_url.startswith("/api/uploads/portfolio/"):
        fname = image_url.split("/")[-1]
        fpath = PORTFOLIO_DIR / fname
        try:
            fpath.unlink(missing_ok=True)
        except Exception as e:
            logging.warning(f"Could not delete file {fpath}: {e}")
    await db.portfolio.delete_one({"id": item_id})
    return {"deleted": True, "id": item_id}


# ---------- Contact / Messages ----------
@api_router.post("/contact", response_model=ContactMessage)
async def submit_contact(payload: ContactIn):
    msg = ContactMessage(
        name=payload.name.strip(),
        email=str(payload.email),
        project=(payload.project or "").strip(),
        message=payload.message.strip(),
    )
    await db.messages.insert_one(msg.model_dump())
    return msg


@api_router.get("/messages", response_model=List[ContactMessage])
async def list_messages(_: str = Depends(require_admin)):
    cursor = db.messages.find().sort("created_at", -1)
    items = await cursor.to_list(1000)
    return [ContactMessage(**it) for it in items]


@api_router.patch("/messages/{msg_id}/read")
async def mark_message_read(msg_id: str, _: str = Depends(require_admin)):
    res = await db.messages.update_one({"id": msg_id}, {"$set": {"read": True}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"read": True}


@api_router.delete("/messages/{msg_id}")
async def delete_message(msg_id: str, _: str = Depends(require_admin)):
    res = await db.messages.delete_one({"id": msg_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"deleted": True}


@api_router.get("/messages/unread-count")
async def unread_count(_: str = Depends(require_admin)):
    n = await db.messages.count_documents({"read": False})
    return {"unread": n}


# ---------- Site Content ----------
@api_router.get("/content")
async def get_all_content():
    items = await db.content.find().to_list(500)
    return {it["key"]: it.get("value") for it in items}


@api_router.put("/content/{key}")
async def update_content(key: str, payload: ContentUpdate, _: str = Depends(require_admin)):
    await db.content.update_one(
        {"key": key},
        {"$set": {"key": key, "value": payload.value, "updated_at": datetime.now(timezone.utc)}},
        upsert=True,
    )
    return {"key": key, "value": payload.value}


# ---------- Seed ----------
DEFAULT_CONTENT = {
    "profile": {
        "name": "Areeb Rayyan",
        "shortName": "Areeb",
        "role": "Photoshop Freelancer & Aspiring Visual Designer",
        "tagline": "Clean cutouts, sharp selections, honest growth",
        "status": "Open for freelance",
        "location": "Greater Noida, India",
        "university": "Galgotias University",
        "course": "Bachelor of Physiotherapy",
        "courseYears": "2025 — 2029",
        "photoUrl": "https://customer-assets.emergentagent.com/job_areeb-portfolio/artifacts/nihm2v2m_my%20photo.jpeg",
        "shortBio": "BPT student by day, Photoshop freelancer by night — building a side hustle one edit at a time.",
        "longBio": "I'm Areeb — a Bachelor of Physiotherapy student at Galgotias University, and a self-driven Photoshop freelancer on the side. I'm halfway through a complete Photoshop course and have already mastered the core editing toolkit — selections, masks, layers, blend modes, refine edge, sky replacement and more. Over the next 2 months I'm expanding into Illustrator, Premiere Pro and After Effects to become a full visual + motion designer. Right now I'm taking on small freelance briefs to sharpen my craft, build a real portfolio, and earn alongside my studies.",
        "email": "areebrayyan2005@gmail.com",
        "instagram": "_digitalarru",
        "instagramUrl": "https://instagram.com/_digitalarru",
    },
    "stats": [
        {"value": "24h", "label": "Avg. reply time"},
        {"value": "Free", "label": "Revisions until happy"},
        {"value": "1:1", "label": "Direct chat with me"},
        {"value": "₹", "label": "Student-friendly rates"},
    ],
    "tools": [
        "Pen Tool", "Layer Masks", "Select & Mask", "Refine Edge", "Magic Wand",
        "Quick Selection", "Object Selection", "Magnetic Lasso", "Blend Modes",
        "Layer Styles", "Content-Aware Fill", "Sky Replacement",
    ],
    "services": [
        {"id": 1, "number": "01", "title": "Background Removal", "description": "Pixel-perfect cutouts using Pen Tool, Quick Selection, Object Selection and Refine Edge. Clean transparent PNGs ready for ecommerce, social or print.", "deliverables": ["Transparent PNG", "White / custom backdrop", "Hair & edge refinement"], "featured": True},
        {"id": 2, "number": "02", "title": "Subject Isolation & Sky Replacement", "description": "Isolate subjects, swap dull skies, and clean up busy backgrounds using channel selection, masks and Photoshop's sky replacement workflow.", "deliverables": ["Sky swap", "Subject isolation", "Background cleanup"], "featured": False},
        {"id": 3, "number": "03", "title": "Basic Compositing & Layer Effects", "description": "Combine images cleanly using layer masks, blending modes, layer styles and gradients — perfect for thumbnails, social posts and simple posters.", "deliverables": ["Layered composite", "Blend mode finish", "Drop shadow / glow"], "featured": False},
        {"id": 4, "number": "04", "title": "Crop, Straighten & Content-Aware Cleanup", "description": "Tighten compositions, fix tilted horizons, remove unwanted objects with Content-Aware fill, and prepare images for any platform.", "deliverables": ["Perspective crop", "Object removal", "Platform-ready export"], "featured": False},
    ],
    "roadmap": [
        {"id": 1, "status": "in-progress", "badge": "Now", "tool": "Adobe Photoshop", "timeline": "In progress", "description": "Mid-way through a complete Photoshop course. Selections, masks, blending, layer styles, sky replacement — all locked in."},
        {"id": 2, "status": "upcoming", "badge": "Month 1", "tool": "Adobe Illustrator", "timeline": "Starting soon", "description": "Vectors, logos, illustrations and brand assets to expand my freelance offering."},
        {"id": 3, "status": "upcoming", "badge": "Month 2", "tool": "Adobe Premiere Pro", "timeline": "Queued up", "description": "Video editing for reels, ads and short-form content."},
        {"id": 4, "status": "upcoming", "badge": "Month 2", "tool": "Adobe After Effects", "timeline": "Queued up", "description": "Motion graphics and animation for thumbnails, intros and social."},
    ],
    "marqueeWords": ["Background Removal", "Sky Replacement", "Pixel Precision", "Layer Magic", "Always Learning", "Side Hustle Mode"],
    "aboutFacts": [
        {"label": "Currently", "value": "BPT Student"},
        {"label": "University", "value": "Galgotias University"},
        {"label": "Years", "value": "2025 — 2029"},
        {"label": "Mode", "value": "Solo · Side hustle"},
    ],
}

DEFAULT_PORTFOLIO = [
    {
        "title": "Red Pickup Truck Cutout",
        "category": "Background Removal",
        "year": "2025",
        "description": "Removed dark studio backdrop, kept clean edges and reflective highlights intact.",
        "image_url": "https://customer-assets.emergentagent.com/job_areeb-portfolio/artifacts/c8dh4mg1_portfolio%201%20sample%202.png",
        "order": 1,
    },
    {
        "title": "Elephant Subject Isolation",
        "category": "Background Removal",
        "year": "2025",
        "description": "Isolated subject from a busy outdoor scene — fine tusk and trunk edges preserved.",
        "image_url": "https://customer-assets.emergentagent.com/job_areeb-portfolio/artifacts/kidhz996_portfolio%201%20sample%203.png",
        "order": 2,
    },
    {
        "title": "Trees & Meadow Cleanup",
        "category": "Background Removal",
        "year": "2025",
        "description": "Removed sky and refined leaf edges for a natural, drop-in-anywhere asset.",
        "image_url": "https://customer-assets.emergentagent.com/job_areeb-portfolio/artifacts/ymfu8rkn_portfolio%201%20sample%201.png",
        "order": 3,
    },
]


async def seed_if_empty():
    # Seed content
    for key, value in DEFAULT_CONTENT.items():
        existing = await db.content.find_one({"key": key})
        if not existing:
            await db.content.insert_one({
                "key": key, "value": value,
                "updated_at": datetime.now(timezone.utc),
            })
    # Seed portfolio
    count = await db.portfolio.count_documents({})
    if count == 0:
        for it in DEFAULT_PORTFOLIO:
            item = PortfolioItem(**it)
            await db.portfolio.insert_one(item.model_dump())


# ---------- Health ----------
@api_router.get("/")
async def root():
    return {"message": "Areeb Rayyan Portfolio API", "status": "ok"}


# ---------- Wire up ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def on_startup():
    await seed_if_empty()
    logger.info("Seed complete")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
