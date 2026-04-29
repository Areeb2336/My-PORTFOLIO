import React, { useRef, useState, useCallback, useEffect } from "react";
import { GripVertical } from "lucide-react";

/**
 * Before/After image comparison slider.
 * Drag the divider (or click anywhere on the image) to reveal the "before" state.
 */
const BeforeAfterSlider = ({ beforeSrc, afterSrc, beforeLabel = "BEFORE", afterLabel = "AFTER", className = "" }) => {
  const containerRef = useRef(null);
  const [pos, setPos] = useState(50); // percentage 0-100
  const [dragging, setDragging] = useState(false);

  const updatePos = useCallback((clientX) => {
    const node = containerRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPos(pct);
  }, []);

  const onDown = (e) => {
    setDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updatePos(clientX);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updatePos(clientX);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, updatePos]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none cursor-ew-resize ${className}`}
      onMouseDown={onDown}
      onTouchStart={onDown}
    >
      {/* AFTER image (full base) */}
      <img
        src={afterSrc}
        alt="After"
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />

      {/* BEFORE image (clipped to left side) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${pos}%` }}
      >
        <img
          src={beforeSrc}
          alt="Before"
          draggable={false}
          className="absolute inset-0 h-full object-contain pointer-events-none"
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100%", maxWidth: "none" }}
        />
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.25em] px-2 py-1 rounded-full bg-[#0a0a0a]/80 text-[#f3ede1] backdrop-blur-md border border-[#2a2520] pointer-events-none">
        {beforeLabel}
      </span>
      <span className="absolute top-3 right-3 text-[10px] uppercase tracking-[0.25em] px-2 py-1 rounded-full bg-[#ff5e3a] text-[#0a0a0a] pointer-events-none">
        {afterLabel}
      </span>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-[#ff5e3a] pointer-events-none"
        style={{ left: `${pos}%`, transform: "translateX(-1px)" }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 w-10 h-10 rounded-full bg-[#ff5e3a] flex items-center justify-center shadow-lg pointer-events-none"
        style={{ left: `${pos}%`, transform: "translate(-50%, -50%)" }}
      >
        <GripVertical size={18} className="text-[#0a0a0a]" />
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
