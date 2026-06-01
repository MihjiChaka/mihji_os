import React, { useState, useEffect, useRef } from "react";
import { Terminal, CpuIcon, Lock, ArrowRight, Power, Wifi, Shield, Disc, KeyRound } from "lucide-react";

interface SubsystemsBootProps {
  onBootComplete: () => void;
}

const LINUX_BOOT_LOGS = [
  "GNU GRUB version 2.06-8.ubuntu1",
  "Booting 'Mihji OS GNU/Linux (6.8.0-generic)'",
  "Loading Linux 6.8.0-generic ...",
  "Loading initial ramdisk ...",
  "[    0.000000] Linux version 6.8.0-generic (gcc version 12.3.0) (Ubuntu 6.8.0-42.42)",
  "[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-6.8.0-generic root=UUID=7e3d-815a ro quiet splash cgroup_enable=memory",
  "[    0.000000] KERNEL: Intel(R) Xeon(R) CPU @ 2.50GHz (2 Cores, 4 Threads)",
  "[    0.000000] x86/fpu: Supporting XSAVE with size 992 bytes",
  "[    0.000000] BIOS-provided physical RAM map:",
  "[    0.000000]  BIOS-e820: [mem 0x0000000000000000-0x000000000009ffff] usable",
  "[    0.000000]  BIOS-e820: [mem 0x0000000000100000-0x000000005fffffff] usable",
  "[    0.000512] ACPI: Core revision 20230628",
  "[    0.012450] smpboot: CPU0: Intel(R) Xeon(R) CPU @ 2.50GHz",
  "[    0.025112] smpboot: Allowing 4 CPUs, 4 hotplug CPUs",
  "[    0.051020] devtmpfs: initialized",
  "[    0.081190] clocksource: hpet: mask: 0xffffffff max_cycles: 3348632127",
  "[    0.110243] rtc_cmos 00:02: RTC can wake from S4",
  "[    0.150930] SCSI subsystem initialized",
  "[    0.201452] libata version 3.00 PCIe SATA Controller active",
  "[    0.231221] usbcore: registered new interface driver usbfs",
  "[    0.252093] EXT4-fs (sda1): mounted filesystem with ordered data mode. Opts: (null)",
  " ",
  "Systemd-udevd[124]: starting version 252.12-1ubuntu1",
  "[[  OK  ]] Mounted /sys/kernel/config",
  "[[  OK  ]] Mounted /sys/kernel/debug",
  "[[  OK  ]] Mounted /dev/mqueue",
  "[[  OK  ]] Started udev Kernel Device Manager.",
  "[[  OK  ]] Create Static Device Nodes in /dev.",
  "[[  OK  ]] Starting Apply Kernel Variables...",
  "[[  OK  ]] Started Apply Kernel Variables.",
  "[[  OK  ]] Starting Load Kernel Modules...",
  "[[  OK  ]] Started Load Kernel Modules.",
  "[[  OK  ]] Reached target Local File Systems (Pre).",
  "[[  OK  ]] Reached target Local File Systems.",
  "[[  OK  ]] Starting Raise Network Interfaces...",
  "[[  OK  ]] Started Raise Network Interfaces.",
  "[[  OK  ]] Starting Network Time Synchronization...",
  "[[  OK  ]] Started Network Time Synchronization (NTP).",
  "[[  OK  ]] Reached target System Initialization.",
  " ",
  "Initialising Mihji OS v3.5 microsecond scheduling daemon...",
  "  -> Host: CENTRAL-AFRICA-NODE (Zambia)",
  "  -> Relational core database: Postgres on standby / ready",
  "  -> Non-relational ledger: MongoDB online / secure",
  "  -> LLM Proxy Gateway: process.env.GEMINI_API_KEY detected",
  "  -> Routing Matrix: L3 Cisco CCNP Switch Layer-3 bound",
  " ",
  "[[  OK  ]] Started Mihji OS Portfolio Engine Subsystems.",
  "[[  OK  ]] Starting Gnome Display Manager (GDM) / Welcome Panel...",
  "[[  OK  ]] Started Gnome Display Manager daemon session.",
  "Starting system graphical interface server...",
  "Laying down active visual telemetry. Launching secure login loop..."
];

