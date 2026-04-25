import { useEffect, useRef, useState, useCallback } from 'react';
import TechStack from './TechStack';
import TerminalAnimation from './TerminalAnimation';

const PILLS = [
  'Always Learning',
  'Builder at Heart',
  'Leading with Empathy',
  'Curious by Default',
];

// ASCII chars for the scramble effect
const CHARS = '01アイウエオカキクケコ#$%&<>[]{}|\\/@!?_=+~^░▒▓█';

// How long the scramble intro runs before resolving (ms)
const SCRAMBLE_DURATION = 1600;
// How long particles flash before dissolving (ms)
const PARTICLE_FLASH_MS = 600;

export default function ParticleHero({ onComplete }) {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const rafRef = useRef(null);
  const skippedRef = useRef(false);

  // 'intro' | 'done'
  const [phase, setPhase] = useState('intro');
  const [revealContent, setRevealContent] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(1);

  const finish = useCallback(() => {
    if (skippedRef.current) return;
    skippedRef.current = true;
    cancelAnimationFrame(rafRef.current);
    setRevealContent(true);
    setShowArrow(true);
    setPhase('done');
    // Fade out overlay
    setOverlayOpacity(0);
    onCompleteRef.current?.();
  }, []);

  const handleSkip = useCallback(() => {
    finish();
  }, [finish]);

  // --- Scramble overlay effect ---
  useEffect(() => {
    if (phase !== 'intro') return;

    const overlay = overlayRef.current;
    if (!overlay) return;

    const startTime = performance.now();
    let animId;

    // Build a grid of spans
    const cols = Math.floor(window.innerWidth / 14);
    const rows = Math.floor(window.innerHeight / 22);
    const total = cols * rows;

    overlay.innerHTML = '';
    overlay.style.gridTemplateColumns = `repeat(${cols}, 14px)`;
    overlay.style.gridTemplateRows = `repeat(${rows}, 22px)`;

    const spans = Array.from({ length: total }, () => {
      const s = document.createElement('span');
      s.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
      overlay.appendChild(s);
      return s;
    });

    // Each cell gets a random "resolve time" — when it goes dark/clear
    const resolveTimes = spans.map(() => Math.random() * SCRAMBLE_DURATION * 0.85);

    const tick = (now) => {
      const elapsed = now - startTime;
      const globalProgress = Math.min(elapsed / SCRAMBLE_DURATION, 1);

      spans.forEach((s, i) => {
        if (elapsed > resolveTimes[i]) {
          // Resolved — clear
          s.textContent = '';
          s.style.opacity = '0';
        } else {
          // Still scrambling
          s.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
          // Fade based on global progress
          const cellProgress = elapsed / resolveTimes[i];
          s.style.opacity = String(Math.max(0, 1 - cellProgress * 0.6));
          // Color shifts from cyan → white → transparent
          if (cellProgress < 0.5) {
            s.style.color = '#00D4FF';
          } else {
            s.style.color = `rgba(232,232,240,${1 - cellProgress})`;
          }
        }
      });

      // At ~40% through scramble, start revealing content underneath
      if (globalProgress > 0.4 && !revealContent) {
        setRevealContent(true);
        onCompleteRef.current?.();
      }

      if (globalProgress < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        // Scramble done — flash particle moment on canvas, then finish
        runParticleFlash(() => finish());
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // --- Brief particle flash: "CHRIS POWELL" assembles then dissolves ---
  const runParticleFlash = useCallback((onDone) => {
    const canvas = canvasRef.current;
    if (!canvas) { onDone(); return; }
    const ctx = canvas.getContext('2d');

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const cssWidth = window.innerWidth;
    const cssHeight = window.innerHeight;
    canvas.width = cssWidth * DPR;
    canvas.height = cssHeight * DPR;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // Sample "CHRIS POWELL" text into particle positions
    const off = document.createElement('canvas');
    off.width = cssWidth;
    off.height = cssHeight;
    const offCtx = off.getContext('2d');
    const fontSize = Math.min(Math.max(cssWidth * 0.11, 40), 130);
    offCtx.fillStyle = '#ffffff';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
    offCtx.fillText('Chris Powell', cssWidth / 2, cssHeight / 2);

    const imageData = offCtx.getImageData(0, 0, cssWidth, cssHeight).data;
    const stride = Math.max(3, Math.round(fontSize / 28));
    const targets = [];
    for (let y = 0; y < cssHeight; y += stride) {
      for (let x = 0; x < cssWidth; x += stride) {
        const idx = (y * cssWidth + x) * 4;
        if (imageData[idx + 3] > 128) targets.push({ x, y });
      }
    }

    // Create particles that start at target (assembled) and scatter out
    const particles = targets.map((t) => ({
      x: t.x,
      y: t.y,
      tx: t.x,
      ty: t.y,
      scatterAngle: Math.random() * Math.PI * 2,
      scatterSpeed: 3 + Math.random() * 6,
      size: 1 + Math.random() * 1.2,
      alpha: 1,
    }));

    const flashStart = performance.now();

    const flashFrame = (now) => {
      const elapsed = now - flashStart;
      const progress = Math.min(elapsed / PARTICLE_FLASH_MS, 1);
      const eased = progress * progress;

      ctx.clearRect(0, 0, cssWidth, cssHeight);

      for (const p of particles) {
        p.x += Math.cos(p.scatterAngle) * p.scatterSpeed * (1 + eased * 4);
        p.y += Math.sin(p.scatterAngle) * p.scatterSpeed * (1 + eased * 4);
        p.alpha = Math.max(0, 1 - progress * 1.5);

        if (p.alpha <= 0.01) continue;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#00D4FF';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(flashFrame);
      } else {
        ctx.clearRect(0, 0, cssWidth, cssHeight);
        onDone();
      }
    };

    rafRef.current = requestAnimationFrame(flashFrame);
  }, [finish]);

  const handleScroll = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const d = (ms) => ({
    transitionDelay: revealContent ? `${ms}ms` : '0ms',
  });

  return (
    <>
      <TerminalAnimation revealContent={revealContent} />

      {/* Scramble overlay — full screen grid of ASCII chars */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="fixed inset-0 z-50 grid overflow-hidden pointer-events-none font-mono text-xs leading-none select-none"
        style={{
          opacity: phase === 'intro' ? overlayOpacity : 0,
          transition: 'opacity 0.6s ease-out',
          background: '#0A0A0F',
        }}
      />

      {/* Skip button — visible immediately */}
      {phase === 'intro' && (
        <button
          onClick={handleSkip}
          className="fixed top-6 right-6 z-[60] btn-ghost text-xs"
          aria-label="Skip intro"
        >
          Skip →
        </button>
      )}

      <section id="top" className="relative min-h-screen overflow-hidden">
        {/* Particle canvas for flash moment */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        />

        <div
          className={`absolute inset-0 z-10 flex items-center justify-center px-6 transition-opacity duration-700 ${
            revealContent ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-6 md:gap-12 pt-24 md:pt-0">
            {/* Headshot */}
            <div
              className={`relative shrink-0 transition-all duration-700 ease-out ${
                revealContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
              style={d(0)}
            >
              <div className="absolute -inset-2 rounded-full bg-cyan/20 blur-2xl" aria-hidden="true" />
              <div className="relative w-32 sm:w-44 md:w-60 aspect-square rounded-full overflow-hidden border-2 border-cyan/40 shadow-cyan-glow-lg bg-bg">
                <img
                  src="/headshot.jpg"
                  alt="Chris Powell"
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>

            {/* Text block */}
            <div className="text-center md:text-left w-full">
              <h1
                className={`text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tight text-ink leading-[1.08] font-serif transition-all duration-700 ease-out ${
                  revealContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
                style={d(150)}
              >
                I translate
                <br />
                technology into
                <br className="md:hidden" /> business value.
              </h1>

              <p
                className={`mt-4 text-sm sm:text-base md:text-lg text-ink/70 leading-relaxed max-w-xl transition-all duration-700 ease-out ${
                  revealContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
                style={d(350)}
              >
                20 years across the Coast Guard, FAA, Apple, and Indeed. Today: AI Champion & Workplace Leader.
              </p>

              <p
                className={`mt-3 text-[10px] sm:text-[11px] md:text-xs font-mono uppercase tracking-[0.15em] md:tracking-[0.2em] text-ink/40 transition-all duration-700 ease-out ${
                  revealContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
                style={d(450)}
              >
                Coast Guard <span className="text-cyan/50">→</span> FAA{' '}
                <span className="text-cyan/50">→</span> Apple{' '}
                <span className="text-cyan/50">→</span> Bypass Mobile{' '}
                <span className="hidden sm:inline"><span className="text-cyan/50">→</span> Reaction{' '}</span>
                <span className="text-cyan/50">→</span> Indeed
              </p>

              <div className="mt-4 md:mt-5 flex flex-wrap gap-2 justify-center md:justify-start">
                {PILLS.map((label, i) => (
                  <span
                    key={label}
                    className={`pill transition-all duration-500 ease-out ${
                      revealContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                    style={{
                      transitionDelay: revealContent ? `${550 + i * 80}ms` : '0ms',
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              <TechStack revealContent={revealContent} />

              {/* Status badge */}
              <div
                className={`mt-4 inline-flex items-center gap-2 transition-all duration-700 ease-out ${
                  revealContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
                style={{ transitionDelay: revealContent ? '950ms' : '0ms' }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan" />
                </span>
                <span className="text-xs font-mono text-ink/50 tracking-wide">
                  Always open for a conversation
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleScroll}
          aria-label="Scroll to content"
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 p-2 text-ink/60 hover:text-cyan transition-opacity duration-700 ${
            showArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-bounce-slow"
          >
            <path d="M12 5v14" />
            <path d="M5 12l7 7 7-7" />
          </svg>
        </button>
      </section>
    </>
  );
}
