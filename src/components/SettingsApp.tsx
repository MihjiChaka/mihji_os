import React from "react";
import { Monitor, Volume2, ShieldAlert, Sliders, Sun, Wifi, Sparkles, RefreshCcw } from "lucide-react";

interface SettingsAppProps {
  accentColor: string;
  setAccentColor: (color: string) => void;
  wallpaperMode: string;
  setWallpaperMode: (mode: string) => void;
  soundActive: boolean;
  setSoundActive: (active: boolean) => void;
  crtIntensity: number;
  setCrtIntensity: (intensity: number) => void;
  customGreeting: string;
  setCustomGreeting: (greeting: string) => void;
  playBeep: (freq?: number, duration?: number) => void;
}

export default function SettingsApp({
  accentColor,
  setAccentColor,
  wallpaperMode,
  setWallpaperMode,
  soundActive,
  setSoundActive,
  crtIntensity,
  setCrtIntensity,
  customGreeting,
  setCustomGreeting,
  playBeep
}: SettingsAppProps) {

  const themeOptions = [
    { id: "cyan", label: "CLASSIC_CYAN (Default)", hex: "#00f3ff", desc: "Enterprise infrastructure standard" },
    { id: "green", label: "MATRIX_GREEN", hex: "#10b981", desc: "Retro hacker matrix terminal look" },
    { id: "amber", label: "FALLOUT_AMBER", hex: "#f59e0b", desc: "Post-apocalyptic CRT radar display" },
    { id: "purple", label: "NEON_PURPLE", hex: "#d946ef", desc: "Cyberpunk high-density neon orchid" },
    { id: "rose", label: "ALARM_ROSE", hex: "#f43f5e", desc: "Warning security breach notification system" }
  ];

  const wallpaperOptions = [
    { id: "network", label: "Live Network Matrix Nodes", desc: "Dynamic interactive Cisco wireframe topology" },
    { id: "starfield", label: "Digital Deep Starfield Grid", desc: "Subtle twinkling cosmic coordinate system" },
    { id: "minimal", label: "Clean Dark Circuit Ground", desc: "Static cybernetic blueprint layout framework" }
  ];

  const handleSetTheme = (themeId: string) => {
    setAccentColor(themeId);
    let freq = 800;
    if (themeId === "green") freq = 1100;
    if (themeId === "amber") freq = 600;
    if (themeId === "purple") freq = 1300;
    if (themeId === "rose") freq = 400;
    playBeep(freq, 0.08);
  };

  const handleSetWallpaper = (wId: string) => {
    setWallpaperMode(wId);
    playBeep(900, 0.05);
  };

  const resetToFactoryDefault = () => {
    playBeep(1200, 0.15);
    setAccentColor("cyan");
    setWallpaperMode("network");
    setSoundActive(true);
    setCrtIntensity(6);
    setCustomGreeting("MIHJI_CHAKA.SYS");
  };

  return (
    <div className="w-full text-zinc-300 font-mono text-xs space-y-6">
      
      {/* Description */}
      <p className="text-[10px] text-zinc-500 italic uppercase">
        * System control registers &amp; kernel environment settings:
      </p>

      {/* 1. Accent Theme Select */}
      <div className="p-4 bg-zinc-950/80 rounded border border-zinc-900 space-y-3">
        <h3 className="font-bold text-cyan-400 uppercase tracking-widest text-xs flex items-center gap-2">
          <Sun className="w-4 h-4 text-cyan-400" />
          <span>ACCENT COLOR THEME PROFILES:</span>
        </h3>
        
        <p className="text-[9px] text-zinc-500 uppercase leading-relaxed">
          Select primary graphic accent color pathways to propagate throughout all windows, taskbars, and launcher nodes:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {themeOptions.map((theme) => {
            const isSelected = accentColor === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleSetTheme(theme.id)}
                className={`flex flex-col p-2.5 rounded border text-left transition select-none cursor-pointer hover:bg-slate-900/60 ${
                  isSelected
                    ? "bg-slate-900 border-cyan-400"
                    : "bg-zinc-900/40 border-zinc-900 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span
                    style={{ backgroundColor: theme.hex }}
                    className="w-2.5 h-2.5 rounded-full ring-2 ring-black shrink-0 relative"
                  />
                  <span className={`text-[10px] font-bold ${isSelected ? "text-[#00f3ff]" : "text-zinc-300"}`}>
                    {theme.label}
                  </span>
                </div>
                <span className="text-[8px] text-zinc-500 mt-1 uppercase truncate w-full pl-4">
                  {theme.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Wallpaper switcher */}
      <div className="p-4 bg-zinc-950/80 rounded border border-zinc-900 space-y-3">
        <h3 className="font-bold text-cyan-400 uppercase tracking-widest text-xs flex items-center gap-2">
          <Monitor className="w-4 h-4 text-cyan-400" />
          <span>DESKTOP BACKGROUND HARDWARE STACKS:</span>
        </h3>

        <div className="space-y-2">
          {wallpaperOptions.map((wp) => {
            const isSel = wallpaperMode === wp.id;
            return (
              <button
                key={wp.id}
                type="button"
                onClick={() => handleSetWallpaper(wp.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded border text-left transition cursor-pointer ${
                  isSel
                    ? "bg-slate-900/60 border-cyan-500/80 text-cyan-300"
                    : "bg-zinc-900/20 border-zinc-900 hover:border-zinc-800"
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold block">{wp.label}</span>
                  <span className="text-[8px] text-zinc-500 uppercase block mt-0.5">{wp.desc}</span>
                </div>
                {isSel && <div className="text-[8px] text-cyan-400 font-bold border border-cyan-500/40 px-1.5 py-0.5 rounded uppercase">[ACTIVE]</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sliders and settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Controls, sounds */}
        <div className="p-4 bg-zinc-950/80 rounded border border-zinc-900 space-y-4">
          <h4 className="font-bold text-cyan-400 uppercase tracking-widest text-xs flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>OPERATING SYSTEMS &amp; PERIPHERALS:</span>
          </h4>

          {/* Sound enable block */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold block">ACOUSTIC PORT DIAGNOSTICS</span>
              <span className="text-[8px] text-zinc-500 uppercase block">Keyboard feedback and action alerts</span>
            </div>
            <button
              onClick={() => {
                setSoundActive(!soundActive);
                playBeep(soundActive ? 400 : 1000, 0.05);
              }}
              className={`px-3 py-1 rounded border font-bold text-[9px] uppercase hover:scale-105 transition ${
                soundActive
                  ? "bg-cyan-950/20 border-cyan-500 text-cyan-400"
                  : "bg-zinc-900/80 border-zinc-800 text-zinc-600"
              }`}
            >
              {soundActive ? "MUTABLE" : "MUTE"}
            </button>
          </div>

          <hr className="border-zinc-900" />

          {/* CRT Noise density bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-bold">CRT MONITOR ARTIFACT DENSITY</span>
              <span className="text-cyan-400 font-bold">{crtIntensity * 10}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={crtIntensity}
              onChange={(e) => {
                setCrtIntensity(parseInt(e.target.value));
              }}
              className="w-full bg-slate-900 h-1.5 rounded cursor-pointer accent-cyan-400 border border-zinc-800"
            />
            <span className="text-[8px] text-zinc-500 uppercase block">Modulates CRT flicker scanline overlay density</span>
          </div>
        </div>

        {/* Custom greeting panel */}
        <div className="p-4 bg-zinc-950/80 rounded border border-zinc-900 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="font-bold text-cyan-400 uppercase tracking-widest text-xs flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>CUSTOM CORE PROFILE LABEL:</span>
            </h4>

            <div>
              <label className="text-[8px] text-zinc-500 uppercase block mb-1">Top left operator signature tag:</label>
              <input
                type="text"
                maxLength={20}
                value={customGreeting}
                onChange={(e) => setCustomGreeting(e.target.value.toUpperCase())}
                className="w-full bg-slate-900 text-xs text-[#00f3ff] border border-zinc-800 rounded px-2 py-1.5 font-mono focus:border-cyan-500 outline-none"
              />
            </div>
            <span className="text-[8px] text-zinc-500 uppercase block leading-tight">
              Updates global system OS header label tag instantly!
            </span>
          </div>

          <div className="pt-3 border-t border-zinc-900 flex justify-end">
            <button
              onClick={resetToFactoryDefault}
              className="px-3 py-1 bg-zinc-900 text-zinc-400 border border-zinc-800 rounded hover:border-red-400 hover:text-red-400 flex items-center justify-center gap-1 text-[9px] uppercase tracking-widest cursor-pointer transition"
            >
              <RefreshCcw className="w-3 h-3" />
              <span>FACTORY_RESET</span>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom telemetry card info */}
      <div className="p-3 bg-cyan-950/10 rounded border border-cyan-500/20 font-mono text-[9px] text-[#00f3ff] leading-relaxed select-none uppercase tracking-widest flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
        <span>[HARDWARE KERNEL DETECTOR]: CPU clocking successfully, GNA local server ports responding securely.</span>
      </div>

    </div>
  );
}