export default function SubsystemsBoot({ onBootComplete }: SubsystemsBootProps) {
  const [bootStage, setBootStage] = useState<"LINUX_BOOT" | "WELCOME_GUI" | "DESKTOP_TRANSITION">("LINUX_BOOT");
  const [logs, setLogs] = useState<string[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSystemMuted, setIsSystemMuted] = useState(false);

  const consoleEndRef = useRef<HTMLDivElement | null>(null);

  // Play a quick retro-style synthesizer bleep helper
  const playLocalBeep = (freq = 800, duration = 0.08, type: OscillatorType = "sine") => {
    if (isSystemMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context might fail to initialize if user hasn't interacted yet, ignore safely
    }
  };

  // Stage 1: Linux Boot Terminal scrolling log logic
  useEffect(() => {
    if (bootStage !== "LINUX_BOOT") return;

    if (currentLogIndex < LINUX_BOOT_LOGS.length) {
      const delay = currentLogIndex < 5 ? 200 : Math.floor(Math.random() * 55) + 15;
      const timer = setTimeout(() => {
        setLogs((prev) => [...prev, LINUX_BOOT_LOGS[currentLogIndex]]);
        setCurrentLogIndex(currentLogIndex + 1);
        
        // Play very short clicks during boot sequence
        if (currentLogIndex % 4 === 0) {
          playLocalBeep(1200 + (currentLogIndex * 15), 0.01, "triangle");
        }
      }, delay);
      return () => clearTimeout(timer);
    } else {
      // Transition to beautiful system login interface
      const transitionTimer = setTimeout(() => {
        setBootStage("WELCOME_GUI");
        playLocalBeep(880, 0.25, "sine");
      }, 500);
      return () => clearTimeout(transitionTimer);
    }
  }, [currentLogIndex, bootStage]);

  // Keep console scrolled to the bottom
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Stage 2: Clock updates for GDM Welcome Screen (Zambia / Central Africa Node time)
  useEffect(() => {
    const updateTime = () => {
      const targetTimeStr = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
      const targetDateStr = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric"
      });
      setTimeStr(targetTimeStr);
      setDateStr(targetDateStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError("");
    playLocalBeep(1000, 0.08, "sine");

    setTimeout(() => {
      // Accept any password but show a genuine decrypt transition
      setIsAuthenticating(false);
      setBootStage("DESKTOP_TRANSITION");
      playLocalBeep(1320, 0.3, "sine");
      
      setTimeout(() => {
        onBootComplete();
      }, 800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-[#020509] theme-transition z-[9999] overflow-hidden select-none select-none font-mono">
      {/* Universal scanline CRT filter overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-40 z-50" />

      {/* STAGE 1: Linux Command-Line Screen */}
      {bootStage === "LINUX_BOOT" && (
        <div className="w-full h-full p-4 md:p-8 flex flex-col justify-between text-zinc-350 text-[10px] md:text-xs">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2 text-[9px]">
            <div className="flex items-center space-x-1.5 font-bold tracking-wide text-cyan-400">
              <Terminal className="w-4 h-4 animate-pulse" />
              <span>CENTRAL_AFRICA_NODE://MIHJI.SYS://BOOT</span>
            </div>
            <div className="flex space-x-4 text-zinc-500 font-mono">
              <span>PORT: 3000</span>
              <span>EST: 2026-05-29</span>
            </div>
          </div>

          {/* Logs View Area */}
          <div className="flex-1 my-4 overflow-y-auto pr-2 flex flex-col justify-end text-left select-text">
            <div className="space-y-1 max-h-[80vh] font-mono leading-relaxed lg:max-w-5xl">
              {logs.map((log, idx) => {
                const isError = log.includes("FAILED") || log.includes("ALERT") || log.includes("CRITICAL");
                const isOk = log.includes("[[  OK  ]]");
                const isArrow = log.startsWith("  ->");
                
                let textColor = "text-zinc-350";
                if (isOk) textColor = "text-emerald-400";
                else if (isError) textColor = "text-rose-400 font-bold";
                else if (isArrow) textColor = "text-cyan-400 pl-4";
                else if (log.startsWith("GNU GRUB") || log.startsWith("Booting") || log.startsWith("Loading")) textColor = "text-cyan-300 font-semibold";

                return (
                  <div key={idx} className={`${textColor} font-mono flex items-start break-all`}>
                    <span className="text-zinc-600/70 mr-3 select-none">[{ (1000 + idx * 43).toString().padStart(4, '0') }]</span>
                    <span>{log}</span>
                  </div>
                );
              })}
              <div ref={consoleEndRef} />
            </div>
          </div>

          {/* Linux Footer Progress bar */}
          <div className="border-t border-zinc-800/60 pt-3 flex items-center justify-between font-mono text-[9px] text-zinc-500">
            <div className="flex items-center space-x-2">
              <CpuIcon className="w-3.5 h-3.5 text-zinc-400 animate-spin" />
              <span>SYSTEM DECRYPTER INTEGRITY: OK</span>
            </div>
            <div className="font-bold text-cyan-500 select-none">
              LOADING SYSTEM CONTAINER: {Math.floor((currentLogIndex / LINUX_BOOT_LOGS.length) * 100)}%
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: Graphical Ubuntu/Linux Gnome GUI Welcome & Login and Decryption System */}
      {(bootStage === "WELCOME_GUI" || bootStage === "DESKTOP_TRANSITION") && (
        <div 
          className={`w-full h-full relative flex flex-col justify-between items-center bg-[#020509] transition-all duration-700 p-6 md:p-8 select-none z-10 ${
            bootStage === "DESKTOP_TRANSITION" ? "opacity-0 scale-95 duration-500" : "opacity-100 scale-100 animate-fade-in"
          }`}
        >
          {/* Ambient Glowing background circle graphics */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-950/20 to-purple-950/25 blur-3xl rounded-full pointer-events-none -z-10" />
          <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] bg-cyan-700/5 blur-3xl rounded-full pointer-events-none -z-10" />

          {/* Top Panel - GDM style lock layout controls */}
          <div className="w-full flex items-center justify-between text-zinc-400 text-[10px] md:text-xs">
            <div className="flex items-center space-x-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-zinc-500 select-none">NODE:</span>
              <span className="text-zinc-300 font-bold select-none">CENTRAL-AFRICA-CHAKA</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 pr-2 border-r border-zinc-800">
                <Wifi className="w-3.5 h-3.5 text-cyan-500" />
                <span className="text-zinc-400 select-none">CONNECTED</span>
              </div>
              <button 
                onClick={() => {
                  playLocalBeep(450, 0.15, "sawtooth");
                  setIsSystemMuted(!isSystemMuted);
                }}
                className="hover:text-cyan-400 px-1 py-0.5"
                title="Toggle Speaker Beeps"
              >
                {isSystemMuted ? "🔈 MUTED" : "🔊 AUDIO ACTIVE"}
              </button>
            </div>
          </div>

          {/* Middle panel - Elegant login profile setup */}
          <div className="flex-1 w-full flex flex-col items-center justify-center max-w-sm">
            
            {/* Display OS Time and Date with high-end Display Typography */}
            <div className="text-center mb-8 font-sans">
              <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-white mb-2 font-sans select-none">
                {timeStr || "12:00:00"}
              </h1>
              <p className="text-[10px] md:text-[11px] uppercase tracking-widest text-cyan-400/80 font-mono select-none">
                {dateStr || "LOADING NODE CLOCK..."}
              </p>
            </div>

            {/* Profile Avatar & login box card */}
            <div className="w-full bg-slate-950/60 backdrop-blur-xl border border-cyan-500/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center">
              
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

              {/* Glowing User Avatar Ring */}
              <div className="relative mb-4 w-20 h-20 flex items-center justify-center rounded-full bg-slate-900 border border-zinc-800/80 group">
                <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-pulse group-hover:scale-105 transition-all duration-300" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-950 to-slate-950 flex items-center justify-center border border-cyan-500/20">
                  <span className="text-white text-xl font-light font-sans tracking-widest select-none">GC</span>
                </div>
                <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center" title="Operator online" />
              </div>

              {/* User identity descriptors */}
              <div className="text-center mb-5">
                <h2 className="text-zinc-200 text-sm font-sans font-medium tracking-wide">
                  George Mihji Chaka
                </h2>
                <p className="text-[8px] text-zinc-500 font-mono mt-0.5 select-none uppercase tracking-widest">
                  Full Stack Developer | Systems Architect
                </p>
                <code className="text-[8.5px] text-cyan-500/90 font-mono mt-1 px-2 py-0.5 rounded bg-cyan-950/30 inline-block border border-cyan-500/15">
                  george.chaka@goodnatureagro.com
                </code>
              </div>

              {/* Enter Session input form */}
              <form onSubmit={handleLoginSubmit} className="w-full space-y-3.5 relative">
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full relative py-2.5 px-4 bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 hover:text-white font-mono font-bold rounded-lg text-xs tracking-widest uppercase transition-all duration-200 shadow-lg shadow-cyan-950/40 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isAuthenticating ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mr-1" />
                      <span>DECRYPTING...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 mr-1" />
                      <span>LOG IN</span>
                    </>
                  )}
                </button>

                {isAuthenticating ? (
                  <p className="text-center text-[8.5px] text-cyan-400 uppercase tracking-widest animate-pulse font-mono">
                    Handshake established... unlocking session decrypter...
                  </p>
                ) : (
                  <p className="text-center text-[8.5px] text-zinc-500 uppercase tracking-widest font-mono select-none">
                    Security session standby. Click log in to verify token.
                  </p>
                )}
              </form>
              
            </div>
          </div>

          {/* Bottom Panel - Power & System Actions */}
          <div className="w-full max-w-4xl border-t border-zinc-900/40 pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] md:text-xs">
            <div className="flex items-center space-x-2 text-zinc-500 font-mono text-[9px] select-none">
              <Shield className="w-3.5 h-3.5 text-emerald-500/70" />
              <span>LINUX SECURITY PAM MODULE V1.2.9 ACTIVE</span>
            </div>
            
            <div className="flex items-center space-x-5 text-zinc-400 font-mono">
              <div className="flex items-center space-x-1.5 select-none">
                <Disc className="w-3.5 h-3.5 text-zinc-600" />
                <span>KERN: 6.8.0-generic</span>
              </div>
              <button 
                onClick={() => {
                  playLocalBeep(350, 0.4, "sine");
                  // Reset variables back to Linux boot to demo rebooting
                  setLogs([]);
                  setCurrentLogIndex(0);
                  setPassword("");
                  setBootStage("LINUX_BOOT");
                }}
                className="flex items-center space-x-1 hover:text-rose-400 transition"
              >
                <Power className="w-3.5 h-3.5 text-rose-500" />
                <span>REBOOT</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
