const TECH = ['React', 'Node.js', 'AWS', 'Leadership', 'Operations', 'AI/ML'];

export default function TechStack({ revealContent }) {
  return (
    <div className={`mt-8 md:mt-10 transition-all duration-1000 ${
      revealContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="text-xs font-mono text-ink/50 uppercase tracking-widest mb-3">Stack</div>
      <div className="flex flex-wrap gap-2">
        {TECH.map((tech, i) => (
          <div
            key={tech}
            className={`text-xs px-3 py-1.5 rounded-full border border-cyan/30 text-cyan/70 bg-cyan/5 hover:bg-cyan/15 hover:border-cyan/60 hover:text-cyan transition-all duration-300 cursor-default ${
              revealContent ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transitionDelay: revealContent ? `${900 + i * 80}ms` : '0ms',
            }}
          >
            {tech}
          </div>
        ))}
      </div>
    </div>
  );
}
