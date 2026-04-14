export default function GamePageBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full min-w-0 overflow-x-clip text-white [overscroll-behavior-x:none]">
      {/* Same background as homepage */}
      <div
        className="fixed inset-x-0 top-0 h-lvh bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/homepage/March_Season_-_Dagger_Duchess_Skin_Color_v1.webp')" }}
      />
      <div className="fixed inset-x-0 top-0 h-lvh bg-black/30" />

      {/* Content — Royaledly: homepage-text-shadow on game column for readable overlays */}
      <div className="relative z-10 mx-auto min-w-0 max-w-4xl px-4 py-6 homepage-text-shadow">
        {children}
      </div>
    </div>
  );
}
