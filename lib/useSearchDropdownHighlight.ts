"use client";

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

function isFinePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
}

/**
 * Keyboard + mouse highlight for `.card-search-dropdown` lists (fine pointer: arrows + hover share one index).
 * Pair with `data-search-option-index` on rows and `dropdownRef` on the scroll container.
 */
export function useSearchDropdownHighlight(options: {
  enabled: boolean;
  itemCount: number;
  /** Reset highlight when the query changes (e.g. `search`). */
  resetKey: string;
}) {
  const { enabled, itemCount, resetKey } = options;
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHighlightIndex(-1);
  }, [resetKey]);

  useEffect(() => {
    if (itemCount === 0) setHighlightIndex(-1);
    else setHighlightIndex((h) => (h >= itemCount ? itemCount - 1 : h));
  }, [itemCount]);

  useLayoutEffect(() => {
    if (!enabled || highlightIndex < 0) return;
    const root = dropdownRef.current;
    if (!root) return;
    const el = root.querySelector<HTMLElement>(`[data-search-option-index="${highlightIndex}"]`);
    if (!el) return;
    // Keep scroll inside the dropdown only — scrollIntoView() also scrolls the page on desktop.
    const pad = 4;
    const rootRect = root.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    if (elRect.top < rootRect.top + pad) {
      root.scrollTop -= rootRect.top + pad - elRect.top;
    } else if (elRect.bottom > rootRect.bottom - pad) {
      root.scrollTop += elRect.bottom - (rootRect.bottom - pad);
    }
  }, [enabled, highlightIndex]);

  function handleArrowKeys(e: ReactKeyboardEvent) {
    if (!enabled || !isFinePointer()) return;
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    if (itemCount === 0) return;
    e.preventDefault();
    e.stopPropagation();

    if (e.key === "ArrowDown") {
      setHighlightIndex((h) => (h < 0 ? 0 : Math.min(h + 1, itemCount - 1)));
    } else {
      setHighlightIndex((h) => (h < 0 ? itemCount - 1 : h <= 0 ? -1 : h - 1));
    }
  }

  /** Move the active row under the cursor so `data-search-active` matches hover (CSS hover is suppressed when a row is active). */
  function optionPointerHandlers(optionIndex: number) {
    return {
      onPointerEnter: () => {
        if (!isFinePointer()) return;
        setHighlightIndex(optionIndex);
      },
    };
  }

  function onDropdownPointerLeave(e: ReactPointerEvent<HTMLDivElement>) {
    const rel = e.relatedTarget as Node | null;
    if (rel && dropdownRef.current?.contains(rel)) return;
    setHighlightIndex(-1);
  }

  return { highlightIndex, dropdownRef, handleArrowKeys, optionPointerHandlers, onDropdownPointerLeave };
}
