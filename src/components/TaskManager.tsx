import React, { useState, useEffect } from "react";
import { Cpu, Eye, ShieldAlert, Terminal, Play, Zap, RefreshCw, XSquare } from "lucide-react";
import { WindowConfig, WindowId } from "../types";

interface TaskManagerProps {
  windows: WindowConfig[];
  onCloseWindow: (id: WindowId) => void;
  playBeep: (freq?: number, duration?: number) => void;
}

export default function TaskManager({ windows, onCloseWindow, playBeep }: TaskManagerProps) {
  // Simulated stats state
  const [totalRam, setTotalRam] = useState(2.4); // GB used
  const [activeThreads, setActiveThreads] = useState(38);
  const [systemUptime, setSystemUptime] = useState("02:14:55");

  // Format system uptime hours
  useEffect(() => {
    const startMins = Math.floor(Math.random() * 59);
    const startSecs = Math.floor(Math.random() * 59);
    let sec = startSecs;
    let min = startMins;
    let hr = 2;

    const timer = setInterval(() => {
      sec += 1;
      if (sec >= 60) {
        sec = 0;
        min += 1;
        if (min >= 60) {
          min = 0;
          hr += 1;
        }
      }
      setSystemUptime(
        `${String(hr).padStart(2, "0")}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
      );
    }, 1000);

    // Fluctuate memory slightly
    const statInterval = setInterval(() => {
      setTotalRam((prev) => parseFloat((prev + (Math.random() * 0.1 - 0.05)).toFixed(2)));
      setActiveThreads((prev) => Math.max(30, Math.min(50, prev + Math.floor(Math.random() * 3 - 1))));
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(statInterval);
    };
  }, []);

  // Map window id to a clean Process ID (PID)
  const getPID = (id: string): number => {
    switch (id) {
      case "about": return 4015;
      case "skills": return 4082;
      case "experience": return 4110;
      case "cisco": return 5022;
      case "certifications": return 4124;
      case "education": return 4231;
      case "terminal": return 3050;
      case "references": return 4305;
      case "contact": return 4192;
      case "explorer": return 3020;
      case "settings": return 3010;
      case "taskmgr": return 2044;
      default: return 9000 + Math.floor(Math.random() * 100);
    }
  };

  const getMemoryWeight = (id: string): string => {
    switch (id) {
      case "cisco": return "124.5 MB";
      case "terminal": return "86.2 MB";
      case "explorer": return "45.8 MB";
      case "settings": return "32.1 MB";
      default: return `${(15 + Math.floor(Math.random() * 18)).toFixed(1)} MB`;
    }
  };

  // Get active rendering applications
  const openProcessList = windows.filter((w) => w.isOpen);

  const handleKillProcess = (id: WindowId) => {
    if (id === "taskmgr") {
      alert("System kernel notice: You cannot kill Task Manager from within itself!");
      playBeep(400, 0.25);
      return;
    }
    playBeep(350, 0.18);
    onCloseWindow(id);
  };

  return (
    <div className="w-full text-zinc-300 font-mono text-xs space-y-5">
      
      {/* 1. Technical system resource dials */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        
        {/* Core Ram usage */}
        <div className="p-3 bg-zinc-950/80 rounded border border-zinc-900">
          <div className="flex justify-between items-center text-[10px] mb-1">
            <span className="text-zinc-500 uppercase font-black">RAM UTILIZATION</span>
            <span className="text-cyan-400 font-bold">{((totalRam / 8.0) * 100).toFixed(0)}%</span>
          </div>
          <div className="text-sm font-bold text-zinc-200 mb-2">
            {totalRam} GB <span className="text-[10px] text-zinc-500 font-normal">/ 8.0 GB</span>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden p-0.5 border border-zinc-800">
            <div
              style={{ width: `${(totalRam / 8.0) * 100}%` }}
              className="bg-cyan-500 h-full rounded-full transition-all duration-1000 opacity-80"
            />
          </div>
        </div>

        {/* Core threads used */}
        <div className="p-3 bg-zinc-950/80 rounded border border-zinc-900 flex flex-col justify-between">
          <span className="text-zinc-500 uppercase font-black text-[10px]">CPU ACTIVE THREADS</span>
          <div className="text-base font-bold text-[#00f3ff] mt-1.5">
            {activeThreads} <span className="text-[9px] text-zinc-500 uppercase font-normal">Active Rings</span>
          </div>
          <span className="text-[8px] text-zinc-600 uppercase block mt-1">Multi-core context scheduler</span>
        </div>

        {/* System Uptime */}
        <div className="p-3 bg-zinc-950/80 rounded border border-zinc-900 flex flex-col justify-between">
          <span className="text-zinc-500 uppercase font-black text-[10px]">KERNEL UPTIME</span>
          <div className="text-base font-bold text-amber-500 mt-1.5 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
            <span>{systemUptime}</span>
          </div>
          <span className="text-[8px] text-zinc-600 uppercase block mt-1">Zambia/Chipata Gateway</span>
        </div>

      </div>

      {/* 2. Process list table */}
      <div className="border border-zinc-900 bg-zinc-950/50 rounded-lg overflow-hidden">
        
        {/* Table Titlebar */}
        <div className="p-2.5 bg-slate-950 border-b border-zinc-900 flex items-center justify-between">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>ACTIVE OPERATIONAL PROCESSES ({openProcessList.length})</span>
          </span>
          <span className="text-[8px] text-zinc-600">SCHEDULER STATUS: ONLINE</span>
        </div>

        {/* Process layout table rows */}
        <div className="overflow-x-auto max-h-[240px] scrollbar-thin">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-zinc-900/30 text-[9px] text-zinc-500 uppercase border-b border-zinc-900">
              <tr>
                <th className="p-2.5 pl-4">PID</th>
                <th className="p-2.5">PROCESS NAME / THREAD</th>
                <th className="p-2.5 text-center">MEMORY WEAPONRY</th>
                <th className="p-2.5 text-center">STATUS</th>
                <th className="p-2.5 pr-4 text-right">FORCE_CMD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/40 text-[11px]">
              {openProcessList.map((proc) => {
                return (
                  <tr key={proc.id} className="hover:bg-zinc-900/10 transition select-none">
                    {/* PID */}
                    <td className="p-2.5 pl-4 font-bold text-zinc-500">
                      {getPID(proc.id)}
                    </td>

                    {/* App title */}
                    <td className="p-2.5 font-bold text-zinc-300">
                      <div className="flex items-center space-x-2">
                        <Terminal className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                        <span>{proc.title}</span>
                      </div>
                    </td>

                    {/* RAM */}
                    <td className="p-2.5 text-center text-zinc-400">
                      {getMemoryWeight(proc.id)}
                    </td>

                    {/* Status */}
                    <td className="p-2.5 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                        RUNNING
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-2.5 pr-4 text-right">
                      <button
                        onClick={() => handleKillProcess(proc.id)}
                        className="px-2 py-0.5 rounded bg-red-950/50 border border-red-900/30 hover:border-red-500 hover:bg-red-900 text-red-400 hover:text-white text-[9px] tracking-wide font-bold transition flex items-center justify-center gap-1 ml-auto cursor-pointer"
                        title="Force close this application window"
                      >
                        <XSquare className="w-3.5 h-3.5" />
                        <span>KILL_TASK</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* 3. Safety guidelines warnings alert */}
      <div className="p-3 bg-red-950/10 rounded border border-red-900/20 font-mono text-[9px] text-red-400 flex items-start gap-2 select-none leading-relaxed">
        <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5 animate-pulse" />
        <div>
          [CRITICAL KERNEL ALERT]: Force-terminating memory threads shuts down window sockets instantly. Save all progress logs inside static files (e.g., FILE_EXPLORER.EXE Notepad) before dispatching KILL_TASK commands.
        </div>
      </div>

    </div>
  );
}
