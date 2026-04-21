import { useEffect, useState } from 'react';

const COMMANDS = [
  'npm run leadership',
  'git commit -inspire',
  './build-culture.sh',
  'python train_models.py',
  'vercel deploy',
];

export default function TerminalAnimation({ revealContent }) {
  const [displayText, setDisplayText] = useState('');
  const [commandIndex, setCommandIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!revealContent) return;

    let timeoutId;
    const command = COMMANDS[commandIndex % COMMANDS.length];

    if (isTyping) {
      if (displayText.length < command.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(command.slice(0, displayText.length + 1));
        }, 80);
      } else {
        timeoutId = setTimeout(() => {
          setIsTyping(false);
        }, 2500);
      }
    } else {
      timeoutId = setTimeout(() => {
        setDisplayText('');
        setCommandIndex((i) => i + 1);
        setIsTyping(true);
      }, 800);
    }

    return () => clearTimeout(timeoutId);
  }, [displayText, isTyping, revealContent, commandIndex]);

  return (
    <>
      {/* Desktop: floating terminal top-right */}
      <div
        className={`hidden lg:block fixed top-20 right-10 z-20 transition-all duration-1000 ${
          revealContent ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-56 rounded-lg bg-black/40 backdrop-blur border border-cyan/30 p-4 font-mono text-sm shadow-lg shadow-cyan/10">
          <div className="flex gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red/60" />
            <div className="w-2 h-2 rounded-full bg-yellow/60" />
            <div className="w-2 h-2 rounded-full bg-cyan/60" />
          </div>
          <div className="text-cyan/80 text-xs mb-2">~/projects</div>
          <div className="text-cyan min-h-6 flex items-center">
            <span>$ {displayText}</span>
            {isTyping && <span className="ml-1 animate-pulse">_</span>}
          </div>
        </div>
      </div>

      {/* Mobile: inline terminal inline below hero text */}
      <div
        className={`lg:hidden mt-6 rounded-lg bg-black/40 backdrop-blur border border-cyan/30 p-3 font-mono text-xs transition-all duration-1000 ${
          revealContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{
          transitionDelay: revealContent ? '800ms' : '0ms',
        }}
      >
        <div className="flex gap-1.5 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-cyan/60" />
        </div>
        <div className="text-cyan/80 text-[10px] mb-1">~/projects</div>
        <div className="text-cyan flex items-center">
          <span>$ {displayText}</span>
          {isTyping && <span className="ml-1 animate-pulse">_</span>}
        </div>
      </div>
    </>
  );
}
