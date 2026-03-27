import Image from "next/image";

export default function GamePageBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen text-white">
      {/* Same background as homepage */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/homepage/March_Season_-_Dagger_Duchess_Skin_Color_v1.webp')" }}
      />
      <div className="fixed inset-0 bg-black/30" />

      {/* Content — Royaledly: homepage-text-shadow on game column for readable overlays */}
      <div
        className="relative z-10 mx-auto max-w-4xl px-4 py-6 homepage-text-shadow"
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "56rem",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          paddingTop: "1.5rem",
          paddingBottom: "1.5rem",
          color: "#fff",
        }}
      >
        {children}
        <div className="mt-8 mb-6 w-full max-w-md mx-auto px-4 text-center">
          <div className="w-full rounded-2xl border-2 border-yellow-500/60 bg-black/70 px-5 py-4">
            <div className="flex flex-col items-center gap-0">
              <div className="relative z-0 w-full text-center">
                <p className="mb-0 text-green-400 font-game text-base leading-tight">Want more?</p>
                <p className="mb-0 mt-0.5 text-white font-game text-sm leading-tight">
                  Play our other games:
                </p>
              </div>
              <div className="relative z-10 -mt-5 flex w-full justify-center">
                <a
                  href="https://royaledly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-0 transition-transform hover:scale-110"
                >
                  <Image
                    src="/homepage/royaledlyLogo.webp"
                    alt="Royaledly"
                    width={168}
                    height={168}
                    className="relative z-10 block h-[168px] w-[168px] shrink-0 rounded-full object-contain drop-shadow-lg"
                  />
                  <span className="relative z-0 -mt-4 text-white/80 font-game text-xs">
                    Royaledly
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
