"use client";
import { useEffect, useState } from "react";

/** Id of the primary nav (?) button — in-game duplicates can call `.click()` on this element to open the same help modal. */
export const MERGEDLE_GAME_HELP_BUTTON_ID = "mergedle-game-help-btn";

const helpBtnBaseClass =
  "group relative inline-flex shrink-0 items-center justify-center rounded-full border border-slate-400/80 bg-gradient-to-b from-slate-100 to-slate-300 p-1 shadow-[0_2px_8px_rgba(0,0,0,0.35)] transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80";

const helpBtnOuter = { sm: "size-10", md: "size-12" } as const;
const helpBtnInset = { sm: "inset-[2px]", md: "inset-[3px]" } as const;
const helpBtnInner = { sm: "size-7 text-[15px]", md: "size-8 text-[18px]" } as const;

/** Shared (?) help trigger — hover tooltip above the button. */
export function GameHelpIconButton({
  id,
  onClick,
  ariaLabel,
  tooltip = "How to play",
  size = "md",
}: {
  id?: string;
  onClick: () => void;
  ariaLabel: string;
  tooltip?: string;
  size?: keyof typeof helpBtnOuter;
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={`${helpBtnBaseClass} ${helpBtnOuter[size]}`}
      aria-label={ariaLabel}
      title={tooltip}
    >
      <span
        className={`absolute rounded-full bg-gradient-to-b from-white/90 to-slate-200/80 ${helpBtnInset[size]}`}
        aria-hidden
      />
      <span
        className={`relative inline-flex items-center justify-center rounded-full border border-slate-900/80 bg-slate-700 font-extrabold leading-none text-slate-100 shadow-inner ${helpBtnInner[size]}`}
      >
        ?
      </span>
      {tooltip ? (
        <span
          className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/15 bg-gray-900/95 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
          role="tooltip"
        >
          {tooltip}
        </span>
      ) : null}
    </button>
  );
}

/**
 * Always in the DOM so search engines crawl the content.
 * Visibility is toggled via CSS opacity/pointer-events.
 */
export default function HowToPlayModal({
  children,
  triggerAriaLabel = "How to Play",
  tooltipLabel = "How to play",
}: {
  children: React.ReactNode;
  triggerAriaLabel?: string;
  /** Shown above the (?) button on hover/focus and as the native `title` tooltip. */
  tooltipLabel?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  return (
    <>
      <GameHelpIconButton
        id={MERGEDLE_GAME_HELP_BUTTON_ID}
        ariaLabel={triggerAriaLabel}
        tooltip={tooltipLabel}
        size="md"
        onClick={() => setIsOpen(true)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-to-play-title"
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-200 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{
          overscrollBehavior: "contain",
          ...(!isOpen ? { opacity: 0, pointerEvents: "none", visibility: "hidden" as const } : {}),
        }}
      >
        <div
          className="fixed inset-0 min-h-[100dvh] bg-black/70 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden
          style={{ touchAction: "none" }}
        />

        <div
          className="relative max-h-[90dvh] w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <div
            className="max-h-[90dvh] overflow-y-auto p-6 pr-12 pb-10"
            style={{ paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom))" }}
          >
            <div className="space-y-3">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
