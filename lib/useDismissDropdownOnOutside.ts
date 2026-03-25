"use client";

import { type RefObject, useEffect, useRef } from "react";

/** Ignore touch drags longer than this so scrolling the page does not close the dropdown. */
const TOUCH_MOVE_THRESHOLD_PX = 14;

/**
 * Close a floating search dropdown on outside interaction.
 * - Mouse: mousedown outside the container (unchanged desktop behavior).
 * - Touch: only after a short finger lift (tap), not when the gesture was a scroll/drag.
 */
export function useDismissDropdownOnOutside(
  containerRef: RefObject<HTMLElement | null>,
  onDismiss: () => void,
) {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    function dismissIfOutside(target: Node | null) {
      if (!target || containerRef.current?.contains(target)) return;
      onDismissRef.current();
    }

    function onMouseDown(e: MouseEvent) {
      dismissIfOutside(e.target as Node | null);
    }

    let touchStartX = 0;
    let touchStartY = 0;
    let touchTracking = false;

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length !== 1) {
        touchTracking = false;
        return;
      }
      touchTracking = true;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }

    function onTouchEnd(e: TouchEvent) {
      if (!touchTracking) return;
      touchTracking = false;
      if (e.changedTouches.length !== 1) return;
      const t = e.changedTouches[0];
      const dx = Math.abs(t.clientX - touchStartX);
      const dy = Math.abs(t.clientY - touchStartY);
      if (dx > TOUCH_MOVE_THRESHOLD_PX || dy > TOUCH_MOVE_THRESHOLD_PX) return;

      const atPoint =
        document.elementFromPoint(t.clientX, t.clientY) ?? (e.target as Node | null);
      dismissIfOutside(atPoint);
    }

    function onTouchCancel() {
      touchTracking = false;
    }

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("touchcancel", onTouchCancel, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [containerRef]);
}
