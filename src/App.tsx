import React, { useState, useEffect } from "react";
import {
  FolderOpen,
  Terminal as TermIcon,
  User,
  Cpu,
  ShieldAlert,
  GraduationCap,
  Award,
  Phone,
  Settings,
  X,
  Volume2,
  VolumeX,
  Clock,
  RefreshCw,
  Eye,
  Layers,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Send,
  UserCheck,
  Lock,
  Unlock,
  Search,
  StickyNote,
  Mail,
  Copy
} from "lucide-react";

import { WindowConfig, WindowId } from "./types";
import {
  skillCategories,
  experienceData,
  certificationsData,
  educationData,
  referencesData
} from "./data/cvData";

import CanvasNetworkBg from "./components/CanvasNetworkBg";
import CiscoSandbox from "./components/CiscoSandbox";
import SubsystemsBoot from "./components/SubsystemsBoot";
import AIPortfolioTerminal from "./components/AIPortfolioTerminal";
import DossierWindow from "./components/DossierWindow";
import FileExplorer from "./components/FileExplorer";
import SettingsApp from "./components/SettingsApp";
import TaskManager from "./components/TaskManager";

// Reusable helper function to center windows perfectly in the visible desktop viewport
const centerWindow = (width: number, height: number) => {
  if (typeof window === "undefined") return { x: 200, y: 150 };
  return {
    x: (window.innerWidth - width) / 2,
    y: (window.innerHeight - height) / 2
  };
};

const INITIAL_WINDOWS = (width: number, height: number): WindowConfig[] => {
  const safeWidth = width && width > 400 ? width : 1200;
  const safeHeight = height && height > 300 ? height : 800;
  const getCenter = (sw: number, sh: number) => centerWindow(sw, sh);

  return [
    {
      id: "about",
      title: "ABOUT_ME.SYS",
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      size: { width: Math.min(680, safeWidth * 0.9), height: 480 },
      position: getCenter(Math.min(680, safeWidth * 0.9), 480)
    },
    {
      id: "skills",
      title: "SKILLS_MATRIX.EXE",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      size: { width: Math.min(650, safeWidth * 0.9), height: 460 },
      position: getCenter(Math.min(650, safeWidth * 0.9), 460)
    },
    {
      id: "experience",
      title: "EXPERIENCE.LOG",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      size: { width: Math.min(740, safeWidth * 0.9), height: 500 },
      position: getCenter(Math.min(740, safeWidth * 0.9), 500)
    },
    {
      id: "cisco",
      title: "CISCO_SANDBOX.NET",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      size: { width: Math.min(840, safeWidth * 0.92), height: 480 },
      position: getCenter(Math.min(840, safeWidth * 0.92), 480)
    },
    {
      id: "certifications",
      title: "CERTIFICATIONS.SEC",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      size: { width: Math.min(700, safeWidth * 0.9), height: 450 },
      position: getCenter(Math.min(700, safeWidth * 0.9), 450)
    },
    {
      id: "education",
      title: "ACADEMIC.EDU",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      size: { width: Math.min(550, safeWidth * 0.85), height: 350 },
      position: getCenter(Math.min(550, safeWidth * 0.85), 350)
    },
    {
      id: "terminal",
      title: "AI_OPERATOR.CHAT",
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 5,
      size: { width: Math.min(600, safeWidth * 0.9), height: 460 },
      position: getCenter(Math.min(600, safeWidth * 0.9), 460)
    },
    {
      id: "references",
      title: "REFERENCES.DIR",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      size: { width: Math.min(600, safeWidth * 0.88), height: 400 },
      position: getCenter(Math.min(600, safeWidth * 0.88), 400)
    },
    {
      id: "contact",
      title: "CONTACT.TXT",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 2,
      size: { width: Math.min(580, safeWidth * 0.85), height: 440 },
      position: getCenter(Math.min(580, safeWidth * 0.85), 440)
    },
    {
      id: "explorer",
      title: "FILE_EXPLORER.EXE",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      size: { width: Math.min(680, safeWidth * 0.9), height: 460 },
      position: getCenter(Math.min(680, safeWidth * 0.9), 460)
    },
    {
      id: "settings",
      title: "CONTROL_PANEL.EXE",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      size: { width: Math.min(620, safeWidth * 0.88), height: 485 },
      position: getCenter(Math.min(620, safeWidth * 0.88), 485)
    },
    {
      id: "taskmgr",
      title: "TASK_MANAGER.EXE",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      size: { width: Math.min(650, safeWidth * 0.9), height: 440 },
      position: getCenter(Math.min(650, safeWidth * 0.9), 440)
    }
  ];
};

