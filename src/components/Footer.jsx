export default function Footer() {
  return (
    <footer id="contact" className="border-t border-white/5 mt-20">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="text-center md:text-left font-mono text-cyan text-lg font-semibold tracking-tight">
            CP.AI
          </div>

          <div className="text-center">
            <a
              href="mailto:hello@chrispowell.ai"
              className="text-ink/80 hover:text-cyan transition-colors"
            >
              hello@chrispowell.ai
            </a>
          </div>

          <div className="flex justify-center md:justify-end">
            <a
              href="https://www.linkedin.com/in/powellness"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chris Powell on LinkedIn"
              className="p-2 text-ink/70 hover:text-cyan transition-colors"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.452 20.452h-3.558v-5.569c0-1.328-.028-3.037-1.852-3.037-1.854 0-2.136 1.447-2.136 2.94v5.666H9.348V9h3.415v1.561h.048c.476-.9 1.637-1.85 3.37-1.85 3.606 0 4.271 2.372 4.271 5.456v6.285zM5.337 7.433a2.063 2.063 0 01-2.063-2.063 2.063 2.063 0 114.125 0 2.063 2.063 0 01-2.062 2.063zM7.117 20.452H3.555V9h3.562v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 text-center text-xs text-ink/40">
          Built by Chris Powell · Always learning, always building ·{' '}
          <a href="https://chrispowell.ai" className="hover:text-cyan transition-colors">chrispowell.ai</a>
          {' '}· © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
