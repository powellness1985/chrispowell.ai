import { useEffect, useState } from 'react';

export default function MobileFAB() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show FAB when scrolled past hero (after 800px)
      setVisible(window.scrollY > 800);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <button
      onClick={handleClick}
      className={`lg:hidden fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-cyan text-bg flex items-center justify-center shadow-lg shadow-cyan/40 transition-all duration-300 active:scale-95 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'
      }`}
      aria-label="Jump to chat"
      title="Ask me something"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
