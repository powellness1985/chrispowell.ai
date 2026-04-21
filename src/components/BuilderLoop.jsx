import { useEffect, useRef, Fragment } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { n: '01', title: 'Ask why', sub: 'Why is this broken? Who does it affect?' },
  { n: '02', title: 'Learn by doing', sub: 'Read, prototype, break things, keep going.' },
  { n: '03', title: 'Prove it', sub: 'Ship the thing. Put it in people\u2019s hands.' },
  { n: '04', title: 'Hand it off', sub: 'Give it to the team who owns the domain.' },
  { n: '05', title: 'Help people grow', sub: 'The change matters as much as the change.' },
];

export default function BuilderLoop() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.loop-step').forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 20,
          duration: 0.55,
          ease: 'power2.out',
          delay: i * 0.08,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="section">
      <h2 className="h-section">How I Work</h2>
      <p className="mt-4 sub">
        The same loop, whether it is an AI rollout at work or a projector on the house.
      </p>

      <div className="mt-12 flex flex-col md:flex-row md:items-stretch md:gap-2 gap-0">
        {STEPS.map((step, i) => (
          <Fragment key={step.n}>
            <div className="loop-step flex-1 rounded-xl border border-cyan/20 bg-white/[0.02] p-5 hover:border-cyan/50 hover:bg-white/[0.04] transition-colors">
              <div className="text-[10px] font-mono tracking-widest text-cyan/80 mb-2">
                {step.n}
              </div>
              <h3 className="text-base font-semibold text-ink mb-1">{step.title}</h3>
              <p className="text-xs text-ink/60 leading-relaxed">{step.sub}</p>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="flex items-center justify-center text-cyan/60 md:px-1 py-2 md:py-0 select-none"
                aria-hidden="true"
              >
                <span className="md:hidden">↓</span>
                <span className="hidden md:inline">→</span>
              </div>
            )}
          </Fragment>
        ))}
      </div>

      <p className="mt-10 text-sm text-ink/50 border-l-2 border-cyan/40 pl-4">
        It is not about the thing I built. It is about the next person who builds the next thing.
      </p>
    </section>
  );
}
