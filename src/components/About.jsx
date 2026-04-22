import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TIMELINE = [
  {
    year: '2003',
    org: 'US Coast Guard',
    role: 'Electronics Technician, E-5',
    bullets: [
      'Honor graduate, top of class. E-5 in three years.',
      'Gulf Coast AOR: daily briefs to commanding officer.',
      'Comms restoration lead during Hurricane Katrina.',
    ],
  },
  {
    year: '2008',
    org: 'Federal Aviation Administration',
    role: 'Airway Transportation Systems Specialist',
    bullets: [
      'Air traffic control comms & navigation systems.',
      'National Safety Initiative POC: training, procurement, inspections.',
      'Learned: infrastructure is people + process + electronics.',
    ],
  },
  {
    year: '2011',
    org: 'Apple',
    role: 'Mac Genius → Enterprise Advisor',
    bullets: [
      'Retail to AppleCare Enterprise in OS X Server.',
      'Remote support for enterprise customers.',
      'Where fearless curiosity became a permanent trait.',
    ],
  },
  {
    year: '2013',
    org: 'Bypass Mobile',
    role: 'Senior Services Manager',
    bullets: [
      'Built national support for mobile-POS startup.',
      'Live events: Staples Center, Coachella, PGA.',
      'Learned what "on-call" means when the game starts.',
    ],
  },
  {
    year: '2015',
    org: 'Reaction, Inc.',
    role: 'Desktop Support Lead',
    bullets: [
      'Solo IT lead: budget, procurement, security, infrastructure.',
      'Windows & Mac server admin, ticketing system.',
      'The entire IT org, one chair.',
    ],
  },
  {
    year: '2016',
    org: 'Indeed',
    role: 'IT Manager → Senior Manager → Director',
    bullets: [
      'West Coast, APAC, Interim Global, Director of IT Solutions.',
      'Led 10,000-employee global IT org.',
      'Shipped: AI bot, AI ticketing, Virtual Service Desk, M&A integrations.',
    ],
  },
  {
    year: 'Now',
    org: 'Indeed',
    role: 'Director, Workplace Experience',
    bullets: [
      'Lead 40+ person global team across Ops, Events, Support, HSE, AI.',
      'Side projects: this site, DadOps Bot, workshops.',
      'Same curiosity. Different materials.',
    ],
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

  const scrollToChat = () => {
    document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="about" ref={rootRef} className="section">
      <h2 className="h-section">My Story</h2>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        <div className="text-ink/80 text-base md:text-lg leading-relaxed space-y-4">
          <p>
            I&rsquo;m Chris Powell. Coast Guard veteran. Apple Genius. Nearly a decade at Indeed.
            Dad to my daughter. Owner of too many cameras and not enough hours in the day.
          </p>
          <p>
            The through-line across all of it is not the titles or the companies. It is this:
            I ask why things are the way they are, figure out how to make them better for the
            people they affect, and then go build it. At work that looks like AI enablement
            programs and global operations frameworks. At home it looks like a backyard shop,
            synchronized holiday light shows, projection-mapped Halloween experiences, and a
            Telegram bot that makes sure I do not miss anything important for my daughter.
          </p>
          <p className="text-ink font-semibold">The work is different. The question is always the same.</p>
          <p>
            This site is my story. I built it one evening in Claude Code because I wanted to
            try it, do it, and tell my story in my own voice. No ghostwriter, no template,
            no agenda other than building the thing. That is how I have always worked. That
            is how I always will.
          </p>
          <p className="text-ink/60 pt-2">
            Curious how I think about something?{' '}
            <button
              type="button"
              onClick={scrollToChat}
              className="text-cyan hover:underline"
            >
              Ask the chat below
            </button>
            , or just email me:{' '}
            <a href="mailto:hello@chrispowell.ai" className="text-cyan hover:underline">
              hello@chrispowell.ai
            </a>
            .
          </p>
        </div>

        <div>
          <ol className="relative pl-8">
            <div
              className="absolute left-2 top-2 bottom-2 w-px bg-cyan/30"
              aria-hidden="true"
            />

            {TIMELINE.map((item, i) => (
              <li
                key={`${item.year}-${item.org}-${i}`}
                className={`timeline-item relative ${i === TIMELINE.length - 1 ? '' : 'mb-14'}`}
              >
                <span
                  className="absolute -left-8 top-2 w-4 h-4 rounded-full bg-bg border-2 border-cyan shadow-cyan-glow"
                  aria-hidden="true"
                />
                <div className="text-sm font-mono tracking-widest text-amber uppercase">
                  {item.year}
                </div>
                <div className="mt-1 text-xl md:text-2xl font-semibold text-ink tracking-tight">
                  {item.org}
                </div>
                {item.role && (
                  <div className="text-sm text-ink/70 mt-1">{item.role}</div>
                )}
                {item.bullets && (
                  <ul className="mt-3 text-sm text-ink/60 leading-relaxed space-y-1">
                    {item.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-amber shrink-0">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>

          <p className="mt-10 pl-8 text-sm text-ink/50">
            There's a story behind each of these.{' '}
            <button
              type="button"
              onClick={scrollToChat}
              className="text-cyan hover:underline font-medium"
            >
              Ask the AI below for the longer version →
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
