"use client";

import Link from "next/link";
import Image from "next/image";

/** Same layout as homepage “Want more?” / Royaledly block (`app/page.tsx`). */
export function RoyaledlyPromoBox() {
  return (
    <div className="mx-auto w-full max-w-md px-0 text-center">
      <div className="w-full rounded-2xl border-2 border-yellow-500/60 bg-black/70 px-5 py-4">
        <div className="flex flex-col items-center gap-0">
          <div className="relative z-0 w-full text-center">
            <p className="mb-0 text-base font-game leading-tight text-green-400">Want more?</p>
            <p className="mb-0 mt-0.5 text-sm font-game leading-tight text-white">
              Play our other games:
            </p>
          </div>
          <div className="relative z-10 -mt-5 flex w-full justify-center">
            <Link
              href="https://royaledly.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Royaledly website"
              className="flex flex-col items-center gap-0 transition-transform hover:scale-110"
            >
              <Image
                src="/homepage/royaledlyLogo.webp"
                alt="Royaledly"
                width={168}
                height={168}
                className="relative z-10 block h-[168px] w-[168px] shrink-0 rounded-full object-contain drop-shadow-lg"
              />
              <span className="relative z-0 -mt-4 text-xs font-game text-white/80">Royaledly</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
