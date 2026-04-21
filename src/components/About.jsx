import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TIMELINE = [
  {
    year: '2003',
    org: 'US Coast Guard',
    role: 'Electronics Technician, E-5',
    detail:
      'Honor graduate of ET School at 97.5%. Made E-5 in three years, filling E-6 and E-7 responsibilities across the Gulf Coast. Supported comms restoration during Hurricane Katrina. Good Conduct Medal. The foundation for everything since.',
  },
  {
    year: '2008',
    org: 'Federal Aviation Administration',
    role: 'Airway Transportation Systems Specialist',
    detail:
      'Communication and navigational aids for air traffic control. Austin Enroute POC for the National Safety Initiative. Learned that mission-critical infrastructure is as much about people and process as electronics.',
  },
  {
    year: '2011',
    org: 'Apple',
    role: 'Mac Genius → Enterprise Advisor',
    detail:
      'Retail Genius, then AppleCare Enterprise and EDU with OS X Server specialization. Apple Certified Macintosh Technician. This is where fearless curiosity got wired in.',
  },
  {
    year: '2013',
    org: 'Bypass Mobile',
    role: 'Senior Services Manager',
    detail:
      'Built a national support department from scratch at a mobile-POS startup. Large-scale deployments at Staples Center, Coachella, PGA events. Learned what "on-call" really means.',
  },
  {
    year: '2015',
    org: 'Reaction, Inc.',
    role: 'Desktop Support Lead',
    detail:
      'Sole IT lead at a growing startup. Budget, purchasing, licensing, access control, servers, ticketing. All of it.',
  },
  {
    year: '2016',
    org: 'Indeed',
    role: 'IT Manager → Senior Manager → Director, IT Solutions',
    detail:
      'West Coast IT, then APAC with four months on-site rebuilding the Japan team, then global. Peak team of 224 (157 FTE + 67 contractors) serving ~10,000 employees. Shipped Indeed\'s first internal AI bot, the AI ticketing platform, the first Virtual Service Desk, and multiple M&A integrations. 20%+ improvement in resolution speed.',
  },
  {
    year: 'Now',
    org: 'Indeed',
    role: 'Director, Workplace Experience',
    detail:
      '70+ FTEs and contractors, $50M+ global budget, 20+ offices. Pillars: office ops, events and perks, operational support, HSE, and AI enablement. FY2025-H1 rating of 5 (highest). Called out as "a key driver of AI within the People Team" for pioneering AI adoption.',
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
        <div className="text-ink/80 text-base md:text-lg leading-relaxed space-y-4">
          <p>
            I've spent 22 years learning how technology actually gets into people's hands.
            Coast Guard electronics. FAA navigation systems. Apple, retail and enterprise.
            A couple of startups. Then nearly ten years at Indeed, growing from a
            regional IT manager to Director of Workplace Experience.
          </p>
          <p>
            The through-line is simple: I like building things that make the hard stuff easier.
            AI-powered triage. Workshop series that turn curiosity into capability. Org designs
            that give teams room to breathe. A personal bot that keeps me from missing what
            matters for my daughter Waverly. If it connects people, process, and technology,
            and actually ships, I'm interested.
          </p>
          <p>
            I lead with confident humility. I know what I know, I'll tell you what I don't,
            and I'll tell you what I'm going to do about it. Empathy isn't a soft skill to me,
            it's a strategic one. People do their best work when they feel seen. And I don't
            wait for the future to arrive. I go build it.
          </p>
        </div>

        <ol className="relative pl-8">
          <div
            className="absolute left-2 top-2 bottom-2 w-px bg-cyan/30"
            aria-hidden="true"
          />

          {TIMELINE.map((item, i) => (
            <li
              key={`${item.year}-${item.org}-${i}`}
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
