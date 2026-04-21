import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

const MAX_CHARS = 500;

const SUGGESTED = [
  "What's Chris's take on AI right now?",
  'How does the maker side connect to leadership?',
  'What is Powell Family Lights and how does it work?',
  'What would Chris build with a free weekend?',
  'Why was this site built?',
  'Be honest: how many cameras is too many cameras?',
];

const markdownComponents = {
  p: ({ children }) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-cyan hover:underline"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-ink">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-5 my-2 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-5 my-2 space-y-1">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: ({ inline, children }) =>
    inline ? (
      <code className="px-1.5 py-0.5 bg-white/10 rounded text-cyan text-[0.85em] font-mono">
        {children}
      </code>
    ) : (
      <code className="block p-3 my-2 bg-white/5 rounded text-xs font-mono overflow-x-auto">
        {children}
      </code>
    ),
};

function FeedbackWidget({ messageIndex, assistantContent, onSubmit }) {
  const [reaction, setReaction] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleReaction = async (thumbs) => {
    try {
      await fetch('/api/analytics/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: thumbs === 'up' ? '👍' : '👎',
          chatContext: assistantContent.substring(0, 100),
          sentiment: thumbs === 'up' ? 'positive' : 'negative',
        }),
      });
      setReaction(thumbs);
      setTimeout(() => setReaction(null), 2000);
    } catch {
      // Silently fail analytics
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    try {
      await fetch('/api/analytics/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: feedback.trim(),
          chatContext: assistantContent.substring(0, 100),
          sentiment: 'constructive',
        }),
      });
      setSubmitted(true);
      setFeedback('');
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 2000);
    } catch {
      // Silently fail analytics
    }
  };

  return (
    <div className="mt-2 flex gap-3 text-xs text-ink/50 items-center">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleReaction('up')}
          disabled={reaction === 'up'}
          className={`transition-colors ${
            reaction === 'up'
              ? 'text-cyan'
              : 'hover:text-cyan disabled:cursor-not-allowed'
          }`}
          aria-label="Helpful"
        >
          👍
        </button>
        <button
          type="button"
          onClick={() => handleReaction('down')}
          disabled={reaction === 'down'}
          className={`transition-colors ${
            reaction === 'down'
              ? 'text-cyan'
              : 'hover:text-cyan disabled:cursor-not-allowed'
          }`}
          aria-label="Not helpful"
        >
          👎
        </button>
      </div>

      {!isOpen && !submitted && reaction === null && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="hover:text-cyan transition-colors"
        >
          More feedback?
        </button>
      )}
      {isOpen && (
        <form onSubmit={handleSubmit} className="flex gap-2 flex-1 max-w-xs">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What could be better?"
            rows={1}
            className="flex-1 resize-none rounded px-2 py-1 bg-white/5 border border-white/10 text-xs text-ink placeholder:text-ink/30 focus:border-cyan focus:outline-none"
          />
          <button
            type="submit"
            disabled={!feedback.trim()}
            className="px-3 py-1 rounded bg-cyan/20 text-cyan text-xs font-semibold hover:bg-cyan/30 disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </form>
      )}
      {submitted && <span className="text-cyan">Thanks</span>}
    </div>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > MAX_CHARS || isTyping) return;

    setError('');
    const history = messages.map(({ role, content }) => ({ role, content }));
    setMessages((m) => [...m, { role: 'user', content: trimmed }]);
    setInput('');
    setIsTyping(true);

    // Log question to analytics (non-blocking)
    fetch('/api/analytics/question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: trimmed }),
    }).catch(() => {
      // Silently fail analytics
    });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status}).`);
      }
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: data.response,
          followups: Array.isArray(data.followups) ? data.followups : [],
        },
      ]);
    } catch (err) {
      setError(
        err?.message ||
          "Couldn't reach the chat service. Try again in a moment."
      );
    } finally {
      setIsTyping(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const overLimit = input.length > MAX_CHARS;
  const empty = messages.length === 0;
  const canSend = input.trim().length > 0 && !overLimit && !isTyping;

  return (
    <section id="chat" className="section">
      <h2 className="h-section">How I Think</h2>
      <p className="mt-4 sub">
        Ask me anything. (Well, AI me.)
      </p>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div
          ref={scrollRef}
          className="h-[28rem] overflow-y-auto px-5 md:px-6 py-6 text-sm"
        >
          {empty && !isTyping && (
            <div className="space-y-2">
              <p className="text-ink/50 mb-3 text-xs font-mono uppercase tracking-wider">
                Try one of these
              </p>
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="block w-full text-left px-4 py-3 rounded-lg border border-white/10 bg-white/[0.02] text-ink/80 hover:border-cyan/40 hover:text-ink hover:bg-white/[0.04] transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className="mb-4">
              <div
                className={`flex ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'user' ? (
                  <div className="max-w-[85%] rounded-xl bg-purple/80 text-white px-4 py-2.5 leading-relaxed">
                    {m.content}
                  </div>
                ) : (
                  <div className="max-w-[90%] border-l-2 border-cyan pl-4 py-0.5 text-ink/90">
                    <ReactMarkdown
                      components={markdownComponents}
                      rehypePlugins={[rehypeSanitize]}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
              {m.role === 'assistant' && (
                <div className="mt-2 ml-6">
                  <FeedbackWidget
                    messageIndex={i}
                    assistantContent={m.content}
                    onSubmit={(feedback) => {
                      // Feedback submission handled in FeedbackWidget
                    }}
                  />
                  {m.followups?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {m.followups.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => send(f)}
                          disabled={isTyping}
                          className="text-xs px-3 py-1.5 rounded-full border border-cyan/30 text-cyan/90 hover:bg-cyan/10 hover:border-cyan/60 hover:text-cyan transition-all disabled:opacity-40 disabled:cursor-not-allowed text-left"
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="border-l-2 border-cyan pl-4 py-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-cyan rounded-full animate-blink" />
                <span
                  className="w-1.5 h-1.5 bg-cyan rounded-full animate-blink"
                  style={{ animationDelay: '0.2s' }}
                />
                <span
                  className="w-1.5 h-1.5 bg-cyan rounded-full animate-blink"
                  style={{ animationDelay: '0.4s' }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-2 text-xs text-red-400/90 bg-red-500/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="border-t border-white/10 p-4">
          <div className="flex gap-3 items-start">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask anything…"
              rows={1}
              disabled={isTyping}
              aria-label="Your question"
              className="flex-1 resize-none rounded-lg bg-bg border border-white/10 px-4 py-2.5 text-sm text-ink font-mono placeholder:text-ink/30 placeholder:font-sans focus:border-cyan focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="shrink-0 px-5 py-2.5 rounded-lg bg-cyan text-bg text-sm font-semibold hover:bg-cyan/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-mono">
            <span className={overLimit ? 'text-red-400' : 'text-ink/30'}>
              {input.length}/{MAX_CHARS}
            </span>
            <span className="text-ink/30 hidden sm:inline">
              Enter to send · Shift+Enter for newline
            </span>
          </div>
        </form>
      </div>

      <p className="mt-5 text-xs text-ink/40 text-center leading-relaxed max-w-2xl mx-auto">
        Powered by Claude Haiku (Anthropic) · Built by Chris Powell · This is AI,
        please verify anything important directly with Chris at{' '}
        <a
          href="mailto:hello@chrispowell.ai"
          className="text-cyan hover:underline"
        >
          hello@chrispowell.ai
        </a>
      </p>
    </section>
  );
}
