import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, User, Trash2, Sparkles, AlertCircle, Copy, Check } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.min.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const FLOWISE_API_URL = import.meta.env.VITE_FLOWISE_BASE_URL;
const FLOWISE_API_KEY = import.meta.env.VITE_FLOWISE_API_KEY;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Copy button for code blocks
// ---------------------------------------------------------------------------
const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback – ignore
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-gray-400 hover:text-gray-200 transition-all opacity-0 group-hover:opacity-100"
      title="Copy code"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
};

// ---------------------------------------------------------------------------
// Custom renderers for ReactMarkdown
// ---------------------------------------------------------------------------
const markdownComponents: Components = {
  // Fenced code blocks – with copy button & language label
  pre({ children, ...props }) {
    // Extract raw text for copy
    const extractText = (node: React.ReactNode): string => {
      if (typeof node === "string") return node;
      if (Array.isArray(node)) return node.map(extractText).join("");
      if (React.isValidElement(node)) {
        return extractText((node.props as { children?: React.ReactNode }).children ?? "");
      }
      return "";
    };

    const codeText = extractText(children).replace(/\n$/, "");

    // Try to extract language from child <code> className
    let lang = "";
    if (
      React.isValidElement(children) &&
      typeof (children.props as { className?: string }).className === "string"
    ) {
      const match = (children.props as { className: string }).className.match(/language-(\w+)/);
      if (match) lang = match[1];
    }

    return (
      <div className="group relative my-3 rounded-lg overflow-hidden border border-white/10">
        {lang && (
          <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10">
            <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
              {lang}
            </span>
          </div>
        )}
        <CopyButton text={codeText} />
        <pre {...props} className="!m-0 !rounded-none !bg-[#0d1117] p-4 overflow-x-auto text-sm leading-relaxed">
          {children}
        </pre>
      </div>
    );
  },

  // Inline code
  code({ children, className, ...props }) {
    // If it has a language class it's inside a <pre>, let the pre handler deal with it
    if (className) {
      return <code className={className} {...props}>{children}</code>;
    }
    return (
      <code
        className="px-1.5 py-0.5 rounded-md bg-primary/15 text-primary font-mono text-[0.85em] border border-primary/10"
        {...props}
      >
        {children}
      </code>
    );
  },

  // Tables
  table({ children, ...props }) {
    return (
      <div className="my-3 overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-full text-sm" {...props}>
          {children}
        </table>
      </div>
    );
  },
  th({ children, ...props }) {
    return (
      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider bg-white/5 border-b border-white/10" {...props}>
        {children}
      </th>
    );
  },
  td({ children, ...props }) {
    return (
      <td className="px-3 py-2 border-b border-white/5" {...props}>
        {children}
      </td>
    );
  },

  // Blockquote
  blockquote({ children, ...props }) {
    return (
      <blockquote
        className="my-3 border-l-4 border-primary/40 bg-primary/5 pl-4 py-2 rounded-r-lg italic text-muted-foreground"
        {...props}
      >
        {children}
      </blockquote>
    );
  },

  // Links
  a({ children, href, ...props }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary transition-colors"
        {...props}
      >
        {children}
      </a>
    );
  },

  // Horizontal rule
  hr(props) {
    return <hr className="my-4 border-white/10" {...props} />;
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const Chatbot: React.FC = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // -----------------------------------------------------------------------
  // Send message to Flowise
  // -----------------------------------------------------------------------
  const handleSend = async () => {
    const question = input.trim();
    if (!question || isLoading) return;

    setError(null);

    // Append user message
    const userMsg: Message = {
      id: "user-" + Date.now(),
      role: "user",
      content: question,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Add a temporary "thinking" placeholder
    const thinkingId = "thinking-" + Date.now();
    const thinkingMsg: Message = {
      id: thinkingId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, thinkingMsg]);
    setIsLoading(true);

    try {
      const response = await fetch(FLOWISE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + FLOWISE_API_KEY,
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("API responded with status " + response.status);
      }

      const data = await response.json();
      const answerText = data.text || data.response || data.answer || JSON.stringify(data);

      // Replace thinking placeholder with actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === thinkingId
            ? { ...msg, id: "assistant-" + Date.now(), content: answerText }
            : msg
        )
      );
    } catch (err) {
      console.error("Flowise API error:", err);
      setError(t("chatbot.error"));

      // Remove thinking placeholder on error
      setMessages((prev) => prev.filter((msg) => msg.id !== thinkingId));
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------------------------------------------------
  // Clear conversation
  // -----------------------------------------------------------------------
  const handleClear = () => {
    setMessages([]);
    setError(null);
    inputRef.current?.focus();
  };

  // -----------------------------------------------------------------------
  // Handle Enter key
  // -----------------------------------------------------------------------
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t("chatbot.title")}
            </h1>
            <Badge variant="default" className="text-xs px-2.5 py-0.5 gap-1">
              <Sparkles size={12} />
              AI
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{t("chatbot.subtitle")}</p>
        </div>

        {messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="gap-1.5 text-xs"
          >
            <Trash2 size={14} />
            {t("chatbot.clear")}
          </Button>
        )}
      </div>

      {/* Chat Container */}
      <Card className="shadow-sm border-primary/10">
        <CardContent className="p-0 flex flex-col h-[65vh]">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              // Welcome screen
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Bot size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {t("chatbot.welcome_title")}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mt-1">
                    {t("chatbot.welcome_desc")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {[
                    "What is the quadratic formula?",
                    "Explain photosynthesis",
                    "Solve for x: 2x + 5 = 13",
                  ].map((q) => (
                    <Button
                      key={q}
                      variant="outline"
                      size="sm"
                      className="text-xs rounded-full"
                      onClick={() => {
                        setInput(q);
                        inputRef.current?.focus();
                      }}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={"flex gap-3 " + (msg.role === "user" ? "justify-end" : "justify-start")}
                >
                  {/* Assistant avatar */}
                  {msg.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-1">
                      <Bot size={16} />
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={
                      "max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed " +
                      (msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary/70 text-foreground rounded-bl-md border")
                    }
                  >
                    {msg.role === "assistant" && msg.content === "" ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-primary" />
                        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.1s]" />
                        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.2s]" />
                        <span className="text-xs ml-1">{t("chatbot.thinking")}</span>
                      </div>
                    ) : msg.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/90 [&_.katex]:text-foreground [&_.katex-display]:my-3 [&_.katex-display]:overflow-x-auto [&_.katex-display>.katex]:text-base">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex, rehypeHighlight]}
                          components={markdownComponents}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span>{msg.content}</span>
                    )}
                  </div>

                  {/* User avatar */}
                  {msg.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground mt-1">
                      <User size={16} />
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Error banner */}
          {error && (
            <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20 flex items-center gap-2 text-xs text-destructive">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* Input area */}
          <div className="border-t p-4 bg-card">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("chatbot.input_placeholder")}
                disabled={isLoading}
                className="flex-1 h-11 text-sm"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="h-11 px-4 gap-1.5 font-semibold"
              >
                {isLoading ? (
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:0.1s]" />
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:0.2s]" />
                  </span>
                ) : (
                  <Send size={16} />
                )}
                <span className="hidden sm:inline">
                  {isLoading ? t("chatbot.sending") : t("chatbot.send")}
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;

