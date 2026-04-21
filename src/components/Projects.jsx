import { useState } from 'react';
import { projects } from '../data/projects.js';

function ProjectCard({ p }) {
  const [expanded, setExpanded] = useState(false);
  const isInternal = p.link?.startsWith('#') && p.link.length > 1;
  const isExternal = p.link && !p.link.startsWith('#');
  const isPlaceholder = !p.link || p.link === '#';

  const handleClick = (e) => {
    // Mobile: expand on tap, don't navigate
    if (window.innerWidth < 768) {
      e.preventDefault();
      setExpanded(!expanded);
      return;
    }

    // Desktop: navigate on click
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
      href={p.link || '#'}
      target={isExternal && window.innerWidth >= 768 ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      className={`card group flex flex-col no-underline transition-all ${
        isPlaceholder ? 'cursor-default' : 'md:cursor-pointer'
      } ${expanded ? 'md:expanded' : ''}`}
      aria-disabled={isPlaceholder || undefined}
    >
      <span className="pill self-start mb-4">{p.tag}</span>
      <h3 className="text-xl font-semibold text-ink mb-3 group-hover:text-cyan transition-colors">
        {p.title}
      </h3>
      <p className="text-sm text-ink/70 leading-relaxed">{p.description}</p>

      {/* Mobile: expand details on tap */}
      <div
        className={`md:hidden mt-3 pt-3 border-t border-white/10 transition-all overflow-hidden ${
          expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-xs text-cyan/80 mb-2">→ Tap card to close</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {p.chatPrompt && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                document
                  .getElementById('chat')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                window.dispatchEvent(
                  new CustomEvent('chat:ask', { detail: { question: p.chatPrompt } })
                );
              }}
              className="inline-block px-3 py-1.5 rounded-full bg-cyan/20 text-cyan text-xs font-semibold hover:bg-cyan/30 transition-colors"
            >
              Ask the AI →
            </button>
          )}
          {isExternal && (
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-block px-3 py-1.5 rounded-full border border-cyan/40 text-cyan text-xs font-semibold hover:bg-cyan/10 transition-colors"
            >
              Visit →
            </a>
          )}
        </div>
      </div>
    </a>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section">
      <h2 className="h-section">Working On Right Now</h2>
      <p className="mt-4 sub">Excited about a lot—these are some of the things beyond the sketch phase.</p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((p) => (
          <ProjectCard key={p.title} p={p} />
        ))}
      </div>
    </section>
  );
}
