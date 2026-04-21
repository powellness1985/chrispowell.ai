import { useEffect, useRef, useState } from 'react';
import TerminalAnimation from './TerminalAnimation';
import TechStack from './TechStack';

const PILLS = [
  'Always Learning',
  'Builder at Heart',
  'Leading with Empathy',
  'Curious by Default',
];

// Timing (ms)
const ASSEMBLE_MS = 1800;
const HOLD_MS = 2500;
const SCATTER_MS = 1400;

export default function ParticleHero({ onComplete }) {
  const canvasRef = useRef(null);
  const stopRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [phase, setPhase] = useState('init'); // init | animating | done
  const [revealContent, setRevealContent] = useState(false);
  const [showArrow, setShowArrow] = useState(false);

  // Decide what to do on mount: animate or (for reduced-motion users) skip.
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setPhase('done');
      setRevealContent(true);
      setShowArrow(true);
      queueMicrotask(() => onCompleteRef.current?.());
    } else {
      setPhase('animating');
    }
  }, []);

  // Animation lifecycle
  useEffect(() => {
    if (phase !== 'animating') return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');

    let cancelled = false;
    stopRef.current = false;

    const run = async () => {
      if (document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          /* ignore */
        }
      }
      if (cancelled || stopRef.current) return;

      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;
      canvas.width = cssWidth * DPR;
      canvas.height = cssHeight * DPR;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(DPR, DPR);

      // Draw text to an offscreen canvas so we can sample pixel positions.
      const off = document.createElement('canvas');
      off.width = cssWidth;
      off.height = cssHeight;
      const offCtx = off.getContext('2d');

      const fontSize = Math.min(Math.max(cssWidth * 0.12, 48), 160);
      const textCenterX = cssWidth / 2;
      const textCenterY = cssHeight * 0.5;

      offCtx.fillStyle = '#ffffff';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
      offCtx.fillText('Chris Powell', textCenterX, textCenterY);

      const data = offCtx.getImageData(0, 0, cssWidth, cssHeight).data;
      const stride = Math.max(3, Math.round(fontSize / 32));
      const targets = [];
      for (let y = 0; y < cssHeight; y += stride) {
        for (let x = 0; x < cssWidth; x += stride) {
          const idx = (y * cssWidth + x) * 4;
          if (data[idx + 3] > 128) {
            targets.push({
              x: x + (Math.random() - 0.5) * 1.5,
              y: y + (Math.random() - 0.5) * 1.5,
            });
          }
        }
      }

      const particles = targets.map((t) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.max(cssWidth, cssHeight) * (0.9 + Math.random() * 0.4);
        return {
          x: textCenterX + Math.cos(angle) * radius,
          y: textCenterY + Math.sin(angle) * radius,
          tx: t.x,
          ty: t.y,
          vx: 0,
          vy: 0,
          size: 1 + Math.random() * 1.4,
          alpha: 0,
          scatterAngle: Math.random() * Math.PI * 2,
          scatterSpeed: 2 + Math.random() * 5,
        };
      });

      let localPhase = 0;
      let phaseStart = performance.now();
      let revealFired = false;

      const frame = (now) => {
        if (cancelled || stopRef.current) return;
        const elapsed = now - phaseStart;
        ctx.clearRect(0, 0, cssWidth, cssHeight);

        if (localPhase === 0) {
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const dx = p.tx - p.x;
            const dy = p.ty - p.y;
            p.vx = (p.vx + dx * 0.0022) * 0.9;
            p.vy = (p.vy + dy * 0.0022) * 0.9;
            p.x += p.vx;
            p.y += p.vy;
            p.alpha = Math.min(1, p.alpha + 0.028);
          }
          if (elapsed > ASSEMBLE_MS) {
            localPhase = 1;
            phaseStart = now;
          }
        } else if (localPhase === 1) {
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += (p.tx - p.x) * 0.18;
            p.y += (p.ty - p.y) * 0.18;
            p.alpha = Math.min(1, p.alpha + 0.04);
          }
          if (elapsed > HOLD_MS) {
            localPhase = 2;
            phaseStart = now;
          }
        } else {
          const progress = Math.min(1, elapsed / SCATTER_MS);
          const eased = progress * progress;
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += Math.cos(p.scatterAngle) * p.scatterSpeed * (1 + eased * 3);
            p.y += Math.sin(p.scatterAngle) * p.scatterSpeed * (1 + eased * 3);
            p.alpha = Math.max(0, 1 - progress);
          }
          if (!revealFired && progress > 0.15) {
            revealFired = true;
            setRevealContent(true);
          }
          if (progress >= 1) {
            setPhase('done');
            setShowArrow(true);
            onCompleteRef.current?.();
            return;
          }
        }

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (p.alpha <= 0.01) continue;
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = '#00D4FF';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        requestAnimationFrame(frame);
      };

      requestAnimationFrame(frame);
    };

    run();

    return () => {
      cancelled = true;
      stopRef.current = true;
    };
  }, [phase]);

  const handleSkip = () => {
    stopRef.current = true;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setPhase('done');
    setRevealContent(true);
    setShowArrow(true);
    onCompleteRef.current?.();
  };

  const handleScroll = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Staggered entrance delays (ms) — measured from revealContent flip
  const d = (ms) => ({
    transitionDelay: revealContent ? `${ms}ms` : '0ms',
  });

  return (
    <section id="top" className="relative min-h-screen overflow-hidden">
      <TerminalAnimation revealContent={revealContent} />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      <div
        className={`absolute inset-0 z-10 flex items-center justify-center px-6 pt-80 lg:pt-48 transition-opacity duration-700 ${
          revealContent ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Headshot */}
          <div
            className={`relative shrink-0 transition-all duration-700 ease-out ${
              revealContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            style={d(0)}
          >
            <div className="absolute -inset-2 rounded-full bg-cyan/20 blur-2xl" aria-hidden="true" />
            <div className="relative w-40 sm:w-48 md:w-60 aspect-square rounded-full overflow-hidden border-2 border-cyan/40 shadow-cyan-glow-lg bg-bg">
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
          <div className="text-center md:text-left">
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-ink leading-[1.05] transition-all duration-700 ease-out ${
                revealContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
              style={d(150)}
            >
              I lead people.
              <br />
              Always learning.
            </h1>

            <p
              className={`mt-5 md:mt-6 text-base md:text-lg text-ink/70 leading-relaxed max-w-xl transition-all duration-700 ease-out ${
                revealContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
              style={d(350)}
            >
              Operator. Builder. Dad. Always building something.
            </p>

            <p
              className={`mt-3 text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-ink/40 transition-all duration-700 ease-out ${
                revealContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
              style={d(450)}
            >
              Coast Guard <span className="text-cyan/50">→</span> FAA <span className="text-cyan/50">→</span> Apple <span className="text-cyan/50">→</span> Bypass Mobile <span className="text-cyan/50">→</span> Reaction <span className="text-cyan/50">→</span> Indeed
            </p>

            <div className="mt-5 md:mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
              {PILLS.map((label, i) => (
                <span
                  key={label}
                  className={`pill transition-all duration-500 ease-out ${
                    revealContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                  style={{
                    transitionDelay: revealContent ? `${550 + i * 100}ms` : '0ms',
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
            <TechStack revealContent={revealContent} />
          </div>
        </div>
      </div>

      {phase === 'animating' && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 z-20 btn-ghost text-xs"
          aria-label="Skip intro animation"
        >
          Skip ↓
        </button>
      )}

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
  );
}
