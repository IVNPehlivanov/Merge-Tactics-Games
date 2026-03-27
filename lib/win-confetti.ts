"use client";

import confetti from "canvas-confetti";

let cannon: ReturnType<typeof confetti.create> | null = null;

function getCannon() {
  if (typeof window === "undefined") return null;
  if (!cannon) {
    cannon = confetti.create(undefined, { useWorker: false, resize: true });
  }
  return cannon;
}

/** Confetti burst from the center of a DOM rect (e.g. winning card / win panel). */
export function fireWinConfettiFromRect(rect: DOMRectReadOnly) {
  const fire = getCannon();
  if (!fire || rect.width <= 0 || rect.height <= 0) return;
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;
  const origin = { x, y };
  const opts = {
    particleCount: 120,
    origin,
    spread: 100,
    startVelocity: 65,
    scalar: 1.8,
    disableForReducedMotion: true,
  };
  fire({ ...opts, angle: 60 });
  fire({ ...opts, angle: 120 });
}

/** Confetti from viewport center — used when the win panel is not in a known DOM node. */
export function fireWinConfettiFromViewportCenter() {
  if (typeof window === "undefined") return;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  fireWinConfettiFromRect(new DOMRect(cx - 1, cy - 1, 2, 2));
}
