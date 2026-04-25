import { useEffect, useState } from 'react';

const COMMANDS = [
  { cmd: 'npm run leadership', out: '→ leading with empathy, curiosity, and a bias for action' },
  { cmd: 'whoami', out: 'operator // builder // stakeholder translator // dad' },
  { cmd: 'whoami', out: 'widowed dad // operator // builder // still becoming' },
  { cmd: 'whoami', out: 'chris.powell — builder, operator, girl-dad' },
  { cmd: 'cat philosophy.txt', out: '"certainty is the enemy of unity."' },
  { cmd: 'cat ~/.philosophy', out: '// both things can be true at once' },
  { cmd: 'cat mantra.txt', out: '"heavy joy."' },
  { cmd: './lean-in.sh', out: 'running... (the hard stuff is where it happens)' },
  { cmd: 'ping waverly', out: 'reply: "Dad, watch this!" — time=0ms' },
  { cmd: 'pwd', out: '/buda/texas — raising a kid, building things' },
  { cmd: 'uptime', out: 'up 43 years // resilient // still learning' },
  { cmd: 'status', out: 'building something new on a strong foundation' },
  { cmd: 'man chris', out: 'SYNOPSIS: operator [--curious] [--direct] [--warm]' },
  { cmd: 'history | grep "learned"', out: '1,247 results found (still counting)' },
  { cmd: 'sudo stay-curious', out: 'permission granted. always.' },
  { cmd: 'git log --oneline -6', out: 'a3f91c2 led 40-person global team across ops, events, AI\nb8d04e1 built ai compliance tool — caught what manual review missed\nc2a17f3 opened 3 offices from the ground up\nd9e82b0 restored comms during hurricane katrina\ne4c55a9 apple genius → enterprise advisor\nf1b3310 honor grad, e-5 in three years' },
  { cmd: 'ls ~/projects', out: 'dadops-bot/  unicornland/  family-lights/  image-forge/  chrispowell.ai/' },
  { cmd: 'brew install hobbies', out: 'installing: projection-mapping, laser-engraving, photography, 3d-printing...' },
  { cmd: 'crontab -l', out: '17:00 * * * dad-mode --fully-present' },
  { cmd: 'echo $VALUES', out: 'authenticity, curiosity, leaning in' },
  { cmd: './run-the-meeting.sh', out: "agenda loaded. ego check: passed. let's go." },
  { cmd: 'cat story.md', out: '# loved deeply. lost. love again. keep building.' },
  { cmd: './both-things.sh', out: 'grief and hope. foundation and new growth. running.' },
  { cmd: 'git log --oneline -4', out: 'a1b2c3d shipped ai workshop series — people showed up\ne5f6a7b built dadops bot so i never miss what matters\nc8d9e0f projection-mapped the house. synced to music.\n1a2b3c4 still becoming. on purpose.' },
  { cmd: 'npm run life', out: '→ raising waverly, leading teams, building things' },
  { cmd: 'git status', out: 'on branch: chapter-two\nchanges staged: intentional, curious, open' },
  { cmd: 'cat now.md', out: '# leading, building, parenting, growing — in that order and all at once' },
  { cmd: './trust-gut.sh', out: 'overthinking.exe terminated. proceeding.' },
  { cmd: 'ls ~/values', out: 'empathy/  curiosity/  directness/  warmth/  leaning-in/' },
  { cmd: 'echo "home"', out: '/buda/tx — where the story continues' },
  { cmd: 'cat bio.txt', out: 'operator by trade. builder by nature. dad above all.' },
  { cmd: './heavy-joy.sh', out: 'finding beauty inside the hard stuff. always.' },
  { cmd: 'sudo show-up', out: 'authenticated. fully present.' },
  { cmd: 'whoami', out: 'chris // always becoming, never finished' },
  { cmd: 'git log --format="%s" --author="chris" | head -5', out: 'translate technology into business value\nlead with empathy through real change\nbuild things that actually help people\nhand it off and help the next person grow\nstart over. better this time.' },
];

const TYPE_DELAY_MS = 65;
const PAUSE_BEFORE_OUTPUT_MS = 350;
const HOLD_OUTPUT_MS = 3200;
const CLEAR_PAUSE_MS = 700;

export default function TerminalAnimation({ revealContent }) {
  const [displayText, setDisplayText] = useState('');
  const [commandIndex, setCommandIndex] = useState(0);
  const [phase, setPhase] = useState('typing'); // 'typing' | 'output' | 'clearing'

  const current = COMMANDS[commandIndex % COMMANDS.length];

  useEffect(() => {
    if (!revealContent) return undefined;

    let timeoutId;

    if (phase === 'typing') {
      if (displayText.length < current.cmd.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(current.cmd.slice(0, displayText.length + 1));
        }, TYPE_DELAY_MS);
      } else {
        timeoutId = setTimeout(() => {
          setPhase('output');
        }, PAUSE_BEFORE_OUTPUT_MS);
      }
    } else if (phase === 'output') {
      timeoutId = setTimeout(() => {
        setPhase('clearing');
      }, HOLD_OUTPUT_MS);
    } else {
      timeoutId = setTimeout(() => {
        setDisplayText('');
        setCommandIndex((i) => i + 1);
        setPhase('typing');
      }, CLEAR_PAUSE_MS);
    }

    return () => clearTimeout(timeoutId);
  }, [phase, displayText, revealContent, current.cmd]);

  const showOutput = phase === 'output' || phase === 'clearing';
  const isTypingCursor = phase === 'typing';

  return (
    <>
      {/* Desktop: floating terminal top-right */}
      <div
        className={`hidden lg:block fixed top-28 right-10 z-20 transition-all duration-1000 ${
          revealContent ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-72 rounded-lg bg-black/40 backdrop-blur border border-cyan/30 p-4 font-mono text-sm shadow-lg shadow-cyan/10">
          <div className="flex gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500/70" />
            <div className="w-2 h-2 rounded-full bg-yellow-400/70" />
            <div className="w-2 h-2 rounded-full bg-green-500/70" />
          </div>
          <div className="text-cyan/80 text-xs mb-2">~/projects</div>
          <div className="text-cyan min-h-6 flex items-center">
            <span>$ {displayText}</span>
            {isTypingCursor && <span className="ml-1 animate-pulse">_</span>}
          </div>
          <div
            className={`mt-2 text-ink/70 text-xs whitespace-pre-line leading-relaxed min-h-[1.5rem] transition-opacity duration-200 ${
              showOutput ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {showOutput ? current.out : '\u00a0'}
          </div>
        </div>
      </div>

      {/* Mobile: small terminal at bottom of screen, out of hero content way */}
      <div
        className={`lg:hidden fixed bottom-20 left-4 right-4 z-20 max-w-xs rounded-lg bg-black/60 backdrop-blur border border-cyan/20 p-2.5 font-mono text-[10px] transition-all duration-700 ${
          revealContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{
          transitionDelay: revealContent ? '1000ms' : '0ms',
        }}
      >
        <div className="flex gap-1 mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/70" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-500/70" />
        </div>
        <div className="text-cyan/60 text-[9px] mb-1">~/projects</div>
        <div className="text-cyan flex items-center truncate">
          <span className="truncate">$ {displayText}</span>
          {isTypingCursor && <span className="ml-0.5 animate-pulse flex-shrink-0">_</span>}
        </div>
        <div
          className={`mt-1 text-ink/60 text-[9px] leading-relaxed min-h-[0.875rem] transition-opacity duration-200 line-clamp-2 ${
            showOutput ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {showOutput ? current.out.split('\n')[0] : '\u00a0'}
        </div>
      </div>
    </>
  );
}
