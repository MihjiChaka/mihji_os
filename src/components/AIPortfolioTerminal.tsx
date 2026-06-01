import React, { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon, ShieldCheck, CornerDownLeft, Sparkles, Send } from "lucide-react";
import { ChatMessage } from "../types";

const ASCII_NEOFETCH = `
      /\\_/\\
     ( o.o )
     ███████             Mihji George Chaka@CENTRAL-COG-OS
    █████████            --------------------------------
   ██ ▀ ██ ▀ ██          OS: Mihji-MindOS v3.5-flash
   ██   ██   ██          CCNP No: CS-2023-R4118 (Advanced)
   █████████████         CCNA No: CS-2021-S9014 (Wireless)
   ██ █ █ █ █ ██         Stack: PHP, Python, C# / ASP.NET
    █████████            Database: PostgreSQL, MongoDB
      █████              Uptime: 2026-05-28T14:45-ACTIVE
`;

const RESUME_ASCII = `
=========================================
      MIHJI GEORGE CHAKA - PORTFOLIO RESUME
=========================================
SUMMARY:
  Dynamic & resourceful multipotentialite combining software engineering,
  CCNP-level Cisco networking, support operations, and financial administration.
  Thrives at intersection of code, databases, and core infrastructure routing.

TECHNICAL STACKS:
  PHP (Laravel, CodeIgniter), Python, C# & .NET Core, ASP.NET,
  Enterprise Cisco Routing/Switching, SD-WAN, Firewalls/VPNs,
  PostgreSQL, MySQL, MongoDB, Redis, Docker, Azure Data Engineering,
  System Administration, and structured ticket resolution.

EXPERIENCE LEDGERS:
  * Good Nature Agro: Data & Tech Support Associate (2025 - Present)
  * Good Nature Agro: Accounts Associate - Support (2024 - Dec 2024)
  * Good Nature Agro: Finance Admin & Warehouse Mgr (2023)
  * Center for Ticks & Tick-Borne Diseases: C# Backend dev (2020)
  * Chipata General Hospital ART Clinic: Data Clerk (2019)

EDUCATION:
  * National College of IT (Malawi) - Computing Diploma (NCC Level 4)
`;

