"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DAILY_PROGRESS_UPDATE_EVENT } from "@/lib/daily";
import { buildMergedleDailyShareText } from "@/lib/mergedleDailyShareText";

function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      resolve();
    } catch {
      reject(new Error("copy failed"));
    }
  });
}

/**
 * Daily results share UI — layout/classes aligned with Royaledly (Clash-Royale-Games DailyResultsShareBox).
 * Copy / Post on X behavior and share text stay Mergedle-specific.
 */
export default function ClassicShareBox({
  dayKey,
  className = "mt-6",
  celebrate = true,
}: {
  dayKey: string;
  className?: string;
  celebrate?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [rev, setRev] = useState(0);

  useEffect(() => {
    const bump = () => setRev((r) => r + 1);
    window.addEventListener(DAILY_PROGRESS_UPDATE_EVENT, bump);
    return () => window.removeEventListener(DAILY_PROGRESS_UPDATE_EVENT, bump);
  }, []);

  const text = useMemo(() => buildMergedleDailyShareText(dayKey), [dayKey, rev]);

  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard may be denied */
    }
  }, [text]);

  const postOnX = useCallback(() => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [text]);

  return (
    <div className={`w-full space-y-4 text-center ${className}`}>
      {/* Verbatim header block from Clash-Royale-Games DailyResultsShareBox (+ .homepage-text-shadow on GamePageBackground) */}
      <div className="space-y-1">
        {celebrate ? (
          <>
            <p className="text-2xl" aria-hidden>
              🎉
            </p>
            <p className="font-supercell text-2xl font-bold tracking-wide text-yellow-400 drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">
              GREAT JOB!
            </p>
          </>
        ) : null}
        <p className="font-supercell text-sm font-semibold uppercase tracking-wider text-white/90">
          Share your results
        </p>
      </div>

      <div className="share-results-panel rounded-xl border border-white/25 bg-black/60 p-4 text-left shadow-inner backdrop-blur-sm">
        <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-white">
          {text}
        </pre>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 rounded-xl border-b-4 border-green-800 bg-green-600 px-8 py-3 font-supercell text-sm font-bold text-white shadow-md transition-colors hover:bg-green-500 active:border-b-0 active:translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          type="button"
          onClick={postOnX}
          className="inline-flex items-center justify-center rounded-xl border-b-4 border-sky-900 bg-sky-500 px-8 py-3 font-supercell text-sm font-bold text-white shadow-md transition-colors hover:bg-sky-400 active:border-b-0 active:translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Post results on X"
        >
          Post on X
        </button>
      </div>
    </div>
  );
}
