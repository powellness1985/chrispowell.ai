import { useEffect, useRef, useState, useCallback } from 'react';
import TechStack from './TechStack';
import TerminalAnimation, { TerminalInline } from './TerminalAnimation';

const PILLS = [
  'Always Learning',
  'Builder at Heart',
  'Leading with Empathy',
  'Curious by Default',
];

// Matrix rain character set — katakana + code symbols
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01#$%<>{}[]|\\=+~^_?!';

const RAIN_DURATION   = 1800; // ms rain falls before freeze
const GLITCH_DURATION = 1200; // ms scan-line tear sequence
const PARTICLE_MS     = 500;  // ms particle burst after glitch

export default function ParticleHero({ onComplete }) {
  const matrixCanvasRef  = useRef(null);
  const glitchCanvasRef  = useRef(null);
  const particleCanvasRef = useRef(null);
  const onCompleteRef    = useRef(onComplete);
  onCompleteRef.current  = onComplete;
  const rafRef    = useRef(null);
  const skippedRef = useRef(false);

  const [phase, setPhase]               = useState('intro'); // 'intro' | 'done'
  const [revealContent, setRevealContent] = useState(false);
  const [showArrow, setShowArrow]         = useState(false);
  const [matrixVisible, setMatrixVisible] = useState(true);
  const [glitchVisible, setGlitchVisible] = useState(false);

  const finish = useCallback(() => {
    if (skippedRef.current) return;
    skippedRef.current = true;
    cancelAnimationFrame(rafRef.current);
    setMatrixVisible(false);
    setGlitchVisible(false);
    setRevealContent(true);
    setShowArrow(true);
    setPhase('done');
    onCompleteRef.current?.();
  }, []);

  const handleSkip = useCallback(() => finish(), [finish]);

  // ── Matrix rain ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'intro') return;

    const canvas = matrixCanvasRef.current;
    if (!canvas) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width  = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width  = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(DPR, DPR);

    const FONT_SIZE = 12;
    const COL_COUNT = Math.ceil(W / FONT_SIZE);

    // Start all columns already mid-screen so the wall fills instantly
    const drops = Array.from({ length: COL_COUNT }, () =>
      -Math.floor(Math.random() * (H / FONT_SIZE) * 0.4)
    );
    const speeds = Array.from({ length: COL_COUNT }, () => 0.6 + Math.random() * 1.1);

    const startTime = performance.now();
    let frozen = false;
    let animId;

    const draw = (now) => {
      const elapsed = now - startTime;

      if (elapsed >= RAIN_DURATION && !frozen) {
        frozen = true;
        cancelAnimationFrame(animId);
        // Hand off to glitch phase
        runGlitch(canvas, finish);
        return;
      }

      // Trail fade — lower alpha = trails linger longer = denser wall
      ctx.fillStyle = 'rgba(10, 10, 15, 0.12)';
      ctx.fillRect(0, 0, W, H);

      ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;

      for (let i = 0; i < COL_COUNT; i++) {
        const drop = drops[i];
        if (drop < 0) { drops[i] += speeds[i]; continue; }

        const x = i * FONT_SIZE;
        const y = drop * FONT_SIZE;

        // Lead character — bright near-white with cyan glow
        ctx.shadowColor = '#00D4FF';
        ctx.shadowBlur  = 6;
        ctx.fillStyle   = '#e0ffff';
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y);
        ctx.shadowBlur = 0;

        // Long trail — fills most of the column height
        const trailLen = 22 + Math.floor(Math.random() * 12);
        for (let t = 1; t <= trailLen; t++) {
          const ty = y - t * FONT_SIZE;
          if (ty < 0) break;
          const alpha = Math.max(0, 1 - t / trailLen);
          ctx.fillStyle = t < 4
            ? `rgba(0,212,255,${alpha * 0.95})`
            : `rgba(0,180,200,${alpha * 0.55})`;
          ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, ty);
        }

        drops[i] += speeds[i];
        if (y > H + FONT_SIZE * 5) drops[i] = -Math.floor(Math.random() * 6);
      }

      animId = requestAnimationFrame(draw);
      rafRef.current = animId;
    };

    animId = requestAnimationFrame(draw);
    rafRef.current = animId;

    return () => cancelAnimationFrame(animId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Glitch sequence — Scan Line Tear ──────────────────────────────────────
  // Seizure-safe: zero brightness spikes, no white/flash events.
  // 1. Freeze the rain frame
  // 2. Thick horizontal bands begin shearing left/right (VHS mistrack)
  // 3. Chromatic aberration drifts in as bands widen
  // 4. Bands progressively drop out (replaced by #0A0A0F)
  // 5. Canvas dissolves to black via opacity — site already loaded beneath
  const runGlitch = useCallback((frozenCanvas, onDone) => {
    const gc = glitchCanvasRef.current;
    if (!gc) { onDone(); return; }

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    gc.width  = W * DPR;
    gc.height = H * DPR;
    gc.style.width  = `${W}px`;
    gc.style.height = `${H}px`;
    gc.style.opacity = '1';
    gc.style.transition = 'none';

    const ctx = gc.getContext('2d');
    ctx.scale(DPR, DPR);

    setGlitchVisible(true);

    // Grab the frozen matrix frame
    const srcCtx = frozenCanvas.getContext('2d');
    const snapshot = srcCtx.getImageData(0, 0, frozenCanvas.width, frozenCanvas.height);

    // Build a reusable offscreen bitmap of the snapshot
    const tmpBase = document.createElement('canvas');
    tmpBase.width  = frozenCanvas.width;
    tmpBase.height = frozenCanvas.height;
    tmpBase.getContext('2d').putImageData(snapshot, 0, 0);

    // Hide rain, reveal site content underneath
    setMatrixVisible(false);
    setRevealContent(true);
    onCompleteRef.current?.();

    // Seed a stable set of bands that persist across frames
    // Each band: { y, h, offset, speed, dropout }
    const BAND_COUNT = 18;
    const bands = Array.from({ length: BAND_COUNT }, () => ({
      y:       Math.floor(Math.random() * H),
      h:       Math.floor(8 + Math.random() * 32),
      offset:  (Math.random() - 0.5) * 60,
      speed:   (Math.random() - 0.5) * 4,   // drift speed px/frame
      dropout: false,
    }));

    const glitchStart = performance.now();
    let glitchId;

    const glitchFrame = (now) => {
      const elapsed = now - glitchStart;
      const prog    = Math.min(elapsed / GLITCH_DURATION, 1);

      // How much of the frame has "dropped out" to bg by this point
      // Dropout accelerates in the second half
      const dropoutProg = prog < 0.4 ? 0 : (prog - 0.4) / 0.6;

      ctx.clearRect(0, 0, W, H);

      // ── Draw base frozen frame ──
      ctx.drawImage(tmpBase, 0, 0, W, H);

      // ── Chromatic aberration — grows with prog, NO opacity spike ──
      const aberration = prog * 14; // max 14px drift, eases in
      if (aberration > 0.5) {
        ctx.globalAlpha = 0.35;
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(tmpBase, aberration, 0, W, H);
        ctx.drawImage(tmpBase, -aberration, 0, W, H);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }

      // ── Band tears ──
      // Add more bands as time progresses
      const activeBands = Math.floor(BAND_COUNT * Math.min(prog * 2.5, 1));
      for (let b = 0; b < activeBands; b++) {
        const band = bands[b];

        // Drift the offset each frame
        band.offset += band.speed * (1 + prog * 3);
        // Clamp drift
        if (Math.abs(band.offset) > W * 0.35) band.speed *= -1;

        // After 60% through, some bands randomly drop out to bg
        if (!band.dropout && dropoutProg > 0 && Math.random() < dropoutProg * 0.08) {
          band.dropout = true;
        }

        const sy = band.y;
        const sh = band.h;

        if (band.dropout) {
          // Replace band region with background color
          ctx.fillStyle = '#0A0A0F';
          ctx.fillRect(0, sy, W, sh);
        } else {
          // Draw band from snapshot at horizontal offset
          ctx.drawImage(
            tmpBase,
            0,    sy * DPR,             // src x, y
            frozenCanvas.width, sh * DPR, // src w, h
            band.offset, sy,             // dst x, y
            W, sh                        // dst w, h
          );
        }
      }

      // ── Scan lines — subtle horizontal dark lines for CRT feel ──
      if (prog < 0.85) {
        ctx.fillStyle = 'rgba(10,10,15,0.18)';
        for (let sl = 0; sl < H; sl += 4) {
          ctx.fillRect(0, sl, W, 1);
        }
      }

      // ── Progressive blackout: drop random rows to bg as dropout increases ──
      if (dropoutProg > 0) {
        const blackRows = Math.floor(dropoutProg * dropoutProg * H * 0.9);
        for (let r = 0; r < blackRows; r += Math.floor(2 + Math.random() * 6)) {
          ctx.fillStyle = '#0A0A0F';
          ctx.fillRect(0, Math.floor(Math.random() * H), W, 1 + Math.floor(Math.random() * 3));
        }
      }

      if (prog < 1) {
        glitchId = requestAnimationFrame(glitchFrame);
        rafRef.current = glitchId;
      } else {
        // Smooth fade-out of the glitch canvas itself (no brightness event)
        gc.style.transition = 'opacity 300ms ease-out';
        gc.style.opacity = '0';
        setTimeout(() => {
          cancelAnimationFrame(glitchId);
          setGlitchVisible(false);
          runParticleFlash(onDone);
        }, 320);
      }
    };

    glitchId = requestAnimationFrame(glitchFrame);
    rafRef.current = glitchId;
  }, []);

  // ── Particle flash ─────────────────────────────────────────────────────────
  const runParticleFlash = useCallback((onDone) => {
    const canvas = particleCanvasRef.current;
    if (!canvas) { onDone(); return; }
    const ctx = canvas.getContext('2d');

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width  = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width  = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const offCtx = off.getContext('2d');
    const fontSize = Math.min(Math.max(W * 0.11, 40), 130);
    offCtx.fillStyle = '#ffffff';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
    offCtx.fillText('Chris Powell', W / 2, H / 2);

    const imgData = offCtx.getImageData(0, 0, W, H).data;
    const stride  = Math.max(3, Math.round(fontSize / 28));
    const targets = [];
    for (let y = 0; y < H; y += stride)
      for (let x = 0; x < W; x += stride)
        if (imgData[(y * W + x) * 4 + 3] > 128) targets.push({ x, y });

    const particles = targets.map((t) => ({
      x: t.x, y: t.y,
      scatterAngle: Math.random() * Math.PI * 2,
      scatterSpeed: 3 + Math.random() * 7,
      size: 1 + Math.random() * 1.3,
      alpha: 1,
    }));

    const flashStart = performance.now();
    const step = (now) => {
      const prog  = Math.min((now - flashStart) / PARTICLE_MS, 1);
      const eased = prog * prog;
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += Math.cos(p.scatterAngle) * p.scatterSpeed * (1 + eased * 5);
        p.y += Math.sin(p.scatterAngle) * p.scatterSpeed * (1 + eased * 5);
        p.alpha = Math.max(0, 1 - prog * 1.6);
        if (p.alpha < 0.01) continue;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#00D4FF';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (prog < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, W, H);
        onDone();
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  const handleScroll = () =>
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });

  const d = (ms) => ({ transitionDelay: revealContent ? `${ms}ms` : '0ms' });

  return (
    <>
      <TerminalAnimation revealContent={revealContent} />

      {/* Matrix rain canvas */}
      <canvas
        ref={matrixCanvasRef}
        aria-hidden="true"
        className="fixed inset-0 z-50 pointer-events-none"
        style={{
          background: '#0A0A0F',
          display: matrixVisible ? 'block' : 'none',
        }}
      />

      {/* Glitch canvas — replaces matrix at freeze point */}
      <canvas
        ref={glitchCanvasRef}
        aria-hidden="true"
        className="fixed inset-0 z-[52] pointer-events-none"
        style={{ display: glitchVisible ? 'block' : 'none' }}
      />

      {/* Particle flash */}
      <canvas
        ref={particleCanvasRef}
        aria-hidden="true"
        className="fixed inset-0 z-[54] pointer-events-none"
      />

      {/* Skip — always visible */}
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
                  src="/headshot.webp"
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
                22 years across the Coast Guard, FAA, Apple, and Indeed. Today: AI Champion & Workplace Leader.
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
                <span className="hidden sm:inline">
                  <span className="text-cyan/50">→</span> Reaction{' '}
                </span>
                <span className="text-cyan/50">→</span> Indeed
              </p>

              <div className="mt-4 md:mt-5 flex flex-wrap gap-2 justify-center md:justify-start">
                {PILLS.map((label, i) => (
                  <span
                    key={label}
                    className={`pill transition-all duration-500 ease-out ${
                      revealContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                    style={{ transitionDelay: revealContent ? `${550 + i * 80}ms` : '0ms' }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              <TechStack revealContent={revealContent} />

              {/* Inline terminal — mobile only (lg+ uses floating widget) */}
              <div className="mt-4">
                <TerminalInline revealContent={revealContent} />
              </div>

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
            width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
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
