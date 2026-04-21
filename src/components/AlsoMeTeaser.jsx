const TEASERS = [
  {
    emoji: '🎄',
    label: 'Powell Family Lights',
    sub: 'Pixels + projection mapping, synced to music.',
  },
  {
    emoji: '🎃',
    label: 'Halloween, Projected',
    sub: 'Photogrammetry \u2192 After Effects \u2192 MadMapper.',
  },
  {
    emoji: '🛠️',
    label: 'The Shop',
    sub: 'Electronics, laser, 3D printing, photography.',
  },
];

export default function AlsoMeTeaser() {
  const scrollToAlsoMe = () => {
    document.getElementById('also-me')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-20">
      <div className="rounded-2xl border border-cyan/20 bg-white/[0.015] p-6 md:p-8">
        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-5">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan/70">
            Same brain, at work and at home
          </p>
          <button
            type="button"
            onClick={scrollToAlsoMe}
            className="text-xs text-cyan/70 hover:text-cyan transition-colors"
          >
            See all →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {TEASERS.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={scrollToAlsoMe}
              className="text-left rounded-xl border border-white/5 bg-white/[0.02] px-4 py-4 hover:border-cyan/40 hover:bg-white/[0.04] transition-colors"
            >
              <div className="text-xl mb-1" aria-hidden="true">
                {t.emoji}
              </div>
              <div className="text-sm font-semibold text-ink">{t.label}</div>
              <div className="text-xs text-ink/60 mt-1 leading-relaxed">{t.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
