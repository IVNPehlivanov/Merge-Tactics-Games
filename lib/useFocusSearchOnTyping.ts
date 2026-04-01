"use client";

import { useEffect, useRef, type RefObject } from "react";

function isEditableTarget(el: EventTarget | null): boolean {
  if (!el || !(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  if (el.closest("[contenteditable='true']")) return true;
  return false;
}

function isFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}

/**
 * On devices with a fine pointer (mouse / typical desktop), typing focuses the
 * search input when focus is not already in another editable field. The first
 * key (and Backspace) are applied via `commit` so nothing is lost.
 */
export function useFocusSearchOnTyping(
  inputRef: RefObject<HTMLInputElement | null>,
  options: {
    enabled: boolean;
    commit: (next: string) => void;
  },
) {
  const { enabled, commit } = options;
  const commitRef = useRef(commit);
  commitRef.current = commit;

  useEffect(() => {
    if (!enabled || !isFinePointer()) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Tab" || e.key === "Escape" || e.key === "Enter") return;

      const active = document.activeElement;
      if (active === inputRef.current) return;
      if (isEditableTarget(active)) return;

      const isPrintable = e.key.length === 1;
      const isBackspace = e.key === "Backspace";
      if (!isPrintable && !isBackspace) return;

      const input = inputRef.current;
      if (!input) return;

      e.preventDefault();
      const current = input.value;
      const next = isBackspace ? current.slice(0, -1) : current + e.key;
      commitRef.current(next);
      input.focus({ preventScroll: true });
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [enabled, inputRef]);
}
