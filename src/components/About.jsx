import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TIMELINE = [
  {
    year: '2003',
    org: 'US Coast Guard',
    role: 'Electronics Technician',
    detail: 'Honor graduate, E-5 in three years, Hurricane Katrina response.',
  },
  {
    year: '2008',
    org: 'Federal Aviation Administration',
    role: 'Systems Specialist',
    detail: 'Mission-critical communications and navigation systems.',
  },
  {
    year: '2011',
    org: 'Apple',
    role: 'Mac Genius & Enterprise Advisor',
    detail: 'Fearless curiosity, human-centered technology.',
  },
  {
    year: '2013',
    org: 'Bypass Mobile',
    role: 'Senior Services Manager',
    detail: 'Built support ops from scratch, live events at scale.',
  },
  {
    year: '2016',
    org: 'Indeed',
    role: '10 Years of Progressive Leadership',
    detail: 'IT Support → Global IT Director → Director, People Operations & AI.',
  },
  {
    year: 'Now',
    org: "Building What's Next",
    role: null,
    detail:
      'Applied AI, operational leadership, and the work that gets me up in the morning.',
  },
];

export default function About() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.timeline-item').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: 'power2.out',
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
    <section id="about" ref={rootRef} className="section">
      <h2 className="h-section">The Story So Far</h2>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {/* Bio */}
        <div className="text-ink/80 text-base md:text-lg leading-relaxed space-y-4">
          {/* TODO: Replace with real bio copy */}
          <p>
            Placeholder bio — replace this with your own words. A few short paragraphs
            about who you are, what you care about, and the through-line connecting
            the roles in the timeline.
          </p>
          <p>
            Keep it warm, direct, and unpolished in the best way. Leave the highlight-reel
            posture to LinkedIn. This is the first thing a thoughtful reader sees, so it
            should sound like you on your clearest day.
          </p>
          <p>
            This block is plain text for now. If you want pull-quotes, inline links,
            or a second CTA later, we can extend this column.
          </p>
        </div>

        {/* Timeline */}
        <ol className="relative pl-8">
          <div
            className="absolute left-2 top-2 bottom-2 w-px bg-cyan/30"
            aria-hidden="true"
          />

          {TIMELINE.map((item, i) => (
            <li
              key={`${item.year}-${item.org}`}
              className={`timeline-item relative ${i === TIMELINE.length - 1 ? '' : 'mb-10'}`}
            >
              <span
                className="absolute -left-8 top-1.5 w-4 h-4 rounded-full bg-bg border-2 border-cyan shadow-cyan-glow"
                aria-hidden="true"
              />
              <div className="text-xs font-mono tracking-wider text-cyan uppercase">
                {item.year}
              </div>
              <div className="mt-1 text-lg font-semibold text-ink">{item.org}</div>
              {item.role && (
                <div className="text-sm text-ink/70 mt-0.5">{item.role}</div>
              )}
              <p className="mt-2 text-sm text-ink/60 leading-relaxed">{item.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
