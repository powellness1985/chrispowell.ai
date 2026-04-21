import { projects } from '../data/projects.js';

export default function Projects() {
  return (
    <section id="projects" className="section">
      <h2 className="h-section">Built, Not Just Theorized</h2>
      <p className="mt-4 sub">Three projects that exist in the real world.</p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((p) => {
          const isInternal = p.link?.startsWith('#') && p.link.length > 1;
          const isExternal = p.link && !p.link.startsWith('#');
          const isPlaceholder = !p.link || p.link === '#';

          const handleClick = (e) => {
            if (isPlaceholder) {
              e.preventDefault();
              return;
            }
            if (isInternal) {
              e.preventDefault();
              document
                .querySelector(p.link)
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          };

          return (
            <a
              key={p.title}
              href={p.link || '#'}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              onClick={handleClick}
              className={`card group flex flex-col no-underline ${
                isPlaceholder ? 'cursor-default' : ''
              }`}
              aria-disabled={isPlaceholder || undefined}
            >
              <span className="pill self-start mb-4">{p.tag}</span>
              <h3 className="text-xl font-semibold text-ink mb-3 group-hover:text-cyan transition-colors">
                {p.title}
              </h3>
              <p className="text-sm text-ink/70 leading-relaxed">{p.description}</p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
