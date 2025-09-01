import { useEffect, useRef, useState } from "react";
export default function ScratchCard({
  width = 320,
  height = 180,
  coverColor = "#b0b0b0",
  coverImage,
  radius = 18,
  percentToFinish = 50,
  onComplete = () => {},
  children,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDrawingRef = useRef(false);
  const [done, setDone] = useState(false);
  const movesSinceCheck = useRef(0);

  // Draw cover layer (color or image)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    if (coverImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
      };
      img.src = coverImage;
    } else {
      ctx.fillStyle = coverColor;
      ctx.fillRect(0, 0, width, height);
    }
  }, [width, height, coverColor, coverImage]);

  // Helpers
  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const eraseDot = (x, y) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  };

  const handleStart = (e) => {
    if (done) return;
    isDrawingRef.current = true;
    eraseAtEvent(e);
  };

  const handleMove = (e) => {
    if (!isDrawingRef.current || done) return;
    eraseAtEvent(e);
  };

  const handleEnd = () => {
    isDrawingRef.current = false;
  };

  const eraseAtEvent = (e) => {
    e.preventDefault();
    const { x, y } = getPoint(e);
    eraseDot(x, y);

    // check cleared area every few moves to keep it fast
    if (++movesSinceCheck.current % 8 === 0) {
      const cleared = estimateClearedPercent(canvasRef.current, 4); // sample every 4px
      if (cleared >= percentToFinish) {
        setDone(true);
        // Clear completely for a clean reveal
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        onComplete(cleared);
      }
    }
  };

  // Estimate cleared percentage by sampling pixels at a step
  const estimateClearedPercent = (canvas, step = 4) => {
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;
    let total = 0;
    let cleared = 0;

    // Sample alpha channel
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const idx = (y * width + x) * 4 + 3; // alpha index
        const a = data[idx];
        total++;
        if (a < 10) cleared++; // nearly transparent
      }
    }
    return Math.round((cleared / total) * 100);
  };

  // Pointer events (mouse + touch)
  useEffect(() => {
    const canvas = canvasRef.current;
    const opts = { passive: false };
    canvas.addEventListener("mousedown", handleStart, opts);
    canvas.addEventListener("mousemove", handleMove, opts);
    window.addEventListener("mouseup", handleEnd, opts);

    canvas.addEventListener("touchstart", handleStart, opts);
    canvas.addEventListener("touchmove", handleMove, opts);
    window.addEventListener("touchend", handleEnd, opts);
    window.addEventListener("touchcancel", handleEnd, opts);

    return () => {
      canvas.removeEventListener("mousedown", handleStart, opts);
      canvas.removeEventListener("mousemove", handleMove, opts);
      window.removeEventListener("mouseup", handleEnd, opts);

      canvas.removeEventListener("touchstart", handleStart, opts);
      canvas.removeEventListener("touchmove", handleMove, opts);
      window.removeEventListener("touchend", handleEnd, opts);
      window.removeEventListener("touchcancel", handleEnd, opts);
    };
  }, [done, radius, percentToFinish]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width,
        height,
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {/* Revealed content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
        }}
      >
        {children}
      </div>

      {/* Scratch layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          cursor: done ? "default" : "grab",
          borderRadius: 12,
        }}
      />
    </div>
  );
}