export default function AIPortfolioTerminal() {
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<Array<{ type: "cmd" | "resp" | "ai"; text: string }>>([
    { type: "resp", text: "Chaka AI Intelligence matrix loaded successfully." },
    { type: "resp", text: "Host: gateway-zambia.internet.net | Port: 3000" },
    { type: "resp", text: "Type 'help' to review manual overrides, or converse directly with the AI Clone." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isLoading]);

  const handleCommand = async (cmdString: string) => {
    const trimmed = cmdString.trim();
    if (!trimmed) return;

    // Append command to visual panel logs
    const newLogs = [...history, { type: "cmd" as const, text: `Guest_Operator# ${trimmed}` }];
    setHistory(newLogs);
    setInputVal("");

    const lowerCmd = trimmed.toLowerCase();

    // Deterministic retro console actions
    if (lowerCmd === "help") {
      setHistory((prev) => [
        ...prev,
        {
          type: "resp",
          text: `SYSTEM ARCHITECTURE MANUAL COMMAND OVERRIDES:
  help        - Reveal visual operator overrides
  cat resume  - Read standard CV archives
  neofetch    - Fetch core profile specs and ASCII layout
  ping skills - Measure latency links of primary language compilers
  references  - Retrieve verified lead manager references
  clear       - Wipe terminal cache buffer
  
  [HINT]: Ask any question about Mihji's qualifications (e.g. OSPF settings, accounts, or Laravel development) and the AI Clone will answer instantly!`
        }
      ]);
      return;
    }

    if (lowerCmd === "cat resume") {
      setHistory((prev) => [...prev, { type: "resp", text: RESUME_ASCII }]);
      return;
    }

    if (lowerCmd === "neofetch") {
      setHistory((prev) => [...prev, { type: "resp", text: ASCII_NEOFETCH }]);
      return;
    }

    if (lowerCmd === "ping skills") {
      setHistory((prev) => [
        ...prev,
        {
          type: "resp",
          text: `Pinging main system assets (ICMP echo payloads):
  PING 10.1.1.10 (PHP Laravel Compiler) 56(84) bytes of data.
    64 bytes from 10.1.1.10: icmp_seq=1 ttl=64 time=10.1 ms
  PING 10.1.2.5 (C# .NET Core Engine) 56(84) bytes of data.
    64 bytes from 10.1.2.5: icmp_seq=1 ttl=64 time=4.32 ms
  PING 10.1.5.1 (Cisco CCNP Routing Gateway) 56(84) bytes of data.
    64 bytes from 10.1.5.1: icmp_seq=1 ttl=64 time=2.15 ms
  PING 10.2.2.10 (MongoDB cluster node) 56(84) bytes of data.
    64 bytes from 10.2.2.10: icmp_seq=1 ttl=64 time=16.8 ms
  --- Skills diagnostic link success. Jitter: 1.4ms. Status: COMPILER ONLINE.`
        }
      ]);
      return;
    }

    if (lowerCmd === "references") {
      setHistory((prev) => [
        ...prev,
        {
          type: "resp",
          text: `PROFESSIONAL LEADER REFERENCES:
  1. DR. FREDAH BANDA (Software Engineering Mgr, Good Nature Agro) - Tel: +260977789980 | Email: fredah.banda@goodnatureagro.com
  2. MR. MATHEWS BANDA (Lead Support, Good Nature Agro) - Tel: +260976325495 | Email: mathews.banda@goodnatureagro.com
  3. MR. CHABALA (Data Associate, Chipata District Health Office) - Tel: +26097775508
  4. MR. PETER MFUNE (Human Resource Mgr, Impact Enterprises) - Tel: +26097380558`
        }
      ]);
      return;
    }

    if (lowerCmd === "clear") {
      setHistory([
        { type: "resp", text: "Terminal history cleared. Command overrides matrix loaded." }
      ]);
      return;
    }

    // Default route: Query server-side Gemini AI interface proxy
    setIsLoading(true);

    try {
      const chatPayload = [
        ...chatHistory.map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          content: msg.content
        })),
        { role: "user", content: trimmed }
      ];

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatPayload })
      });

      if (!response.ok) {
        throw new Error("Local intelligence hub response was offline.");
      }

      const data = await response.json();
      const aiReply = data.text || "Diagnostic routing timeout.";

      setHistory((prev) => [...prev, { type: "ai", text: aiReply }]);
      setChatHistory((prev) => [
        ...prev,
        { id: Math.random().toString(), role: "user", content: trimmed, timestamp: new Date().toLocaleTimeString() },
        { id: Math.random().toString(), role: "assistant", content: aiReply, timestamp: new Date().toLocaleTimeString() }
      ]);
    } catch (err: any) {
      setHistory((prev) => [
        ...prev,
        {
          type: "resp",
          text: `[SYSTEM DIAG-ALERT]: Connection error. Ensure GEMINI_API_KEY resides in secrets. Fallback to cached knowledge database.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputVal);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/95 rounded-lg border border-cyan-500/20 shadow-2xl relative overflow-hidden text-cyan-400 font-mono">
      
      {/* Decorative monitor CRT line filters scan effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-20 z-10" />

      {/* Terminal Title block bar */}
      <div className="flex items-center justify-between bg-slate-900 px-3 py-2 border-b border-cyan-500/10">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] uppercase font-bold tracking-wider">CHAKA_CORE_MAIN_TERMINAL.EXE</span>
        </div>
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest hidden sm:inline">AI-DOUBLE ONLINE</span>
        </div>
      </div>

      {/* Message Ledger history container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin select-text font-mono">
        {history.map((h, i) => {
          if (h.type === "cmd") {
            return (
              <div key={i} className="text-zinc-200 font-semibold flex items-start gap-1">
                <span className="text-cyan-600 font-mono select-none">&gt;</span>
                <span className="whitespace-pre-wrap">{h.text}</span>
              </div>
            );
          } else if (h.type === "ai") {
            return (
              <div key={i} className="flex gap-2 bg-cyan-950/20 border border-cyan-500/10 p-3 rounded-md text-cyan-200 shadow-inner">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="text-[11px] leading-relaxed whitespace-pre-line font-medium prose-invert text-cyan-300">
                  {h.text}
                </div>
              </div>
            );
          } else {
            return (
              <div key={i} className="text-cyan-500/80 leading-normal text-[10px] whitespace-pre-wrap select-text pl-1.5 border-l border-cyan-500/10">
                {h.text}
              </div>
            );
          }
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-cyan-300/80 animate-pulse pl-1.5 font-mono text-[10px]">
            <span className="w-2 h-3.5 bg-cyan-400 animate-ping"></span>
            <span>CHAKA COGNITIVE AI PROCESSING SEQUENCE ACTIVE...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Operating Input Command block bottom bar */}
      <div className="flex items-center border-t border-cyan-500/10 bg-slate-900/50 p-2 gap-2">
        <span className="text-cyan-500 px-1 font-bold select-none">&gt;&gt;</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter shell parameter (e.g. 'help') or inquire qualifications..."
          className="flex-1 bg-transparent text-cyan-100 font-mono text-xs focus:outline-none placeholder-cyan-800 disabled:opacity-50"
          disabled={isLoading}
        />
        <button
          onClick={() => handleCommand(inputVal)}
          disabled={isLoading || !inputVal.trim()}
          className="p-1.5 bg-cyan-950 hover:bg-cyan-500 hover:text-black border border-cyan-500/20 rounded cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed select-none"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
