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
      'Built a national support department from scratch at a mobile-POS startup. Tablet-based POS at scale: Staples Center, Coachella, PGA events. Project-managed new installs, ran on-call for live events, implemented the ticketing stack. Learned what "on-call" really means when the game starts at 7pm.',
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
      'West Coast IT, then APAC with ~4 months on-site rebuilding the Japan team, then Interim Global, then permanent Director of IT Solutions. Peak team of 224 (157 FTE + 67 contractors) serving ~10,000 employees. Shipped Indeed\'s first internal AI bot, the AI-powered ticketing platform, the first Virtual Service Desk (pandemic-era), and multiple M&A IT integrations. Improved service resolution speed 20%+.',
  },
  {
    year: 'Now',
    org: 'Indeed',
    role: 'Director, Workplace Experience',
    detail:
      'People Ops org. 70+ FTEs and contractors, $50M+ global budget, 20+ offices. Pillars: office ops, events & perks, operational support, HSE, and AI Enablement. FY2025-H1 rating of 5 (highest). Called out as "a key driver of AI within the People Team" for pioneering AI adoption. Outside the day job: building this site one evening in Claude Code, shipping DadOps Bot for Waverly, running workshops, and leaning into whatever comes next. The curiosity never turns off.',
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
      <h2 className="h-section">The Story So Far</h2>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        <div className="text-ink/80 text-base md:text-lg leading-relaxed space-y-4">
          <p>
            I'm Chris. I'm a systems-driven IT and operations leader based in Buda, Texas,
            coming up on ten years at Indeed. Current day job: Director of Workplace Experience,
            running a team of 70+ across 20+ offices and a $50M+ budget. But the title on the
            business card isn't really the point. This page is about what happens when a curious
            person with a laptop decides to see what's possible.
          </p>
          <p>
            This site is a good example. I built it one evening with Claude Code and a laptop,
            because I wanted to know how. Some people would call that vibe coding. I call it
            leaning in. The AI you can chat with below runs on Anthropic's Claude, a Vercel
            function I wrote, and a system prompt I tuned myself. It's a hands-on answer to the
            question "what does applied AI actually look like in your work?"
          </p>
          <p>
            I think in systems. Coast Guard electronics. FAA navigation. Apple enterprise.
            Bypass Mobile at Staples Center and Coachella. Then the last decade at Indeed,
            growing from a regional IT manager to the Director seat. The through-line is
            simple: I like building things that make the hard stuff easier. Triage bots.
            Workshop series. Org designs that give teams room to breathe. A personal bot that
            helps me not miss what matters for my daughter Waverly.
          </p>
          <p>
            The "now" isn't an exit plan. It's the posture. Wherever I am, I'm going to keep
            leaning into curiosity and building what's next, personally and professionally.
            This site is part of that. The stretching doesn't stop.
          </p>
          <p className="text-ink/60">
            Want to know what working with me looks like?{' '}
            <button
              type="button"
              onClick={scrollToChat}
              className="text-cyan hover:underline"
            >
              Ask the chat below
            </button>
            , or email me: <a href="mailto:hello@chrispowell.ai" className="text-cyan hover:underline">hello@chrispowell.ai</a>.
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
