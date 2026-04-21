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
  { cmd: 'git log --oneline', out: 'feat: built trust with the skeptical stakeholder' },
  { cmd: 'ls ~/projects', out: 'proptech/  chrispowell.ai/  laser-engraver/  a-good-life/' },
  { cmd: 'brew install hobbies', out: 'installing: engraving, storytelling, long walks...' },
  { cmd: 'crontab -l', out: '17:00 * * * dad-mode --fully-present' },
  { cmd: 'echo $VALUES', out: 'authenticity, curiosity, leaning in' },
  { cmd: './run-the-meeting.sh', out: "agenda loaded. ego check: passed. let's go." },
  { cmd: 'cat story.md', out: '# loved deeply. lost. love again. keep building.' },
  { cmd: 'cat about.md', out: '# widowed dad rebuilding with intention' },
  { cmd: './both-things.sh', out: 'grief and hope. foundation and new growth. running.' },
  { cmd: 'whoami --verbose', out: 'chris powell // operator // widowed dad // always learning' },
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
        className={`hidden lg:block fixed top-16 right-10 z-30 transition-all duration-1000 ${
          revealContent ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Background box layer - stays behind hero image */}
        <div className="absolute inset-0 w-72 rounded-lg bg-black/40 backdrop-blur border border-cyan/30 shadow-lg shadow-cyan/10 pointer-events-none z-0" />

        {/* Text content layer - floats above hero image */}
        <div className="relative z-10 w-72 rounded-lg p-4 font-mono text-sm">
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

      {/* Mobile portrait: terminal positioned just under navigation (h-16) */}
      <div
        className={`lg:hidden landscape:hidden absolute top-[4.5rem] left-6 right-6 z-5 max-w-sm rounded-lg bg-black/40 backdrop-blur border border-cyan/30 p-3 font-mono text-xs transition-all duration-1000 ${
          revealContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{
          transitionDelay: revealContent ? '800ms' : '0ms',
        }}
      >
        <div className="flex gap-1.5 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/70" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-500/70" />
        </div>
        <div className="text-cyan/80 text-[10px] mb-1">~/projects</div>
        <div className="text-cyan flex items-center">
          <span>$ {displayText}</span>
          {isTypingCursor && <span className="ml-1 animate-pulse">_</span>}
        </div>
        <div
          className={`mt-1 text-ink/70 text-[10px] whitespace-pre-line leading-relaxed min-h-[1rem] transition-opacity duration-200 ${
            showOutput ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {showOutput ? current.out : '\u00a0'}
        </div>
      </div>
    </>
  );
}
