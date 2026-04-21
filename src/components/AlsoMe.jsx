import { alsoMe } from '../data/alsoMe.js';

// Placeholder for image slots until real photos are dropped in.
// TODO: replace per-card with actual imagery; dimensions noted per card
// (landscape 16:9, square 1:1, portrait 3:4).
function ImagePlaceholder({ label, aspect }) {
  return (
    <div
      className={`relative ${aspect} w-full overflow-hidden rounded-lg bg-gradient-to-br from-white/5 via-cyan/5 to-purple/10 border border-white/5`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-mono uppercase tracking-wider text-ink/30">
          TODO · {label}
        </span>
      </div>
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(rgba(0,212,255,0.08) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />
    </div>
  );
}

function Card({ item, featured = false }) {
  const isExternal = item.link && /^https?:\/\//.test(item.link);
  const isPlaceholder = !item.link || item.link === '#';
  const Tag = item.link && !isPlaceholder ? 'a' : 'div';
  const linkProps =
    item.link && !isPlaceholder
      ? {
          href: item.link,
          target: isExternal ? '_blank' : undefined,
          rel: isExternal ? 'noopener noreferrer' : undefined,
        }
      : {};

  return (
    <Tag
      {...linkProps}
      className={`group relative flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 no-underline ${
        !isPlaceholder
          ? 'hover:border-cyan/40 hover:-translate-y-1 hover:shadow-cyan-glow'
          : 'hover:border-white/20'
      } ${featured ? 'sm:col-span-2' : ''}`}
    >
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan/80">
          {item.tag}
        </span>
        <h3
          className={`font-semibold text-ink group-hover:text-cyan transition-colors ${
            featured ? 'text-2xl' : 'text-lg'
          }`}
        >
          {item.title}
          {isExternal && (
            <span className="ml-2 text-cyan/60 text-xs align-middle">↗</span>
          )}
        </h3>
        <p className="text-sm text-ink/70 leading-relaxed">{item.line}</p>
        {item.chatPrompt && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              document
                .getElementById('chat')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              window.dispatchEvent(
                new CustomEvent('chat:ask', { detail: { question: item.chatPrompt } })
              );
            }}
            className="mt-2 self-start text-xs font-mono text-cyan/70 hover:text-cyan transition-colors"
          >
            Ask the AI →
          </button>
        )}
      </div>
    </Tag>
  );
}

export default function AlsoMe() {
  const [featured, ...rest] = alsoMe;

  return (
    <section id="also-me" className="section">
      <h2 className="h-section">Also Me</h2>
      <p className="mt-4 sub">When there&rsquo;s no agenda, this is what happens.</p>
      <p className="mt-2 text-sm text-ink/50">
        The same curiosity that shows up at work shows up here too. These are some of the highlights.
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5 auto-rows-auto">
        <Card item={featured} featured />
        {rest.map((item) => (
          <Card key={item.title} item={item} />
        ))}
      </div>

      <div className="mt-12 rounded-2xl border-l-2 border-cyan bg-white/[0.015] px-6 py-5">
        <p className="text-ink/80 leading-relaxed">
          All of this uses the same brain. The same curiosity that redesigns
          operations systems at work also builds synchronized holiday light shows
          using Raspberry Pis. The work is different. The question is always the same:
          how do I make this better for the people it affects?
        </p>
      </div>

      <p className="mt-6 text-xs text-ink/40 text-center">
        This section gets updated. Come back.
      </p>
    </section>
  );
}
