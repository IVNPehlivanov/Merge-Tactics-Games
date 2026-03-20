export default function GamePageBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen text-white">
      {/* Same background as homepage */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/homepage/March_Season_-_Dagger_Duchess_Skin_Color_v1.webp')" }}
      />
      <div className="fixed inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}
