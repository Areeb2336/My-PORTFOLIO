#!/usr/bin/env python3
"""
Quick test for static file serving after uploading an image
"""

import requests
import io
from PIL import Image

# Configuration
BACKEND_URL = "https://areeb-portfolio.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"
ADMIN_USERNAME = "Arru@8080"
ADMIN_PASSWORD = "Rayyanali@5778"

def create_test_image():
    """Create a small test PNG image"""
    img = Image.new('RGB', (100, 100), color='blue')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return img_bytes

def test_static_file_serving():
    session = requests.Session()
    
    # 1. Login to get token
    login_payload = {
        "username": ADMIN_USERNAME,
        "password": ADMIN_PASSWORD
    }
    login_response = session.post(f"{API_BASE}/auth/login", json=login_payload)
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        return False
    
    token = login_response.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Upload an image
    test_image = create_test_image()
    files = {
        'image': ('static_test.png', test_image, 'image/png')
    }
    data = {
        'title': 'Static File Test',
        'category': 'Background Removal',
        'description': 'Test for static file serving'
    }
    
    upload_response = session.post(f"{API_BASE}/portfolio", files=files, data=data, headers=headers)
    if upload_response.status_code != 200:
        print(f"❌ Upload failed: {upload_response.status_code}")
        return False
    
    upload_data = upload_response.json()
    image_url = upload_data["image_url"]
    portfolio_id = upload_data["id"]
    
    print(f"✅ Image uploaded: {image_url}")
    
    # 3. Test static file serving
    full_url = f"{BACKEND_URL}{image_url}"
    static_response = session.get(full_url)
    
    success = False
    if static_response.status_code == 200:
        content_type = static_response.headers.get("content-type", "")
        if "image" in content_type.lower():
            print(f"✅ Static file serving works: {content_type}")
            success = True
        else:
            print(f"❌ Wrong content-type: {content_type}")
    else:
        print(f"❌ Static file request failed: {static_response.status_code}")
    
    # 4. Cleanup - delete the test image
    delete_response = session.delete(f"{API_BASE}/portfolio/{portfolio_id}", headers=headers)
    if delete_response.status_code == 200:
        print(f"✅ Test image cleaned up")
    else:
        print(f"⚠️ Cleanup failed: {delete_response.status_code}")
    
    return success

if __name__ == "__main__":
    print("Testing static file serving...")
    success = test_static_file_serving()
    if success:
        print("\n🎉 Static file serving test PASSED")
    else:
        print("\n❌ Static file serving test FAILED")