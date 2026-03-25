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

/** Chunky 3D-style action button (green or blue) */
function shareActionButtonClass(tone: "copy" | "x") {
  const base =
    "font-game relative flex min-h-[3rem] flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-black/25 px-3 py-2.5 text-sm font-bold text-white no-underline transition-[transform,filter,box-shadow] duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40";
  if (tone === "copy") {
    return `${base} share-btn-3d-copy`;
  }
  return `${base} share-btn-3d-x`;
}

export default function ClassicShareBox({ dayKey }: { dayKey: string }) {
  const [copied, setCopied] = useState(false);
  const [rev, setRev] = useState(0);

  useEffect(() => {
    const bump = () => setRev((r) => r + 1);
    window.addEventListener(DAILY_PROGRESS_UPDATE_EVENT, bump);
    return () => window.removeEventListener(DAILY_PROGRESS_UPDATE_EVENT, bump);
  }, []);

  const text = useMemo(() => buildMergedleDailyShareText(dayKey), [dayKey, rev]);

  const tweetHref = useMemo(
    () => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
    [text],
  );

  const onCopy = useCallback(() => {
    void copyToClipboard(text).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      },
      () => {
        /* ignore */
      },
    );
  }, [text]);

  return (
    <div className="mt-4 w-full text-left">
      <div className="whitespace-pre-wrap rounded-xl border border-white/15 bg-black px-4 py-3 font-mono text-[13px] leading-relaxed text-white sm:text-sm">
        {text}
      </div>
      <div className="mt-3 flex gap-3">
        <button type="button" onClick={onCopy} className={shareActionButtonClass("copy")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="shrink-0"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          {copied ? "Copied!" : "Copy"}
        </button>
        <a
          href={tweetHref}
          target="_blank"
          rel="noopener noreferrer"
          className={shareActionButtonClass("x")}
          aria-label="Post results on X"
        >
          Post on X
        </a>
      </div>
    </div>
  );
}
