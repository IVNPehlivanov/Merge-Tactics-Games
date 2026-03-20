"use client";
import { useEffect, useState } from "react";

function QuestionIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

/**
 * Always in the DOM so search engines crawl the content.
 * Visibility is toggled via CSS opacity/pointer-events.
 */
export default function HowToPlayModal({
  children,
  triggerAriaLabel = "How to Play",
}: {
  children: React.ReactNode;
  triggerAriaLabel?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock scroll and handle Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    const scrollY = window.scrollY;
    document.body.style.overflow   = "hidden";
    document.body.style.position   = "fixed";
    document.body.style.top        = `-${scrollY}px`;
    document.body.style.width      = "100%";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top      = "";
      document.body.style.width    = "";
      window.scrollTo(0, scrollY);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  return (
    <>
      {/* (?) trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="shrink-0 rounded-full border-2 border-white/30 bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        aria-label={triggerAriaLabel}
      >
        <QuestionIcon className="size-5" />
      </button>

      {/* Modal — always in DOM for SEO; hidden via CSS when closed */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-to-play-title"
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-200 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ overscrollBehavior: "contain" }}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 min-h-[100dvh] bg-black/70 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden
          style={{ touchAction: "none" }}
        />

        {/* Panel */}
        <div
          className="relative max-h-[90dvh] w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close X */}
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
