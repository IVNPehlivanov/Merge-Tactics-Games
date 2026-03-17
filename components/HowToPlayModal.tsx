"use client";
import { useState } from "react";

interface Props {
  title: string;
  steps: string[];
}

export default function HowToPlayModal({ title, steps }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-white/50 hover:text-white text-sm underline transition-colors"
      >
        How to play
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-game text-indigo-400 text-xl mb-4">How to Play: {title}</h2>
            <ol className="space-y-2 text-sm text-white/80 list-decimal list-inside">
              {steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <button
              onClick={() => setOpen(false)}
              className="mt-6 w-full py-2 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-400 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