export default function App() {
  const [isBooted, setIsBooted] = useState(false);
  const [windows, setWindows] = useState<WindowConfig[]>(() => {
    const w = typeof window !== "undefined" && window.innerWidth > 400 ? window.innerWidth : 1200;
    const h = typeof window !== "undefined" && window.innerHeight > 300 ? window.innerHeight : 800;
    return INITIAL_WINDOWS(w, h);
  });
  const [maxZIndex, setMaxZIndex] = useState(15);
  const [currentTime, setCurrentTime] = useState("");
  const [cpuUsage, setCpuUsage] = useState(12);
  const [soundActive, setSoundActive] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  
  // Custom contact form local persistence state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactStatus, setContactStatus] = useState<"IDLE" | "SUCCESS" | "SENDING" | "ERROR">("IDLE");
  const [contactErrorMsg, setContactErrorMsg] = useState("");
  const [activationNeeded, setActivationNeeded] = useState(false);

  // CC-OS Operational States
  const [accentColor, setAccentColor] = useState<string>("cyan"); // options: cyan, green, amber, purple, rose
  const [wallpaperMode, setWallpaperMode] = useState<string>("network"); // options: network, starfield, minimal
  const [crtIntensity, setCrtIntensity] = useState<number>(6); // density factor (0-10)
  const [customGreeting, setCustomGreeting] = useState<string>("MIHJI_CHAKA.SYS");
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean } | null>(null);
  
  // Security Authentication states
  const [isLocked, setIsLocked] = useState(false);
  const [lockPassword, setLockPassword] = useState("");
  const [lockError, setLockError] = useState(false);

  // Desktop Sticky notes list
  const [stickyNotes, setStickyNotes] = useState<Array<{ id: string; x: number; y: number; text: string; color: string }>>([
    {
      id: "note_1",
      x: 350,
      y: 110,
      text: "OPERATOR_NOTES:\n-----------------\nSelect and configure secure routing rules in the 'CISCO_SANDBOX.NET' app.\nTry tracepathing custom OSPF routes live!\n\nDefault secure CCNP gate is 10.15.0.254.",
      color: "cyan"
    }
  ]);

  // Handle right-click for custom computer context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
      return;
    }
    // If the click is inside a window, start menu, header, or footer, do not show the desktop background tools context menu.
    if (target.closest(".dossier-window") || target.closest("#start-menu") || target.closest("footer") || target.closest("header")) {
      return;
    }
    e.preventDefault();
    playBeep(950, 0.04);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      visible: true
    });
  };

  // Close start menu and context menu when clicking outside
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#start-btn") && !target.closest("#start-menu")) {
        setIsStartMenuOpen(false);
      }
      setContextMenu(null);
    };
    window.addEventListener("click", handleGlobalClick);
    return () => {
      window.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  // Keyboard clicking sound feedback trigger
  const playBeep = (freq = 800, duration = 0.05) => {
    if (!soundActive) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context blocked.");
    }
  };

  useEffect(() => {
    // Generate initial window dimensions based on screen size
    setWindows(INITIAL_WINDOWS(window.innerWidth, window.innerHeight));

    // Dynamic ticking clock UTC parameter
    const intervalTime = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.getUTCFullYear() + "-" + 
                     String(now.getUTCMonth() + 1).padStart(2, '0') + "-" + 
                     String(now.getUTCDate()).padStart(2, '0') + " " + 
                     String(now.getUTCHours()).padStart(2, '0') + ":" + 
                     String(now.getUTCMinutes()).padStart(2, '0') + ":" + 
                     String(now.getUTCSeconds()).padStart(2, '0') + " UTC");
    }, 1000);

    // Fluctuating system load logic mapping
    const intervalCpu = setInterval(() => {
      setCpuUsage(Math.floor(8 + Math.random() * 22));
    }, 3000);

    return () => {
      clearInterval(intervalTime);
      clearInterval(intervalCpu);
    };
  }, []);

  const handleFocus = (id: WindowId, bypassCentering: boolean = false) => {
    playBeep(900, 0.03);
    const updatedZ = maxZIndex + 1;
    setMaxZIndex(updatedZ);
    setWindows((prev) =>
      prev.map((win) => {
        if (win.id === id) {
          const targetW = typeof win.size.width === "number" ? win.size.width : 600;
          const targetH = typeof win.size.height === "number" ? win.size.height : 450;
          const center = centerWindow(targetW, targetH);
          return {
            ...win,
            zIndex: updatedZ,
            isMinimized: false,
            // Centering the window on click/focus unless dragging bypass is active
            position: bypassCentering ? win.position : center
          };
        }
        return win;
      })
    );
  };

  const handleMinimize = (id: WindowId) => {
    playBeep(650, 0.06);
    setWindows((prev) =>
      prev.map((win) => (win.id === id ? { ...win, isMinimized: true } : win))
    );
  };

  const handleMaximize = (id: WindowId) => {
    playBeep(850, 0.05);
    setWindows((prev) =>
      prev.map((win) => (win.id === id ? { ...win, isMaximized: !win.isMaximized } : win))
    );
  };

  const handlePositionChange = (id: WindowId, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((win) => (win.id === id ? { ...win, position: { x, y } } : win))
    );
  };

  const handleOpenWindow = (id: WindowId) => {
    playBeep(1000, 0.05);
    const updatedZ = maxZIndex + 1;
    setMaxZIndex(updatedZ);
    setWindows((prev) =>
      prev.map((win) => {
        if (win.id === id) {
          const targetW = typeof win.size.width === "number" ? win.size.width : 600;
          const targetH = typeof win.size.height === "number" ? win.size.height : 450;
          const center = centerWindow(targetW, targetH);

          return {
            ...win,
            isOpen: true,
            isMinimized: false,
            zIndex: updatedZ,
            // Always center the window on pop up / open/ re-open to guarantee perfect viewport alignment!
            position: center
          };
        }
        return win;
      })
    );
  };

  const handleClose = (id: WindowId) => {
    playBeep(500, 0.08);
    setWindows((prev) =>
      prev.map((win) => (win.id === id ? { ...win, isOpen: false } : win))
    );
  };

  const resetWorkspace = () => {
    playBeep(1200, 0.12);
    setWindows(INITIAL_WINDOWS(window.innerWidth, window.innerHeight));
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText("mihjigeorgechaka@gmail.com");
    setCopiedEmail(true);
    playBeep(1400, 0.06);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const submitContactForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;
    setContactStatus("SENDING");
    setContactErrorMsg("");
    setActivationNeeded(false);
    playBeep(1100, 0.1);

    try {
      const subject = `Message from ${contactName} (via Mihji OS)`;
      const body = `Hi Mihji,\n\n${contactMsg}\n\n---\nSender Details:\nName: ${contactName}\nEmail: ${contactEmail}`;
      
      const mailtoUrl = `mailto:mihjigeorgechaka@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Trigger opening of mail client
      window.location.href = mailtoUrl;
      
      setContactStatus("SUCCESS");
      playBeep(1500, 0.2);
      
      setTimeout(() => {
        setContactStatus("IDLE");
      }, 10000);
    } catch (err: any) {
      console.error("[CRITICAL] Mail client trigger exception", err);
      setContactStatus("ERROR");
      setContactErrorMsg("Failed to launch your email client automatically. Please use the Copy Draft button below to send manually.");
      playBeep(450, 0.35);
    }
  };

  const copyDraftToClipboard = () => {
    if (!contactName || !contactEmail || !contactMsg) return;
    const blockText = `Hi Mihji,\n\n${contactMsg}\n\n---\nSender Details:\nName: ${contactName}\nEmail: ${contactEmail}`;
    navigator.clipboard.writeText(blockText);
    setCopiedDraft(true);
    playBeep(1400, 0.06);
    setTimeout(() => setCopiedDraft(false), 3000);
  };

  // Dynamic theme variables configurations
  const getThemeTextClass = () => {
    switch (accentColor) {
      case "green": return "text-[#10b981]";
      case "amber": return "text-[#f59e0b]";
      case "purple": return "text-[#d946ef]";
      case "rose": return "text-[#f43f5e]";
      default: return "text-[#00f3ff]";
    }
  };

  const getThemeHex = (): string => {
    switch (accentColor) {
      case "green": return "#10b981";
      case "amber": return "#f59e0b";
      case "purple": return "#d946ef";
      case "rose": return "#f43f5e";
      default: return "#00f3ff";
    }
  };

  const getThemeBorderClass = () => {
    switch (accentColor) {
      case "green": return "border-[#10b981]/25 hover:border-[#10b981]/60";
      case "amber": return "border-[#f59e0b]/25 hover:border-[#f59e0b]/60";
      case "purple": return "border-[#d946ef]/25 hover:border-[#d946ef]/60";
      case "rose": return "border-[#f43f5e]/25 hover:border-[#f43f5e]/60";
      default: return "border-cyan-500/20 hover:border-cyan-500/50";
    }
  };

  const getThemeGlowText = () => {
    switch (accentColor) {
      case "green": return "shadow-[0_0_12px_rgba(16,185,129,0.3)]";
      case "amber": return "shadow-[0_0_12px_rgba(245,158,11,0.3)]";
      case "purple": return "shadow-[0_0_12px_rgba(217,70,239,0.3)]";
      case "rose": return "shadow-[0_0_12px_rgba(244,63,94,0.3)]";
      default: return "shadow-[0_0_12px_rgba(0,243,255,0.35)]";
    }
  };

  const themeHexHex = getThemeHex();
  const themeTextCls = getThemeTextClass();
  const themeBorderStyle = getThemeBorderClass();
  const themeGlowStyle = getThemeGlowText();

  if (!isBooted) {
    return <SubsystemsBoot onBootComplete={() => {
      setSoundActive(true);
      setIsBooted(true);
    }} />;
  }

  return (
    <div className="min-h-screen bg-[#04070d] text-zinc-300 flex flex-col justify-between overflow-hidden relative select-none font-sans" style={{ cursor: "default" }}>
      
      {/* Dynamic Animated Cisco top grid matrix background */}
      <CanvasNetworkBg themeColor={themeHexHex} wallpaperMode={wallpaperMode} />

      {/* Decorative monitor CRT scan scan-lines effects */}
      <div 
        style={{ opacity: crtIntensity / 100 }}
        className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none z-50" 
      />

      {/* OS MAIN MENU STATUS TICKER HEADER BAR */}
      <header className="h-[46px] shrink-0 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md px-4 flex items-center justify-between z-40 relative select-none">
        
        {/* Left operator tag details */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 border-r border-zinc-850 pr-4">
            <span className="w-2.5 h-2.5 rounded-full animate-ping shrink-0" style={{ backgroundColor: themeHexHex }} />
            <span className={`font-mono text-xs font-black tracking-widest ${themeTextCls}`}>{customGreeting}</span>
          </div>

          <div className="hidden md:flex items-center space-x-3 text-[10px] font-mono text-zinc-400">
            <span className="flex items-center"><Layers className="w-3.5 h-3.5 mr-1" style={{ color: themeHexHex }} /> STACK: PHP/C# FULL-STACK</span>
            <span>CCNP ID: CS-2023</span>
          </div>
        </div>

        {/* Right system environment variables status blocks */}
        <div className="flex items-center space-x-4 font-mono text-[10px] text-zinc-400">
          
          {/* Realtime ticking clock parameter */}
          <div className="hidden sm:flex items-center space-x-1 bg-zinc-950/80 border border-zinc-800 px-2 py-0.5 rounded text-[9px]">
            <Clock className="w-3.5 h-3.5" style={{ color: themeHexHex }} />
            <span>{currentTime || "SYS_CLOCKING..."}</span>
          </div>

          {/* Simulated CPU workloads */}
          <div className="flex items-center space-x-1.5 bg-zinc-950/80 border border-zinc-800 px-2.5 py-0.5 rounded text-[9px]">
            <Cpu className="w-3.5 h-3.5 animate-pulse shrink-0" style={{ color: themeHexHex }} />
            <span>CPU: <span className="font-bold" style={{ color: themeHexHex }}>{cpuUsage}%</span></span>
          </div>

          {/* Sound switch block feedback toggle */}
          <button
            onClick={() => {
              setSoundActive(!soundActive);
              if (!soundActive) {
                // play immediate test note
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                osc.connect(audioCtx.destination);
                osc.frequency.value = 1000;
                osc.start();
                osc.stop(audioCtx.currentTime + 0.08);
              }
            }}
            className="p-1.5 rounded border transition cursor-pointer select-none bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-cyan-400 hover:text-cyan-400"
            title={soundActive ? "Mute audio diagnostics" : "Enable audio feedback"}
          >
            {soundActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-600" />}
          </button>

          {/* Workspace reset action block */}
          <button
            onClick={resetWorkspace}
            className="p-1.5 rounded border transition cursor-pointer select-none bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-cyan-950 hover:text-cyan-400 hover:border-cyan-500/30"
            title="Reload window positions"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

      </header>

      {/* CORE DESKTOP GRID WORKSPACE LAYOUT CONTAINER */}
      <main 
        onContextMenu={handleContextMenu}
        className="flex-1 relative overflow-hidden p-6 md:p-8 select-none"
      >
        
        {/* Launcher Shortcuts grid - dynamic wrapping columns like a real desktop */}
        <div className="absolute top-4 left-4 bottom-4 flex flex-col flex-wrap content-start gap-3.5 font-mono z-10 select-none">
          
          {[
            { id: "about" as const, name: "ABOUT_ME.SYS", icon: User, color: "text-cyan-400" },
            { id: "skills" as const, name: "SKILLS.EXE", icon: Cpu, color: "text-blue-405" },
            { id: "experience" as const, name: "EXPERIENCE.LOG", icon: Layers, color: "text-indigo-400" },
            { id: "cisco" as const, name: "CISCO_TOP.NET", icon: Settings, color: "text-emerald-400" },
            { id: "certifications" as const, name: "CERTS.SEC", icon: Award, color: "text-amber-400" },
            { id: "education" as const, name: "ACADEMIC.EDU", icon: GraduationCap, color: "text-violet-400" },
            { id: "terminal" as const, name: "AI_CONSOLE.SH", icon: TermIcon, color: "text-cyan-300" },
            { id: "explorer" as const, name: "FILE_EXPLORER.EXE", icon: FolderOpen, color: "text-amber-500" },
            { id: "settings" as const, name: "CONTROL_PANEL.EXE", icon: Settings, color: "text-teal-400" },
            { id: "taskmgr" as const, name: "TASK_MANAGER.EXE", icon: Cpu, color: "text-red-400" },
            { id: "references" as const, name: "REFERENCES.DIR", icon: UserCheck, color: "text-rose-400" },
            { id: "contact" as const, name: "CONTACT.TXT", icon: Phone, color: "text-teal-400" }
          ].map((launcher) => {
            const isOpen = windows.find((win) => win.id === launcher.id)?.isOpen;
            const LauncherIcon = launcher.icon;

            return (
              <button
                key={launcher.id}
                onClick={() => handleOpenWindow(launcher.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border bg-slate-950/80 border-slate-900/60 hover:border-cyan-400/50 hover:bg-slate-900/60 transition group cursor-pointer text-center w-[75px] h-[75px] shrink-0 outline-none`}
              >
                <div className="relative">
                  <LauncherIcon className={`w-6 h-6 ${launcher.color} group-hover:scale-110 transition-transform`} />
                  {isOpen && (
                    <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 border border-black animate-pulse" />
                  )}
                </div>
                <span className="text-[8px] tracking-wider text-zinc-400 group-hover:text-cyan-300 font-bold truncate w-full mt-1">
                  {launcher.name}
                </span>
              </button>
            );
          })}

        </div>

        {/* Dynamic Draggable Overlapping Window Components Canvas */}
        <div className="absolute inset-0 z-20 pointer-events-none select-none">
          <div className="w-full h-full relative pointer-events-none">
            
            {/* 1. Dossier Window - ABOUT ME */}
            <DossierWindow
              id="about"
              title="ABOUT_ME.SYS"
              isOpen={windows.find((w) => w.id === "about")?.isOpen || false}
              isMinimized={windows.find((w) => w.id === "about")?.isMinimized || false}
              isMaximized={windows.find((w) => w.id === "about")?.isMaximized || false}
              zIndex={windows.find((w) => w.id === "about")?.zIndex || 1}
              initialX={windows.find((w) => w.id === "about")?.position.x || 30}
              initialY={windows.find((w) => w.id === "about")?.position.y || 85}
              width={windows.find((w) => w.id === "about")?.size.width || 680}
              height={windows.find((w) => w.id === "about")?.size.height || 480}
              onFocus={() => handleFocus("about")}
              onMinimize={() => handleMinimize("about")}
              onMaximize={() => handleMaximize("about")}
              onClose={() => handleClose("about")}
              onPositionChange={(x, y) => handlePositionChange("about", x, y)}
            >
              <div className="space-y-6 font-mono select-text leading-relaxed">
                <div className="flex flex-col md:flex-row items-center gap-6 border-b border-cyan-500/10 pb-5">
                  
                  {/* Digital profile wireframe box representation */}
                  <div className="w-32 h-32 rounded border border-cyan-500/30 bg-slate-900 flex items-center justify-center relative shadow-lg overflow-hidden shrink-0 group">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/30 to-transparent animate-pulse" />
                    <User className="w-16 h-16 text-cyan-400 group-hover:scale-110 transition" />
                    <div className="absolute bottom-1 right-2 text-[6px] tracking-widest text-cyan-600">SUBJECT-01</div>
                  </div>

                  <div>
                    <h2 className="text-lg md:text-xl font-black text-cyan-400 uppercase tracking-widest">
                      Mihji George Chaka
                    </h2>
                    <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-widest">
                      Multipotentialite engineer &amp; sysadmin core
                    </p>
                    <p className="text-xs text-zinc-300 mt-3 leading-relaxed font-sans select-text">
                      Highly skilled in marrying complex full-stack codebase networks with enterprise level Cisco security infrastructures. Equipped with multiple specialized credentials auditing database synchronizations, financial re-alignments, warehouse supply chain metrics, and support ticket flow escalations.
                    </p>
                  </div>
                </div>

                {/* Sub-block summaries */}
                <div className="space-y-4 font-sans text-xs">
                  <h3 className="font-mono text-[11px] font-bold tracking-widest text-[#00f3ff] uppercase mb-1 flex items-center gap-1.5 border-b border-zinc-800 pb-1">
                    <ChevronRight className="w-3.5 h-3.5" /> Operations Frameworks
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-zinc-900/50 rounded border border-zinc-900/80">
                      <h4 className="font-mono text-[#00f3ff]/90 text-[10px] font-bold uppercase mb-1.5">Enterprise Infrastructure</h4>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">Experienced in deploying Cisco Routing &amp; Switching protocols, Cisco ASA Firewall settings, and setting up centralized Wireless Controllers (WLCs) in distributed field areas.</p>
                    </div>

                    <div className="p-3.5 bg-zinc-900/50 rounded border border-zinc-900/80">
                      <h4 className="font-mono text-[#00f3ff]/90 text-[10px] font-bold uppercase mb-1.5">Full-Stack API Code Base</h4>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">Developing robust backend software layers in PHP (Laravel) and C# .NET Core, designing databases (PostgreSQL, MongoDB), and managing containers with Docker.</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-cyan-950/20 rounded border border-cyan-500/20 font-mono text-[9px] text-[#00f3ff] leading-relaxed select-none">
                  [TELEMETRY CONFIG CORE]: Gateways configured at kalongwezi, chipata, zambia. Operating hours synchronized to UTC+2.
                </div>
              </div>
            </DossierWindow>

            {/* 2. Dossier Window - SKILLS MATRIX */}
            <DossierWindow
              id="skills"
              title="SKILLS_MATRIX.EXE"
              isOpen={windows.find((w) => w.id === "skills")?.isOpen || false}
              isMinimized={windows.find((w) => w.id === "skills")?.isMinimized || false}
              isMaximized={windows.find((w) => w.id === "skills")?.isMaximized || false}
              zIndex={windows.find((w) => w.id === "skills")?.zIndex || 1}
              initialX={windows.find((w) => w.id === "skills")?.position.x || 50}
              initialY={windows.find((w) => w.id === "skills")?.position.y || 105}
              width={windows.find((w) => w.id === "skills")?.size.width || 650}
              height={windows.find((w) => w.id === "skills")?.size.height || 460}
              onFocus={() => handleFocus("skills")}
              onMinimize={() => handleMinimize("skills")}
              onMaximize={() => handleMaximize("skills")}
              onClose={() => handleClose("skills")}
              onPositionChange={(x, y) => handlePositionChange("skills", x, y)}
            >
              <div className="space-y-6 select-text">
                <p className="text-xs text-zinc-400 font-mono italic mb-4">
                  * Hardware-integrated compilers and technical operating stacks:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {skillCategories.map((cat, idx) => (
                    <div key={idx} className="p-4 bg-zinc-950/90 border border-cyan-500/10 rounded-md">
                      <h3 className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-widest border-b border-zinc-800 pb-2 mb-3.5 flex items-center justify-between">
                        <span>{cat.title}</span>
                        <span className="text-[8px] text-zinc-600">MOD_{10 + idx}</span>
                      </h3>
                      
                      <div className="space-y-3 font-sans text-xs">
                        {cat.skills.map((skill, sIdx) => {
                          const level = 70 + (sIdx % 3) * 10 - (idx % 2) * 5; // pseudo animated scale loading metrics
                          return (
                            <div key={sIdx} className="space-y-1">
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-zinc-300 font-mono">{skill}</span>
                                <span className="text-[10px] font-mono text-cyan-500/80">{level}%</span>
                              </div>
                              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                                <div
                                  style={{ width: `${level}%` }}
                                  className="bg-cyan-500 h-full rounded-full opacity-80"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DossierWindow>

            {/* 3. Dossier Window - CHRONOS EXPERIENCE LEDGER */}
            <DossierWindow
              id="experience"
              title="EXPERIENCE.LOG"
              isOpen={windows.find((w) => w.id === "experience")?.isOpen || false}
              isMinimized={windows.find((w) => w.id === "experience")?.isMinimized || false}
              isMaximized={windows.find((w) => w.id === "experience")?.isMaximized || false}
              zIndex={windows.find((w) => w.id === "experience")?.zIndex || 1}
              initialX={windows.find((w) => w.id === "experience")?.position.x || 80}
              initialY={windows.find((w) => w.id === "experience")?.position.y || 120}
              width={windows.find((w) => w.id === "experience")?.size.width || 740}
              height={windows.find((w) => w.id === "experience")?.size.height || 500}
              onFocus={() => handleFocus("experience")}
              onMinimize={() => handleMinimize("experience")}
              onMaximize={() => handleMaximize("experience")}
              onClose={() => handleClose("experience")}
              onPositionChange={(x, y) => handlePositionChange("experience", x, y)}
            >
              <div className="space-y-6 select-text">
                <div className="border-l-2 border-cyan-500/30 pl-4 md:pl-6 space-y-8 py-2">
                  {experienceData.map((item, idx) => (
                    <div key={idx} className="relative select-text">
                      
                      {/* Timeline node beacon */}
                      <span className="absolute -left-[25px] md:-left-[33px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      </span>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
                        <div>
                          <h3 className="font-mono text-[13px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                            {item.role}
                          </h3>
                          <p className="font-mono text-[10px] text-zinc-400 uppercase">
                            {item.company} &bull; <span className="text-zinc-500">{item.location}</span>
                          </p>
                        </div>
                        <div className="font-mono text-[10px] text-cyan-500 bg-cyan-950/25 border border-cyan-500/20 px-2.5 py-0.5 rounded shrink-0 self-start sm:self-center">
                          {item.period}
                        </div>
                      </div>

                      <ul className="space-y-2 text-xs font-sans text-zinc-300">
                        {item.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-cyan-500 font-mono mt-1 shrink-0 select-none">&bull;</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3.5 inline-flex items-center gap-1.5 font-mono text-[10px] text-blue-400 hover:text-blue-300"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>VISIT SECURITY SITE PORTAL</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </DossierWindow>

            {/* 4. Dossier Window - CISCO EXPERIMENTAL TOPOLOGY SANDBOX */}
            <DossierWindow
              id="cisco"
              title="CISCO_SANDBOX.NET"
              isOpen={windows.find((w) => w.id === "cisco")?.isOpen || false}
              isMinimized={windows.find((w) => w.id === "cisco")?.isMinimized || false}
              isMaximized={windows.find((w) => w.id === "cisco")?.isMaximized || false}
              zIndex={windows.find((w) => w.id === "cisco")?.zIndex || 1}
              initialX={windows.find((w) => w.id === "cisco")?.position.x || 100}
              initialY={windows.find((w) => w.id === "cisco")?.position.y || 95}
              width={windows.find((w) => w.id === "cisco")?.size.width || 840}
              height={windows.find((w) => w.id === "cisco")?.size.height || 480}
              onFocus={() => handleFocus("cisco")}
              onMinimize={() => handleMinimize("cisco")}
              onMaximize={() => handleMaximize("cisco")}
              onClose={() => handleClose("cisco")}
              onPositionChange={(x, y) => handlePositionChange("cisco", x, y)}
            >
              <div className="space-y-4 select-text">
                <CiscoSandbox />
              </div>
            </DossierWindow>

            {/* 5. Dossier Window - CERTIFICATIONS MODULE */}
            <DossierWindow
              id="certifications"
              title="CERTIFICATIONS.SEC"
              isOpen={windows.find((w) => w.id === "certifications")?.isOpen || false}
              isMinimized={windows.find((w) => w.id === "certifications")?.isMinimized || false}
              isMaximized={windows.find((w) => w.id === "certifications")?.isMaximized || false}
              zIndex={windows.find((w) => w.id === "certifications")?.zIndex || 1}
              initialX={windows.find((w) => w.id === "certifications")?.position.x || 60}
              initialY={windows.find((w) => w.id === "certifications")?.position.y || 140}
              width={windows.find((w) => w.id === "certifications")?.size.width || 700}
              height={windows.find((w) => w.id === "certifications")?.size.height || 450}
              onFocus={() => handleFocus("certifications")}
              onMinimize={() => handleMinimize("certifications")}
              onMaximize={() => handleMaximize("certifications")}
              onClose={() => handleClose("certifications")}
              onPositionChange={(x, y) => handlePositionChange("certifications", x, y)}
            >
              <div className="space-y-5 select-text">
                <p className="text-xs text-zinc-400 font-mono italic mb-3">
                  * Decrypted career-level authentication credentials stored securely:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {certificationsData.map((cert, idx) => (
                    <div key={idx} className="p-4 bg-zinc-950/95 border border-cyan-500/10 rounded overflow-hidden flex flex-col justify-between hover:border-cyan-400/40 transition">
                      
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h4 className="font-mono text-xs font-bold text-cyan-300 leading-snug">
                            {cert.title}
                          </h4>
                          <span className="font-mono text-[9px] text-cyan-500 bg-cyan-950/30 px-2 py-0.5 rounded leading-none shrink-0 self-start">
                            {cert.year}
                          </span>
                        </div>
                        <p className="font-mono text-[9px] text-zinc-500 uppercase mb-3 leading-none">
                          ISSUER: {cert.issuer}
                        </p>
                        
                        <p className="text-zinc-400 text-xs leading-relaxed font-sans select-text">
                          {cert.bullets[0]}
                        </p>
                      </div>

                      {cert.link && (
                        <div className="mt-4 pt-3 border-t border-zinc-900">
                          <a
                            href={cert.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[9px] text-blue-400 hover:text-blue-300"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>VERIFY SECURE PROOF</span>
                          </a>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              </div>
            </DossierWindow>

            {/* 6. Dossier Window - ACADEMIC EDUCATION */}
            <DossierWindow
              id="education"
              title="ACADEMIC.EDU"
              isOpen={windows.find((w) => w.id === "education")?.isOpen || false}
              isMinimized={windows.find((w) => w.id === "education")?.isMinimized || false}
              isMaximized={windows.find((w) => w.id === "education")?.isMaximized || false}
              zIndex={windows.find((w) => w.id === "education")?.zIndex || 1}
              initialX={windows.find((w) => w.id === "education")?.position.x || 120}
              initialY={windows.find((w) => w.id === "education")?.position.y || 160}
              width={windows.find((w) => w.id === "education")?.size.width || 550}
              height={windows.find((w) => w.id === "education")?.size.height || 350}
              onFocus={() => handleFocus("education")}
              onMinimize={() => handleMinimize("education")}
              onMaximize={() => handleMaximize("education")}
              onClose={() => handleClose("education")}
              onPositionChange={(x, y) => handlePositionChange("education", x, y)}
            >
              <div className="space-y-4 select-text">
                {educationData.map((edu, idx) => (
                  <div key={idx} className="p-4 bg-zinc-950/70 border border-zinc-900 rounded select-text">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <h4 className="font-mono text-xs font-bold text-cyan-300">
                        {edu.school}
                      </h4>
                      <span className="font-mono text-[10px] text-zinc-500 leading-none">
                        {edu.period}
                      </span>
                    </div>

                    <p className="font-mono text-[10px] text-zinc-400 uppercase mb-3.5 leading-none">
                      DEGREE: {edu.degree} &bull; <span className="text-zinc-600">{edu.location}</span>
                    </p>

                    <ul className="space-y-2 text-xs font-sans text-zinc-300">
                      {edu.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {edu.link && (
                      <div className="mt-4 pt-3.5 border-t border-zinc-900">
                        <a
                          href={edu.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[9px] text-blue-400 hover:text-blue-300"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>UNIVERSITY PORTAL INFORMATION</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </DossierWindow>

            {/* 7. Dossier Window - CHAKA INTEL MAIN COGNITIVE TERMINAL */}
            <DossierWindow
              id="terminal"
              title="AI_OPERATOR.CHAT"
              isOpen={windows.find((w) => w.id === "terminal")?.isOpen || false}
              isMinimized={windows.find((w) => w.id === "terminal")?.isMinimized || false}
              isMaximized={windows.find((w) => w.id === "terminal")?.isMaximized || false}
              zIndex={windows.find((w) => w.id === "terminal")?.zIndex || 1}
              initialX={windows.find((w) => w.id === "terminal")?.position.x || 160}
              initialY={windows.find((w) => w.id === "terminal")?.position.y || 110}
              width={windows.find((w) => w.id === "terminal")?.size.width || 600}
              height={windows.find((w) => w.id === "terminal")?.size.height || 460}
              onFocus={() => handleFocus("terminal")}
              onMinimize={() => handleMinimize("terminal")}
              onMaximize={() => handleMaximize("terminal")}
              onClose={() => handleClose("terminal")}
              onPositionChange={(x, y) => handlePositionChange("terminal", x, y)}
            >
              <div className="w-full h-full min-h-[380px] select-text">
                <AIPortfolioTerminal />
              </div>
            </DossierWindow>

            {/* 8. Dossier Window - REFERENCES */}
            <DossierWindow
              id="references"
              title="REFERENCES.DIR"
              isOpen={windows.find((w) => w.id === "references")?.isOpen || false}
              isMinimized={windows.find((w) => w.id === "references")?.isMinimized || false}
              isMaximized={windows.find((w) => w.id === "references")?.isMaximized || false}
              zIndex={windows.find((w) => w.id === "references")?.zIndex || 1}
              initialX={windows.find((w) => w.id === "references")?.position.x || 140}
              initialY={windows.find((w) => w.id === "references")?.position.y || 150}
              width={windows.find((w) => w.id === "references")?.size.width || 600}
              height={windows.find((w) => w.id === "references")?.size.height || 400}
              onFocus={() => handleFocus("references")}
              onMinimize={() => handleMinimize("references")}
              onMaximize={() => handleMaximize("references")}
              onClose={() => handleClose("references")}
              onPositionChange={(x, y) => handlePositionChange("references", x, y)}
            >
              <div className="space-y-4 select-text">
                <p className="text-xs text-zinc-400 font-mono italic mb-3">
                  * Core professional contacts retrieved from local enterprise caches:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 select-text">
                  {referencesData.map((refItem, idx) => (
                    <div key={idx} className="p-4 bg-zinc-950/90 border border-zinc-900 rounded font-mono text-[10px] leading-relaxed relative overflow-hidden flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 border-b border-zinc-805/40 pb-1.5 mb-2.5">
                          <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                          <h4 className="text-[11px] font-bold text-cyan-300 leading-none uppercase">{refItem.name}</h4>
                        </div>
                        <p className="text-zinc-400 uppercase font-black text-[9px] leading-none mb-1">
                          Role: {refItem.title}
                        </p>
                        <p className="text-zinc-500 uppercase font-black text-[9px] leading-none mb-3">
                          Entity: {refItem.company}
                        </p>
                        
                        <div className="space-y-1 font-sans text-xs text-zinc-400 select-text">
                          <p>Tel: <span className="font-mono text-cyan-400 text-[10px] select-text">{refItem.phone}</span></p>
                          {refItem.email && <p className="truncate">Email: <span className="font-mono text-cyan-400 text-[10.5px] select-text">{refItem.email}</span></p>}
                        </div>
                      </div>

                      <div className="absolute right-2 bottom-1 text-[7px] text-zinc-800 font-bold select-none uppercase tracking-widest">
                        REF_N{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DossierWindow>

            {/* 9. Dossier Window - CONTACT SYSTEM */}
            <DossierWindow
              id="contact"
              title="CONTACT.TXT"
              isOpen={windows.find((w) => w.id === "contact")?.isOpen || false}
              isMinimized={windows.find((w) => w.id === "contact")?.isMinimized || false}
              isMaximized={windows.find((w) => w.id === "contact")?.isMaximized || false}
              zIndex={windows.find((w) => w.id === "contact")?.zIndex || 1}
              initialX={windows.find((w) => w.id === "contact")?.position.x || 40}
              initialY={windows.find((w) => w.id === "contact")?.position.y || 180}
              width={windows.find((w) => w.id === "contact")?.size.width || 580}
              height={windows.find((w) => w.id === "contact")?.size.height || 440}
              onFocus={() => handleFocus("contact")}
              onMinimize={() => handleMinimize("contact")}
              onMaximize={() => handleMaximize("contact")}
              onClose={() => handleClose("contact")}
              onPositionChange={(x, y) => handlePositionChange("contact", x, y)}
            >
              <div className="space-y-6 select-text leading-relaxed">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-b border-zinc-900 pb-5">
                  <div>
                    <h3 className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-widest mb-3 pb-1 border-b border-zinc-800">
                      DIRECT CHANNELS
                    </h3>
                    
                    <div className="space-y-4 font-mono text-[10px] leading-relaxed text-zinc-400 select-text">
                      <div>
                        <span className="text-zinc-500 uppercase block text-[8px]">PRIMARY EMAIL DIRECTORY:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-cyan-400 font-bold text-xs select-text">mihjigeorgechaka@gmail.com</span>
                          <button
                            onClick={copyEmailToClipboard}
                            className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 active:bg-zinc-800 text-[8px] cursor-pointer text-zinc-300 hover:border-cyan-400"
                          >
                            {copiedEmail ? "COPIED" : "COPY"}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-zinc-500 uppercase block text-[8px]">COMMUNICATIONS TERMINALS:</span>
                        <p className="text-cyan-400 mt-1 select-text">
                          Line 1: <span className="font-bold text-xs select-text">+260977572626</span>
                        </p>
                        <p className="text-cyan-400 mt-0.5 select-text">
                          Line 2: <span className="font-bold text-xs select-text">+260766845885</span>
                        </p>
                      </div>

                      <div>
                        <span className="text-zinc-500 uppercase block text-[8px]">DIGITAL WEB PRESENCE:</span>
                        <a
                          href="https://mihjichaka.netlify.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00f3ff] hover:text-[#00f3ff]/80 font-bold block mt-1"
                        >
                          mihjichaka.netlify.app/
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Form Submission block */}
                  <div>
                    <h3 className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-widest mb-3 pb-1 border-b border-zinc-800">
                      COMPOSE EMAIL DRAFT
                    </h3>

                    <form onSubmit={submitContactForm} className="space-y-3 font-mono text-[10px]">
                      <div>
                        <label className="text-zinc-500 block text-[8px] mb-1">OPERATOR SIGNATURE (NAME):</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full bg-slate-900 text-xs text-zinc-200 border border-zinc-800 focus:outline-none focus:border-cyan-500 rounded p-1.5 focus:bg-slate-950 font-sans"
                        />
                      </div>

                      <div>
                        <label className="text-zinc-500 block text-[8px] mb-1">EMAIL CHANNELS:</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full bg-slate-900 text-xs text-zinc-200 border border-zinc-800 focus:outline-none focus:border-cyan-500 rounded p-1.5 focus:bg-slate-950 font-sans"
                        />
                      </div>

                      <div>
                        <label className="text-zinc-500 block text-[8px] mb-1">DATA PAYLOAD (MESSAGE):</label>
                        <textarea
                          required
                          rows={3}
                          value={contactMsg}
                          onChange={(e) => setContactMsg(e.target.value)}
                          className="w-full bg-slate-900 text-xs text-zinc-200 border border-zinc-800 focus:outline-none focus:border-cyan-500 rounded p-1.5 focus:bg-slate-950 font-sans leading-relaxed resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 pt-1.5">
                        <button
                          type="submit"
                          className="w-full py-2 bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-bold rounded cursor-pointer hover:bg-cyan-900 hover:text-cyan-200 hover:border-cyan-400 transition text-[9px] tracking-widest flex items-center justify-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>LAUNCH EMAIL CLIENT</span>
                        </button>

                        <button
                          type="button"
                          onClick={copyDraftToClipboard}
                          disabled={!contactName || !contactEmail || !contactMsg}
                          className="w-full py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold rounded cursor-pointer hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition text-[9px] tracking-widest flex items-center justify-center gap-1.5 hover:border-cyan-400/40"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedDraft ? "DRAFT PAYLOAD COPIED!" : "COPY MESSAGE DRAFT"}</span>
                        </button>
                      </div>

                      {contactStatus === "SUCCESS" && (
                        <div className="border border-cyan-500/40 bg-slate-950/80 p-2.5 rounded text-[8.5px] uppercase tracking-normal leading-relaxed text-cyan-200 animate-fade-in text-left">
                          <div className="font-bold text-cyan-400 mb-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>[CLIENT OUTBOX INITIATED]</span>
                          </div>
                          <p className="mb-1 text-zinc-300 font-sans tracking-tight leading-normal text-[8.5px]">
                            Opened your default mail app prefilled with details. If no client launched automatically, please use the <strong className="text-cyan-400">Copy Message Draft</strong> button and send to <strong className="text-cyan-400">mihjigeorgechaka@gmail.com</strong>.
                          </p>
                        </div>
                      )}

                      {contactStatus === "ERROR" && (
                        <p className="text-rose-400 border border-rose-950/40 bg-rose-950/20 p-2 rounded text-[8.5px] uppercase tracking-normal font-bold leading-relaxed whitespace-pre-wrap animate-fade-in text-left">
                          [CRITICAL ERROR]: {contactErrorMsg || "Failed to initiate client stream. Please copy draft manually."}
                        </p>
                      )}
                    </form>
                  </div>
                </div>

                <div className="font-mono text-[9px] text-zinc-500 uppercase leading-snug">
                  * Located physically: Kalongwezi district, Chipata, Eastern Province, Zambia. Host gateway reachable over mobile cellular or high frequency wireless grids.
                </div>

              </div>
            </DossierWindow>

            {/* 10. Dossier Window - FILE EXPLORER */}
            <DossierWindow
              id="explorer"
              title="FILE_EXPLORER.EXE"
              isOpen={windows.find((w) => w.id === "explorer")?.isOpen || false}
              isMinimized={windows.find((w) => w.id === "explorer")?.isMinimized || false}
              isMaximized={windows.find((w) => w.id === "explorer")?.isMaximized || false}
              zIndex={windows.find((w) => w.id === "explorer")?.zIndex || 1}
              initialX={windows.find((w) => w.id === "explorer")?.position.x || 120}
              initialY={windows.find((w) => w.id === "explorer")?.position.y || 135}
              width={windows.find((w) => w.id === "explorer")?.size.width || 680}
              height={windows.find((w) => w.id === "explorer")?.size.height || 460}
              onFocus={() => handleFocus("explorer")}
              onMinimize={() => handleMinimize("explorer")}
              onMaximize={() => handleMaximize("explorer")}
              onClose={() => handleClose("explorer")}
              onPositionChange={(x, y) => handlePositionChange("explorer", x, y)}
            >
              <FileExplorer playBeep={playBeep} />
            </DossierWindow>

            {/* 11. Dossier Window - SETTINGS / CONTROL PANEL */}
            <DossierWindow
              id="settings"
              title="CONTROL_PANEL.EXE"
              isOpen={windows.find((w) => w.id === "settings")?.isOpen || false}
              isMinimized={windows.find((w) => w.id === "settings")?.isMinimized || false}
              isMaximized={windows.find((w) => w.id === "settings")?.isMaximized || false}
              zIndex={windows.find((w) => w.id === "settings")?.zIndex || 1}
              initialX={windows.find((w) => w.id === "settings")?.position.x || 140}
              initialY={windows.find((w) => w.id === "settings")?.position.y || 155}
              width={windows.find((w) => w.id === "settings")?.size.width || 620}
              height={windows.find((w) => w.id === "settings")?.size.height || 485}
              onFocus={() => handleFocus("settings")}
              onMinimize={() => handleMinimize("settings")}
              onMaximize={() => handleMaximize("settings")}
              onClose={() => handleClose("settings")}
              onPositionChange={(x, y) => handlePositionChange("settings", x, y)}
            >
              <SettingsApp
                accentColor={accentColor}
                setAccentColor={setAccentColor}
                wallpaperMode={wallpaperMode}
                setWallpaperMode={setWallpaperMode}
                soundActive={soundActive}
                setSoundActive={setSoundActive}
                crtIntensity={crtIntensity}
                setCrtIntensity={setCrtIntensity}
                customGreeting={customGreeting}
                setCustomGreeting={setCustomGreeting}
                playBeep={playBeep}
              />
            </DossierWindow>

            {/* 12. Dossier Window - TASK MANAGER */}
            <DossierWindow
              id="taskmgr"
              title="TASK_MANAGER.EXE"
              isOpen={windows.find((w) => w.id === "taskmgr")?.isOpen || false}
              isMinimized={windows.find((w) => w.id === "taskmgr")?.isMinimized || false}
              isMaximized={windows.find((w) => w.id === "taskmgr")?.isMaximized || false}
              zIndex={windows.find((w) => w.id === "taskmgr")?.zIndex || 1}
              initialX={windows.find((w) => w.id === "taskmgr")?.position.x || 160}
              initialY={windows.find((w) => w.id === "taskmgr")?.position.y || 170}
              width={windows.find((w) => w.id === "taskmgr")?.size.width || 650}
              height={windows.find((w) => w.id === "taskmgr")?.size.height || 440}
              onFocus={() => handleFocus("taskmgr")}
              onMinimize={() => handleMinimize("taskmgr")}
              onMaximize={() => handleMaximize("taskmgr")}
              onClose={() => handleClose("taskmgr")}
              onPositionChange={(x, y) => handlePositionChange("taskmgr", x, y)}
            >
              <TaskManager
                windows={windows}
                onCloseWindow={handleClose}
                playBeep={playBeep}
              />
            </DossierWindow>

          </div>
        </div>

        {/* Desktop Sticky Notes rendering widget container */}
        {stickyNotes.map((note) => (
          <div
            key={note.id}
            className="absolute p-4 rounded border w-64 bg-orange-950/85 text-orange-200 border-orange-500/30 shadow-xl backdrop-blur-md z-10 select-text font-mono text-[11px] leading-relaxed group shadow-orange-950/50"
            style={{ left: `${note.x}px`, top: `${note.y}px` }}
          >
            <div className="flex items-center justify-between border-b border-orange-500/20 pb-1.5 mb-1.5 select-none cursor-default">
              <span className="text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 text-orange-400">
                <StickyNote className="w-3.5 h-3.5 animate-pulse" />
                <span>STICKY_PAD.LOG</span>
              </span>
              <button
                onClick={() => {
                  setStickyNotes((prev) => prev.filter((n) => n.id !== note.id));
                  playBeep(450, 0.05);
                }}
                className="p-0.5 rounded hover:bg-orange-950 text-orange-450 transition cursor-pointer"
                title="Dismiss Note"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <textarea
              value={note.text}
              onChange={(e) => {
                const text = e.target.value;
                setStickyNotes((prev) => prev.map((n) => n.id === note.id ? { ...n, text } : n));
              }}
              className="w-full bg-transparent border-none text-zinc-100 outline-none text-[10px] font-sans resize-none leading-normal h-[100px] overflow-y-auto scrollbar-thin"
            />
            <div className="text-[7.5px] text-zinc-500 block pt-1 bg-transparent select-none uppercase tracking-wide">
              * Active buffer zone. Text changes are saved live.
            </div>
          </div>
        ))}

        {/* INTERACTIVE start menu panel overlay */}
        {isStartMenuOpen && (
          <div 
            id="start-menu"
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-[60px] left-[24px] w-[450px] max-w-[calc(100vw-48px)] bg-slate-950/95 backdrop-blur-xl border rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden font-mono text-xs select-none animate-fade-in"
            style={{ 
              borderColor: themeHexHex + "60",
              boxShadow: `0 10px 40px rgba(0,0,0,0.85), 0 0 25px ${themeHexHex}15`
            }}
          >
            {/* USER PROFILE HEADER */}
            <div className="p-4 bg-slate-900 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded border border-cyan-500/30 bg-slate-100/5 flex items-center justify-center overflow-hidden shrink-0 relative">
                  <span className="w-2 h-2 rounded-full absolute top-1 right-1 animate-pulse" style={{ backgroundColor: themeHexHex }} />
                  <User className="w-5 h-5 animate-pulse" style={{ color: themeHexHex }} />
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-widest text-zinc-100">Operator Mihji</div>
                  <div className="text-[8.5px] text-zinc-500 uppercase tracking-wider font-semibold">Full Stack Developer | Systems Architect</div>
                </div>
              </div>
              <span className="text-[8px] bg-slate-950 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-bold tracking-widest">
                SYS::ADMIN
              </span>
            </div>

            {/* APPLICATION DIRECTORY AND CONTROLS */}
            <div className="flex flex-col sm:flex-row h-[320px] divide-y sm:divide-y-0 sm:divide-x divide-zinc-900 bg-slate-950">
              
              {/* LEFT SECTION: APP LIST */}
              <div className="flex-1 p-3.5 flex flex-col space-y-3.5 overflow-y-auto scrollbar-thin">
                
                {/* 1. Hardware admin */}
                <div className="space-y-1">
                  <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest block pb-0.5 border-b border-zinc-900/40">System Administration</span>
                  <div className="grid grid-cols-1 gap-1">
                    <button
                      onClick={() => { handleOpenWindow("explorer"); setIsStartMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-1 rounded hover:bg-zinc-900/60 text-left cursor-pointer group"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition shrink-0" />
                      <span className="text-[10px] font-bold text-zinc-350 group-hover:text-cyan-300">FILE_EXPLORER.EXE</span>
                    </button>
                    <button
                      onClick={() => { handleOpenWindow("settings"); setIsStartMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-1 rounded hover:bg-zinc-900/60 text-left cursor-pointer group"
                    >
                      <Settings className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition shrink-0" />
                      <span className="text-[10px] font-bold text-zinc-350 group-hover:text-cyan-300">CONTROL_PANEL.EXE</span>
                    </button>
                    <button
                      onClick={() => { handleOpenWindow("taskmgr"); setIsStartMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-1 rounded hover:bg-zinc-900/60 text-left cursor-pointer group"
                    >
                      <Cpu className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition shrink-0" />
                      <span className="text-[10px] font-bold text-zinc-350 group-hover:text-cyan-300">TASK_MANAGER.EXE</span>
                    </button>
                  </div>
                </div>

                {/* 2. Networks */}
                <div className="space-y-1 pt-1">
                  <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest block pb-0.5 border-b border-zinc-900/40">Virtual Networks</span>
                  <div className="grid grid-cols-1 gap-1">
                    <button
                      onClick={() => { handleOpenWindow("cisco"); setIsStartMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-1 rounded hover:bg-zinc-900/60 text-left cursor-pointer group"
                    >
                      <Settings className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition shrink-0" />
                      <span className="text-[10px] font-bold text-zinc-350 group-hover:text-cyan-300">CISCO_SANDBOX.NET</span>
                    </button>
                    <button
                      onClick={() => { handleOpenWindow("terminal"); setIsStartMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-1 rounded hover:bg-zinc-900/60 text-left cursor-pointer group"
                    >
                      <TermIcon className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition shrink-0" />
                      <span className="text-[10px] font-bold text-zinc-350 group-hover:text-cyan-300">AI_OPERATOR.CHAT</span>
                    </button>
                  </div>
                </div>

                {/* 3. Dossiers */}
                <div className="space-y-1 pt-1">
                  <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest block pb-0.5 border-b border-zinc-900/40">Dossier Documents</span>
                  <div className="grid grid-cols-1 gap-0.5 max-h-[105px] overflow-y-auto scrollbar-thin">
                    {[
                      { id: "about" as const, name: "ABOUT_ME.SYS" },
                      { id: "skills" as const, name: "SKILLS_MATRIX.EXE" },
                      { id: "experience" as const, name: "EXPERIENCE.LOG" },
                      { id: "certifications" as const, name: "CERT_CENTRAL.SEC" },
                      { id: "education" as const, name: "ACADEMIC.EDU" },
                      { id: "references" as const, name: "REFERENCES.DIR" },
                      { id: "contact" as const, name: "CONTACT.TXT" }
                    ].map((app) => (
                      <button
                        key={app.id}
                        onClick={() => { handleOpenWindow(app.id); setIsStartMenuOpen(false); }}
                        className="w-full flex items-center space-x-1.5 p-1 rounded hover:bg-zinc-905/40 text-left cursor-pointer text-zinc-400 hover:text-white"
                      >
                        <ChevronRight className="w-2.5 h-2.5 text-zinc-600" />
                        <span className="text-[9px] font-medium truncate">{app.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT SECTION: OS UTILITIES */}
              <div className="w-[140px] bg-zinc-950/80 p-3.5 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[8px] text-zinc-500 font-bold block pb-1 border-b border-zinc-900/30">SECURITY CORE</span>
                  
                  <button
                    onClick={() => {
                      setIsLocked(true);
                      setIsStartMenuOpen(false);
                      playBeep(450, 0.15);
                    }}
                    className="w-full text-left p-1.5 rounded hover:bg-zinc-900/60 flex items-center gap-2 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-red-400" />
                    <span>LOCK_HOST</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm("Initiate cold-boot system reload sequences?")) {
                        setIsBooted(false);
                        setIsStartMenuOpen(false);
                        playBeep(1200, 0.4);
                      }
                    }}
                    className="w-full text-left p-1.5 rounded hover:bg-zinc-900/60 flex items-center gap-2 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
                    <span>COLD_RESET</span>
                  </button>

                  <button
                    onClick={() => {
                      resetWorkspace();
                      setIsStartMenuOpen(false);
                    }}
                    className="w-full text-left p-1.5 rounded hover:bg-zinc-900/60 flex items-center gap-2 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ALIGN_WINS</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-zinc-900/40 text-center">
                  <button
                    onClick={() => setIsStartMenuOpen(false)}
                    className="w-full text-center py-1 bg-zinc-900/60 text-zinc-500 rounded text-[8px] font-bold hover:text-red-450 transition cursor-pointer"
                  >
                    DISMISS
                  </button>
                </div>
              </div>

            </div>
            
            {/* UTC Clock / system status bar */}
            <div className="bg-slate-900 px-3.5 py-2 border-t border-zinc-900 flex justify-between items-center text-[9px] text-zinc-400">
              <span>ZAMBIA :: Chipata Core OS</span>
              <span>UTC: {currentTime || "SYNCING"}</span>
            </div>

          </div>
        )}

        {/* CUSTOM DESKTOP CONTEXT MENU */}
        {contextMenu && contextMenu.visible && (
          <div
            className="fixed bg-slate-950/95 border border-cyan-500/30 rounded shadow-2xl backdrop-blur-xl z-[9999] py-1.5 w-52 font-mono text-[11px] text-zinc-350 animate-fade-in"
            style={{ 
              left: `${contextMenu.x}px`, 
              top: `${contextMenu.y}px`,
              borderColor: themeHexHex + "40",
              boxShadow: `0 10px 30px rgba(0,0,0,0.8), 0 0 12px ${themeHexHex}15`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title / Header */}
            <div className="px-3 py-1 pb-1.5 mb-1 border-b border-zinc-900/60 text-[8px] text-zinc-500 uppercase tracking-widest font-black select-none">
              Mihji OS Desktop Tools
            </div>

            {/* Refresh */}
            <button
              onClick={() => {
                playBeep(1100, 0.1);
                setContextMenu(null);
              }}
              className="w-full text-left px-3.5 py-1.5 hover:bg-zinc-900 hover:text-white flex items-center space-x-2 cursor-pointer transition select-none"
            >
              <RefreshCw className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span>Refresh Environment</span>
            </button>

            {/* Create Sticky Pad */}
            <button
              onClick={() => {
                const nextId = "note_" + (stickyNotes.length + 1);
                const posX = Math.min(window.innerWidth - 270, contextMenu.x);
                const posY = Math.min(window.innerHeight - 200, contextMenu.y);
                setStickyNotes((prev) => [
                  ...prev,
                  {
                    id: nextId,
                    x: posX,
                    y: posY,
                    text: "NEW_MEMO.LOG\n-----------------\nEnter notes here...",
                    color: "orange"
                  }
                ]);
                playBeep(980, 0.08);
                setContextMenu(null);
              }}
              className="w-full text-left px-3.5 py-1.5 hover:bg-zinc-900 hover:text-white flex items-center space-x-2 cursor-pointer transition select-none"
            >
              <StickyNote className="w-3.5 h-3.5 text-orange-555 shrink-0" />
              <span>Create Memo Pad</span>
            </button>

            {/* Align windows */}
            <button
              onClick={() => {
                resetWorkspace();
                setContextMenu(null);
              }}
              className="w-full text-left px-3.5 py-1.5 hover:bg-zinc-900 hover:text-white flex items-center space-x-2 cursor-pointer transition select-none"
            >
              <Layers className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span>Align All Windows</span>
            </button>

            <div className="my-1 border-t border-zinc-900/50" />

            {/* Wallpapers */}
            <button
              onClick={() => {
                const wallModes = ["network", "starfield", "minimal"];
                const nextIdx = (wallModes.indexOf(wallpaperMode) + 1) % wallModes.length;
                setWallpaperMode(wallModes[nextIdx]);
                playBeep(850, 0.05);
                setContextMenu(null);
              }}
              className="w-full text-left px-3.5 py-1.5 hover:bg-zinc-900 hover:text-white flex items-center space-x-2 cursor-pointer transition select-none"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-500 shrink-0" style={{ color: themeHexHex }} />
              <div className="flex justify-between items-center w-full">
                <span>Wallpaper Mode</span>
                <span className="text-[8px] bg-slate-900 border border-zinc-800 px-1.5 py-0.5 rounded text-cyan-400 capitalize" style={{ color: themeHexHex }}>
                  {wallpaperMode}
                </span>
              </div>
            </button>

            {/* Toggle Audio feedback */}
            <button
              onClick={() => {
                setSoundActive(!soundActive);
                playBeep(900, 0.05);
                setContextMenu(null);
              }}
              className="w-full text-left px-3.5 py-1.5 hover:bg-zinc-900 hover:text-white flex items-center space-x-2 cursor-pointer transition select-none"
            >
              {soundActive ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-zinc-650 shrink-0" />
              )}
              <span>System Sound {soundActive ? "ON" : "OFF"}</span>
            </button>

            <div className="my-1 border-t border-zinc-900/50" />

            {/* Lock client */}
            <button
              onClick={() => {
                setIsLocked(true);
                playBeep(450, 0.15);
                setContextMenu(null);
              }}
              className="w-full text-left px-3.5 py-1.5 hover:bg-zinc-900 hover:text-red-400 flex items-center space-x-2 cursor-pointer transition text-red-500/90 font-bold select-none"
            >
              <Lock className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>Lock Environment</span>
            </button>
          </div>
        )}

        {/* SECURITY ENCRYPTION LOCK SCREEN OVERLAY */}
        {isLocked && (
          <div className="fixed inset-0 bg-[#020509]/98 z-50 flex items-center justify-center font-mono select-none px-4">
            <div className="relative w-full max-w-sm p-6 rounded-lg bg-zinc-950/90 border border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.1)] flex flex-col items-center text-center space-y-6">
              
              <div className="w-12 h-12 rounded-full bg-red-950/20 border border-red-500/30 flex items-center justify-center animate-pulse">
                <Lock className="w-5 h-5 text-red-500" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-sm font-black text-red-400 uppercase tracking-widest">GEORGE CHAKA SECTORS</h2>
                <p className="text-[9px] text-red-500/60 uppercase">SYSTEM ENCRYPTION: SECURE SHELL ACTIVE</p>
              </div>

              <p className="text-[10px] text-zinc-500 font-medium leading-relaxed max-w-[280px]">
                Access restricted. Input Mihji OS credential codes to release desktop decryption protocols.
              </p>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (lockPassword.toLowerCase() === "admin" || lockPassword.toLowerCase() === "operator" || lockPassword.trim() === "CCNP") {
                    setIsLocked(false);
                    setLockPassword("");
                    setLockError(false);
                    playBeep(1100, 0.1);
                  } else {
                    setLockError(true);
                    playBeep(300, 0.3);
                    setTimeout(() => setLockError(false), 2000);
                  }
                }}
                className="w-full space-y-3"
              >
                <div className="relative">
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="Insert authorization code..."
                    value={lockPassword}
                    onChange={(e) => setLockPassword(e.target.value)}
                    className={`w-full bg-slate-900 border text-center text-xs tracking-wider rounded p-2.5 outline-none focus:bg-slate-950 focus:border-red-400 ${
                      lockError ? "border-red-500 text-red-400 animate-pulse bg-red-950/10" : "border-zinc-805 text-zinc-350"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 border border-zinc-800 hover:bg-emerald-950/30 hover:border-emerald-500/40 text-emerald-400 font-bold rounded text-[9px] tracking-widest uppercase transition cursor-pointer"
                >
                  DECRYPT HARDWARE
                </button>
              </form>

              <div className="space-y-1">
                {lockError ? (
                  <p className="text-red-400 text-[8px] font-bold uppercase animate-pulse">
                    [SECURITY CODES MISMATCH]: UN-DECRYPTED ACCESS ATTEMPT.
                  </p>
                ) : (
                  <p className="text-zinc-650 text-[8px] uppercase tracking-wider font-semibold">
                    DECRYPTION KEY HINT: "admin" OR "operator"
                  </p>
                )}
              </div>

            </div>
          </div>
        )}

      </main>

      {/* FOOTER TASKBAR RUNNING CONTAINER DOCK TRAY */}
      <footer 
        className="h-[52px] shrink-0 border-t bg-slate-950/80 backdrop-blur-md z-40 relative flex items-center justify-between px-6 select-none"
        style={{ borderTopColor: themeHexHex + "25" }}
      >
        
        {/* Left diagnostic status logs indicators + START MENU BUTTON */}
        <div className="flex items-center space-x-3.5">
          <button
            id="start-btn"
            onClick={() => {
              setIsStartMenuOpen(!isStartMenuOpen);
              playBeep(920, 0.05);
            }}
            className="px-4 py-1.5 bg-gradient-to-r from-zinc-950/90 to-zinc-900/90 border rounded text-white font-mono text-[10px] tracking-widest font-black uppercase hover:scale-105 active:scale-95 flex items-center gap-1.5 transition cursor-pointer"
            style={{ 
              borderColor: themeHexHex + "80",
              boxShadow: isStartMenuOpen ? `0 0 10px ${themeHexHex}40` : "none"
            }}
          >
            <Cpu className="w-3.5 h-3.5 animate-pulse" style={{ color: themeHexHex }} />
            <span>START</span>
          </button>

          <div className="hidden sm:flex items-center space-x-2 text-[9px] font-mono text-zinc-500 border-l border-zinc-800 pl-3">
            <TermIcon className="w-3.5 h-3.5 text-zinc-500" />
            <span>PORT_3000_SECURE_NODE</span>
          </div>
        </div>

        {/* Center Dock running items restored tray */}
        <div className="flex items-center space-x-3 mx-auto sm:mx-0 overflow-x-auto scrollbar-none max-w-[70%]">
          
          {[
            { id: "about" as const, name: "ABOUT", level: "SYS" },
            { id: "skills" as const, name: "SKILLS", level: "EXE" },
            { id: "experience" as const, name: "EXP", level: "LOG" },
            { id: "cisco" as const, name: "CISCO", level: "NET" },
            { id: "certifications" as const, name: "CERTS", level: "SEC" },
            { id: "education" as const, name: "EDU", level: "TXT" },
            { id: "terminal" as const, name: "AI_TERM", level: "SH" },
            { id: "explorer" as const, name: "FILES", level: "EXE" },
            { id: "settings" as const, name: "CONTROL", level: "SYS" },
            { id: "taskmgr" as const, name: "TASKMGR", level: "EXE" },
            { id: "references" as const, name: "REFS", level: "DIR" },
            { id: "contact" as const, name: "CONTACT", level: "TXT" }
          ].map((item) => {
            const win = windows.find((w) => w.id === item.id);
            if (!win) return null;
            const isOpen = win.isOpen;
            const isMin = win.isMinimized;
            
            // Higher z-index window represents focused active app
            const topOpenWin = [...windows]
              .filter((w) => w.isOpen && !w.isMinimized)
              .sort((a, b) => b.zIndex - a.zIndex)[0];
            const isFocused = isOpen && !isMin && topOpenWin?.id === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!isOpen) {
                    handleOpenWindow(item.id);
                  } else if (isMin) {
                    handleFocus(item.id);
                  } else if (isFocused) {
                    handleMinimize(item.id);
                  } else {
                    handleFocus(item.id);
                  }
                }}
                className={`px-3 py-1 bg-zinc-950 rounded border flex flex-col items-center justify-center transition cursor-pointer select-none shrink-0 ${
                  isFocused
                    ? "bg-slate-900 border-opacity-100 font-bold"
                    : isOpen
                    ? "border-zinc-800 bg-zinc-900/40 text-zinc-400"
                    : "border-zinc-905 opacity-25 hover:opacity-100 text-zinc-500"
                }`}
                style={{ 
                  borderColor: isFocused ? themeHexHex : undefined,
                  color: isFocused ? themeHexHex : undefined
                }}
              >
                <div className="flex items-center space-x-1 text-[8px] font-mono select-none">
                  <span>{item.name}</span>
                  <span className="text-[7px] text-zinc-650 font-normal">.{item.level}</span>
                </div>
                {/* Active mini glow marker */}
                {isOpen && (
                  <span className="w-1.5 h-0.5 rounded-full mt-0.5 animate-pulse" style={{ backgroundColor: isFocused ? themeHexHex : "#71717a" }} />
                )}
              </button>
            );
          })}

        </div>

        {/* Right decoration layout specs */}
        <div className="hidden md:flex text-right text-[9px] font-mono text-zinc-600/95 leading-tight flex-col items-end">
          <p>CHIPATA SECURITY CORE V4.2</p>
          <p className="text-[8px] font-bold" style={{ color: themeHexHex + "aa" }}>SECURE_GRID_ONLINE</p>
        </div>

      </footer>

    </div>
  );
}
