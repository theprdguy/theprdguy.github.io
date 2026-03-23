'use client';

import { useEffect, useRef } from 'react';

export default function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let lastDrawTime = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = (time: number) => {
      animationFrameId = requestAnimationFrame(draw);

      // Throttle to ~10 FPS for performance
      if (time - lastDrawTime < 100) return;
      lastDrawTime = time;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Use a smaller offscreen canvas or typed array to draw noise efficiently
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const c = Math.random() * 255;
        data[i] = c;     // r
        data[i + 1] = c; // g
        data[i + 2] = c; // b
        data[i + 3] = 255; // alpha (handled by canvas opacity)
      }
      
      ctx.putImageData(imgData, 0, 0);
    };

    window.addEventListener('resize', resize);
    resize();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[9999]"
      style={{ opacity: 0.04 }}
    />
  );
}
