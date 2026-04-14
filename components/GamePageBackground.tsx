"use client";
import { useEffect, useRef } from "react";

export default function GamePageBackground({ children }: { children: React.ReactNode }) {
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lastW = useRef(0);

  useEffect(() => {
    // Lock the background height to the viewport height captured before the keyboard opens.
    // On iOS, position:fixed elements resize with the visual viewport when the keyboard appears,
    // making bg-cover zoom in. We only update on orientation change (width changes), not on
    // keyboard open (which only changes height, not width).
    const lock = () => {
      const h = window.innerHeight;
      lastW.current = window.innerWidth;
      if (bgRef.current) bgRef.current.style.height = `${h}px`;
      if (overlayRef.current) overlayRef.current.style.height = `${h}px`;
    };

    lock();

    const onResize = () => {
      // Keyboard: only height changes → skip
      // Orientation change: width changes → update
      if (window.innerWidth !== lastW.current) lock();
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="relative min-h-screen w-full min-w-0 overflow-x-clip text-white [overscroll-behavior-x:none]">
      {/* Background height is locked via JS ref — see useEffect above */}
      <div
        ref={bgRef}
        className="fixed inset-x-0 top-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/homepage/March_Season_-_Dagger_Duchess_Skin_Color_v1.webp')" }}
      />
      <div ref={overlayRef} className="fixed inset-x-0 top-0 bg-black/30" />

      {/* Content — Royaledly: homepage-text-shadow on game column for readable overlays */}
      <div className="relative z-10 mx-auto min-w-0 max-w-4xl px-4 py-6 homepage-text-shadow">
        {children}
      </div>
    </div>
  );
}
