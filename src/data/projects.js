// Project card data. Edit here to update the Projects section.
export const projects = [
  {
    title: 'chrispowell.ai',
    tag: 'Live · React + Claude API',
    description:
      'This site. I built it from scratch one evening with Claude Code and a laptop. React, Vite, Tailwind, the Anthropic Claude API, and a Vercel function I wrote. The AI you can chat with below is part of it. I wanted to see if I could make it real.',
    link: '#chat',
    chatPrompt: 'Tell me more about how Chris built this site — the stack, the Claude API integration, and why he built it in one evening.',
  },
  {
    title: 'DadOps Bot',
    tag: 'Personal · Python + Telegram + Claude',
    description:
      'A personal AI agent in Python that watches Gmail for family emails, pulls out events with Claude, sends me organized digests over Telegram, and syncs two Google Calendars once I confirm. Keeps a local SQLite memory that grows over time. I built it because I did not want to miss anything important for my daughter Waverly.',
    link: '#',
    chatPrompt: 'How does DadOps Bot actually work? Walk me through the Gmail → Claude → Telegram → Calendar flow and what Chris learned building it.',
  },
  {
    title: 'Proactive AI Enablement',
    tag: 'Indeed · Internal Initiative',
    description:
      'Workshops and hands-on sessions that turned AI curiosity into real capability across teams. Started as informal conversations. Grew into a proper workshop series because people kept showing up and asking for more.',
    link: '#',
    chatPrompt: 'What does Chris actually do in the AI enablement workshops, and how did they turn into a real program?',
  },
];
