import { useEffect, useState } from 'react';

const RESUME_URL =
  'https://www.dropbox.com/scl/fi/oi3wfunluv5q2kyxl3i4m/Chris-Powell-Resume-October-2025.pdf?rlkey=208t4b03iq8ac671iih7lim4w&dl=0';

const LINKS = [
  { label: 'About', href: '#about', section: 'about' },
  { label: 'Projects', href: '#projects', section: 'projects' },
  { label: 'Also Me', href: '#also-me', section: 'also-me' },
  { label: 'Chat', href: '#chat', section: 'chat' },
  { label: 'Contact', href: '#contact', section: 'contact' },
];

const OBSERVED_IDS = ['about', 'projects', 'also-me', 'chat', 'contact'];

export default function Navigation({ visible = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Translucent -> glass on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section highlight: section enters a band near the top of viewport
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the highest intersectionRatio among those intersecting
        let best = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry;
          }
        }
        if (best) setActiveSection(best.target.id);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    const elements = OBSERVED_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Close mobile menu on escape
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const handleLinkClick = (e, link) => {
    if (link.external) {
      setMobileOpen(false);
      return; // allow natural target="_blank" navigation
    }
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(link.href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBrandClick = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const linkClass = (link) => {
    const isActive = !link.external && activeSection === link.section;
    return `text-sm tracking-tight transition-colors ${
      isActive ? 'text-cyan' : 'text-ink/70 hover:text-ink'
    }`;
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4 pointer-events-none'
      } ${
        scrolled
          ? 'bg-bg/70 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a
          href="#top"
          onClick={handleBrandClick}
          className="font-mono text-cyan text-lg font-semibold tracking-tight hover:text-cyan/80 transition-colors"
        >
          CP.AI
        </a>

        <ul className="hidden sm:flex items-center gap-4 md:gap-7">
          {LINKS.filter(l => l.label !== 'Contact').map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={(e) => handleLinkClick(e, link)}
                className={linkClass(link)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm tracking-tight transition-colors text-ink/70 hover:text-ink"
            >
              Resume
            </a>
          </li>
          <li>
            <a
              href="mailto:hello@chrispowell.ai"
              className="pill ml-2"
              title="Email Chris"
            >
              Get in touch
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="sm:hidden p-2 -mr-2 text-ink/80 hover:text-cyan transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>
      </nav>

      <div
        className={`sm:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } bg-bg/95 backdrop-blur-md border-b border-white/5`}
      >
        <ul className="px-6 py-3">
          {LINKS.filter(l => l.label !== 'Contact').map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={(e) => handleLinkClick(e, link)}
                className={`block py-3 text-base ${linkClass(link)}`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-base text-ink/70 hover:text-ink transition-colors"
            >
              Resume
            </a>
          </li>
          <li>
            <a
              href="mailto:hello@chrispowell.ai"
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-base pill inline-block mt-2"
              title="Email Chris"
            >
              Get in touch
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
