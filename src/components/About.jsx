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
      'Honor grad of ET School at 97.5%, top of class. Made E-5 in three years, then filled E-6 and E-7 responsibilities across the Gulf Coast AOR (Pensacola to Corpus Christi). Daily status updates straight to the commanding officer. Supported comms restoration during Hurricane Katrina. Good Conduct Medal. The foundation for everything since.',
  },
  {
    year: '2008',
    org: 'Federal Aviation Administration',
    role: 'Airway Transportation Systems Specialist',
    detail:
      'Communication and navigational aids for air traffic control. Austin Enroute POC for the National Safety Initiative: coordinated training, PPE procurement, facility inspections, and management briefings. Learned that mission-critical infrastructure is about people and process as much as electronics.',
  },
  {
    year: '2011',
    org: 'Apple',
    role: 'Mac Genius → Enterprise Advisor',
    detail:
      'Advanced quickly from family room specialist to Genius in retail, then moved to AppleCare Enterprise and EDU with OS X Server specialization. Remote phone and screen-share support for enterprise customers. Apple Certified Macintosh Technician. This is where fearless curiosity got wired in.',
  },
  {
    year: '2013',
    org: 'Bypass Mobile',
    role: 'Senior Services Manager',
    detail:
      'Built a national support department at a mobile-POS startup. Tablet-based POS at scale: Staples Center, Coachella, PGA events. Project-managed new installs, ran on-call for live events, implemented the ticketing stack. Learned what "on-call" really means when the game starts at 7pm.',
  },
  {
    year: '2015',
    org: 'Reaction, Inc.',
    role: 'Desktop Support Lead',
    detail:
      'Sole IT lead at a growing startup. Department budget, IT purchasing, licensing administration, security and access control installation, Windows and Mac server admin, ticketing system stand-up. The whole IT org, one chair.',
  },
  {
    year: '2016',
    org: 'Indeed',
    role: 'IT Manager → Senior Manager → Director, IT Solutions',
    detail:
      'West Coast IT, then APAC with ~4 months on-site rebuilding the Japan team, then Interim Global, then Director of IT Solutions. Led a large global IT org serving ~10,000 employees. Shipped Indeed\'s first internal AI bot, an AI-powered ticketing platform, the first Virtual Service Desk (pandemic-era), and multiple M&A IT integrations. Wrote a bash script for network troubleshooting that is still a standard tool for the team.',
  },
  {
    year: 'Now',
    org: 'Indeed',
    role: 'Director, Workplace Experience',
    detail:
      'People Ops org. A global team of 40+ spanning 20+ offices. Pillars: office ops, events & perks, operational support, HSE, and AI Enablement. Outside the day job: built this site one evening in Claude Code, shipped DadOps Bot for my daughter, run workshops, and lean into whatever comes next. The curiosity never turns off.',
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
                <div className="text-sm font-mono tracking-widest text-cyan uppercase">
                  {item.year}
                </div>
                <div className="mt-1 text-xl md:text-2xl font-semibold text-ink tracking-tight">
                  {item.org}
                </div>
                {item.role && (
                  <div className="text-sm text-ink/70 mt-1">{item.role}</div>
                )}
                <p className="mt-3 text-sm text-ink/60 leading-relaxed">{item.detail}</p>
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
