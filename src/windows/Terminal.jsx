import { useEffect, useRef, useState } from "react";
import WindowFrame from "#components/window/Frame";
import useWindowStore from "#store/window";
import { terminal } from "#constants/ui";
import { runCommand, autocomplete } from "./terminal/commands";

const Line = ({ line }) => {
  switch (line.type) {
    case "title":
      return <div className="font-semibold text-white">{line.value}</div>;
    case "hint":
      return <div className="italic text-cyan-400/80">{line.value}</div>;
    case "err":
      return <div className="text-red-400">{line.value}</div>;
    case "cmd":
      return (
        <div className="flex gap-4">
          <span className="w-28 shrink-0 text-emerald-400">{line.name}</span>
          <span className="text-zinc-400">{line.desc}</span>
        </div>
      );
    case "skill":
      return (
        <div className="flex items-center gap-2">
          <span className="w-32 shrink-0 text-zinc-300">{line.name}</span>
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-zinc-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
              style={{ width: `${line.level}%` }}
            />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">
            {line.category}
          </span>
        </div>
      );
    case "project":
      return (
        <div className="mb-2">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-white">{line.name}</span>
            <span className="text-xs text-zinc-500">— {line.tagline}</span>
          </div>
          <div className="ml-0 mt-0.5 flex flex-wrap gap-1.5">
            {line.tech.map((t) => (
              <span
                key={t}
                className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-emerald-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      );
    case "exp":
      return (
        <div className="mb-1.5 flex gap-3">
          <span className="w-10 shrink-0 font-mono text-cyan-400">{line.year}</span>
          <div>
            <span className="font-medium text-zinc-200">{line.title}</span>
            <span className="block text-xs text-zinc-500">{line.detail}</span>
          </div>
        </div>
      );
    case "link":
      return (
        <div className="flex gap-3">
          <span className="w-28 shrink-0 text-zinc-300">{line.name}</span>
          <span className="text-cyan-400">{line.url}</span>
        </div>
      );
    default:
      return <div className="text-zinc-300">{line.value}</div>;
  }
};

const Terminal = () => {
  const [history, setHistory] = useState([
    {
      id: 0,
      kind: "output",
      lines: terminal.welcome,
    },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const idRef = useRef(1);
  const openWindow = useWindowStore((s) => s.openWindow);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history]);

  const push = (kind, lines) => {
    setHistory((h) => [...h, { id: idRef.current++, kind, lines }]);
  };

  const handleCommand = (raw) => {
    if (!raw.trim()) {
      push("empty", []);
      return;
    }
    setCmdHistory((h) => [raw, ...h]);
    setHistIdx(-1);

    const out = runCommand(raw);

    push("input", raw);

    if (out.sideEffect?.type === "clear") {
      setHistory([]);
      return;
    }
    if (out.sideEffect?.type === "open-link") {
      window.open(out.sideEffect.url, "_blank", "noopener,noreferrer");
    }
    if (out.sideEffect?.type === "open-window") {
      openWindow(out.sideEffect.key);
    }

    if (out.lines.length) push("output", out.lines);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
      setSuggestions([]);
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const { value, matches } = autocomplete(input);
      if (matches.length > 1) {
        setSuggestions(matches);
      } else {
        setInput(value);
        setSuggestions([]);
      }
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(next);
      setInput(cmdHistory[next] ?? "");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = histIdx - 1;
      setHistIdx(next);
      setInput(next >= 0 ? cmdHistory[next] : "");
      return;
    }
    setSuggestions([]);
  };

  return (
    <WindowFrame windowKey="terminal" title={terminal.title} footer={terminal.footer}>
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="h-full overflow-y-auto bg-[#0c0c0f]/90 p-4 font-mono text-[13px] leading-relaxed"
      >
        {history.map((entry) =>
          entry.kind === "input" ? (
            <div key={entry.id} className="flex items-center gap-2">
              <span className="text-emerald-400">{terminal.prompt}</span>
              <span className="text-zinc-500">%</span>
              <span className="text-white">{entry.lines}</span>
            </div>
          ) : entry.kind === "empty" ? (
            <div key={entry.id} className="h-4" />
          ) : (
            <div key={entry.id} className="mb-3 space-y-1">
              {entry.lines.map((l, i) => (
                <Line key={i} line={l} />
              ))}
            </div>
          ),
        )}

        <div className="flex items-center gap-2">
          <span className="shrink-0 text-emerald-400">{terminal.prompt}</span>
          <span className="text-zinc-500">%</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent text-white caret-emerald-400 outline-none"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            aria-label={terminal.inputLabel}
          />
        </div>

        {suggestions.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-2 text-zinc-500">
            {suggestions.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        )}
      </div>
    </WindowFrame>
  );
};

export default Terminal;
