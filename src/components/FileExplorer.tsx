import React, { useState } from "react";
import { Folder, File, ArrowLeft, Plus, Save, Trash2, Edit, ChevronRight, FileCode, Check, Eye } from "lucide-react";

// Types for virtual filesystem
export interface DiskItem {
  id: string; // Unique string
  name: string;
  type: "file" | "directory";
  content?: string;
  size: string;
  extension?: string;
  childrenIds?: string[]; // If directory
}

interface FileExplorerProps {
  playBeep: (freq?: number, duration?: number) => void;
}

export default function FileExplorer({ playBeep }: FileExplorerProps) {
  // File system state initialized with rich corporate files matching Mihji's qualifications
  const [items, setItems] = useState<Record<string, DiskItem>>({
    root: {
      id: "root",
      name: "C:",
      type: "directory",
      size: "4.2 MB",
      childrenIds: ["docs", "prog", "net", "todo"]
    },
    docs: {
      id: "docs",
      name: "Documents",
      type: "directory",
      size: "1.2 MB",
      childrenIds: ["bio", "career", "skills_txt"]
    },
    bio: {
      id: "bio",
      name: "Mihji_Biography.txt",
      type: "file",
      extension: "txt",
      size: "820 bytes",
      content: "MIHJI GEORGE CHAKA PROFILE SUMMARY\n=================================\n\nLocation: Chipata, Eastern Province, Zambia\nPrimary Focus: Full-Stack PHP & C# Engineer / Certified Cisco Network Professional\n\nI specialize in bridging the gap between hardware network routing and modern secure enterprise software. Operating out of Kalongwezi, I build full-stack interfaces (Laravel, .NET Core) and audit physical Cisco ASA firewalls, wireless controllers (WLCs), and multi-area OSPF systems."
    },
    career: {
      id: "career",
      name: "Career_Milestones.txt",
      type: "file",
      extension: "txt",
      size: "450 bytes",
      content: "PROJECT PLANS & GOALS - 2026\n=========================== \n- Expand the current agricultural database synchronization systems for Good Nature Agro.\n- Audit and optimize field branch-to-branch secure VPN pathways.\n- Achieve supplementary AWS Cloud Solutions Architect certification.\n- Streamline local real-time telecom monitoring via custom socket APIs."
    },
    skills_txt: {
      id: "skills_txt",
      name: "Skills_Matrix.log",
      type: "file",
      extension: "log",
      size: "1.1 KB",
      content: "SYSTEM LOG: SKILLS MATRIX REPORT\n===============================\n[SYS] BACKEND: C#, ASP.NET Core, Laravel, PHP, Go Lang\n[SYS] FRONTEND: Typescript, React, TailwindCSS, D3.js Charts\n[SYS] NETWORKING: CCNP Enterprise, OSPF, BGP Routing, Cisco Firewalls\n[SYS] DATABASE: PostgreSQL, SQL Server, MongoDB, SQLite\n[SYS] DevOps: Docker, Nginx, Linux SysAdmin, Git Actions\n\nAll systems functional. Certified code verified."
    },
    prog: {
      id: "prog",
      name: "ProgramFiles",
      type: "directory",
      size: "1.8 MB",
      childrenIds: ["ccnp_cmd", "laravel_ctrl"]
    },
    ccnp_cmd: {
      id: "ccnp_cmd",
      name: "CiscoASA_Audit.ios",
      type: "file",
      extension: "ios",
      size: "540 bytes",
      content: "! Cisco ASA Security Policy Benchmark\n! Created by Mihji Chaka\n\ninterface GigabitEthernet0/0\n nameif outside\n security-level 0\n ip address dhcp\nno shutdown\n!\ninterface GigabitEthernet0/1\n nameif inside\n security-level 100\n ip address 192.168.10.1 255.255.255.0\nno shutdown\n!\naccess-list OUTSIDE_IN extended permit tcp any host 192.168.10.10 eq https\naccess-group OUTSIDE_IN in interface outside"
    },
    laravel_ctrl: {
      id: "laravel_ctrl",
      name: "GNA_ApiController.php",
      type: "file",
      extension: "php",
      size: "1.4 KB",
      content: "<?php\n\nnamespace App\\Http\\Controllers\\Api;\n\nuse App\\Http\\Controllers\\Controller;\nuse Illuminate\\Http\\Request;\nuse App\\Models\\NetworkDevice;\n\nclass CiscoNetworkController extends Controller {\n    public function getSystemHealth() {\n        return response()->json([\n            \"status\" => \"HEALTHY\",\n            \"timestamp\" => now()->toIso8601String(),\n            \"cpu_load_avg\" => sys_getloadavg()[0] ?? 12,\n            \"asn_gateway\" => \"65001\",\n            \"active_bgp_peers\" => 4\n        ]);\n    }\n}"
    },
    net: {
      id: "net",
      name: "NetworkConfigs",
      type: "directory",
      size: "800 bytes",
      childrenIds: ["route_script", "wlc_info"]
    },
    route_script: {
      id: "route_script",
      name: "OSPF_Setup_Script.txt",
      type: "file",
      extension: "txt",
      size: "320 bytes",
      content: "ROUTING SETUP SYSTEM:\n====================\nrouter ospf 100\n router-id 10.15.0.254\n network 10.15.10.0 0.0.0.255 area 0\n network 192.168.10.0 0.0.0.255 area 1\n passive-interface GigabitEthernet0/1\n! End Configuration"
    },
    wlc_info: {
      id: "wlc_info",
      name: "WLC_WLAN_Profiles.log",
      type: "file",
      extension: "log",
      size: "620 bytes",
      content: "SYS_WLC_CONTROLLER_INFO\n========================\nSSID-1: GNA_Staff_Secure (AES-WPA3)\nSSID-2: GNA_Warehouse_Devices (AES-WPA2, MAC Filter Active)\nSSID-3: GNA_Guest (WebPortal Enabled, Speed Limit 5Mbps/client)\n\nCentral Gateway Controller State: OPERATIONAL\nReachable APs: AP-Office-1, AP-Office-2, AP-Warehouse-Dry"
    },
    todo: {
      id: "todo",
      name: "Tasks_Scheduler",
      type: "directory",
      size: "400 bytes",
      childrenIds: ["daily_jobs"]
    },
    daily_jobs: {
      id: "daily_jobs",
      name: "Work_Schedule.txt",
      type: "file",
      extension: "txt",
      size: "210 bytes",
      content: "OPERATOR DAILY SCHEDULE\n=======================\n[ ] Confirm Chipata main OSPF topology loopbacks are online\n[ ] Revise PHP Laravel reporting endpoints for warehouse logistics\n[ ] Submit CCNP security self-audit dashboard to management"
    }
  });

  // Explorer session states
  const [currentFolderId, setCurrentFolderId] = useState<string>("root");
  const [folderHistory, setFolderHistory] = useState<string[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Text editor state for editing virtual files
  const [editedFileId, setEditedFileId] = useState<string | null>(null);
  const [editedFileName, setEditedFileName] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // New item creators
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const currentFolder = items[currentFolderId] || items.root;
  const childIds = currentFolder.childrenIds || [];

  const handleOpenItem = (id: string) => {
    const item = items[id];
    if (!item) return;

    playBeep(920, 0.04);
    if (item.type === "directory") {
      setFolderHistory((prev) => [...prev, currentFolderId]);
      setCurrentFolderId(id);
      setSelectedItemId(null);
    } else {
      // File opened for Editing / Reviewing (Notepad mode)
      setEditedFileId(id);
      setEditedFileName(item.name);
      setEditedContent(item.content || "");
    }
  };

  const handleNavigateBack = () => {
    if (folderHistory.length === 0) return;
    playBeep(750, 0.05);
    const prevFolder = folderHistory[folderHistory.length - 1];
    setFolderHistory((prev) => prev.slice(0, -1));
    setCurrentFolderId(prevFolder);
    setSelectedItemId(null);
  };

  const handleSaveFileContent = () => {
    if (!editedFileId) return;
    setIsSaving(true);
    playBeep(1200, 0.08);

    setTimeout(() => {
      setItems((prev) => ({
        ...prev,
        [editedFileId]: {
          ...prev[editedFileId],
          name: editedFileName,
          content: editedContent,
          size: `${Math.ceil(editedContent.length)} bytes`
        }
      }));
      setIsSaving(false);
      setEditedFileId(null);
    }, 600);
  };

  const handleCreateNewFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    playBeep(1000, 0.06);
    const fileId = "file_" + Date.now();
    const formattedName = newFileName.includes(".") ? newFileName : `${newFileName}.txt`;
    const extension = formattedName.split(".").pop() || "txt";

    const newItem: DiskItem = {
      id: fileId,
      name: formattedName,
      type: "file",
      extension,
      size: "0 bytes",
      content: "Empty document. Input your telemetry configurations here."
    };

    setItems((prev) => {
      const updatedFolder = {
        ...prev[currentFolderId],
        childrenIds: [...(prev[currentFolderId].childrenIds || []), fileId]
      };
      return {
        ...prev,
        [fileId]: newItem,
        [currentFolderId]: updatedFolder
      };
    });

    setNewFileName("");
    setIsCreatingFile(false);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id === "bio" || id === "career" || id === "skills_txt") {
      alert("System access alert: Protected core files cannot be deleted!");
      playBeep(400, 0.25);
      return;
    }

    if (confirm(`Confirm permanent deletion of system file: ${items[id]?.name}?`)) {
      playBeep(450, 0.15);
      setItems((prev) => {
        const copy = { ...prev };
        delete copy[id];

        // Also remove from parent children list
        copy[currentFolderId] = {
          ...copy[currentFolderId],
          childrenIds: (copy[currentFolderId].childrenIds || []).filter((childId) => childId !== id)
        };
        return copy;
      });
      setSelectedItemId(null);
    }
  };

  // Human readable path representation
  const getPathString = () => {
    if (currentFolderId === "root") return "C:\\";
    const pathParts = folderHistory.map((hId) => items[hId]?.name || hId).filter((n) => n !== "C:");
    pathParts.push(currentFolder.name);
    return "C:\\" + pathParts.join("\\");
  };

  return (
    <div className="w-full text-zinc-300 font-mono text-xs flex flex-col h-full min-h-[380px]">
      
      {/* File Explorer toolbar header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-cyan-500/10 mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleNavigateBack}
            disabled={folderHistory.length === 0}
            className={`p-1.5 rounded border border-zinc-800 bg-zinc-900 flex items-center justify-center transition cursor-pointer select-none ${
              folderHistory.length === 0 ? "opacity-35 cursor-not-allowed" : "hover:border-cyan-400 hover:text-cyan-400"
            }`}
            title="Go up one folder level"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <span className="text-[10px] text-zinc-500 font-bold tracking-widest pl-2">VIRTUAL_PATH:</span>
          <span className="text-cyan-400 font-bold bg-slate-900 border border-zinc-850 px-2 py-1 rounded text-[10px]">
            {getPathString()}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setIsCreatingFile(!isCreatingFile);
              playBeep(850, 0.05);
            }}
            className="px-2.5 py-1 bg-cyan-950 border border-cyan-500/20 hover:border-cyan-400 font-bold rounded text-[9px] tracking-wider text-cyan-400 hover:bg-cyan-900/40 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>CREATE_FILE</span>
          </button>
        </div>
      </div>

      {/* Toggle block for creating files */}
      {isCreatingFile && (
        <form onSubmit={handleCreateNewFileSubmit} className="mb-4 p-3 bg-zinc-950/80 rounded border border-cyan-500/10 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center space-x-2 flex-1">
            <span className="text-[9px] text-[#00f3ff] uppercase tracking-wide shrink-0">FILE NAME:</span>
            <input
              type="text"
              required
              autoFocus
              placeholder="config_patch.txt"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="bg-slate-900 border border-zinc-800 text-xs text-zinc-300 rounded px-2 py-1 focus:border-cyan-400 outline-none flex-1 font-sans"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="submit"
              className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-[10px] rounded hover:bg-cyan-500/40 font-bold border border-cyan-400/30"
            >
              APPROVE
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingFile(false)}
              className="px-3 py-1 bg-zinc-900 text-zinc-400 text-[10px] rounded hover:bg-zinc-800 border border-zinc-800"
            >
              CANCEL
            </button>
          </div>
        </form>
      )}

      {/* Main workspace layout */}
      <div className="flex-1 min-h-[220px] bg-slate-950/40 border border-zinc-900 rounded-lg p-2 overflow-y-auto max-h-[300px] scrollbar-thin">
        {childIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Folder className="w-10 h-10 text-zinc-700 animate-pulse mb-2" />
            <span className="text-zinc-600 text-[10px] uppercase">No files exist in this folder directory tree.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 divide-y divide-zinc-900/60 font-mono text-[11px]">
            {/* Folder list header labels */}
            <div className="flex items-center justify-between p-2 text-[9px] text-zinc-500 font-bold uppercase tracking-widest bg-zinc-900/20 border-b border-zinc-900">
              <span className="w-1/2">SYSTEM LABEL [NAME]</span>
              <span className="w-1/4 text-center">FILE SIZE</span>
              <span className="w-1/4 text-right">OPERATIONS</span>
            </div>

            {childIds.map((id) => {
              const item = items[id];
              if (!item) return null;
              const isSelected = selectedItemId === id;

              return (
                <div
                  key={id}
                  onClick={() => setSelectedItemId(id)}
                  onDoubleClick={() => handleOpenItem(id)}
                  className={`flex items-center justify-between p-2.5 transition select-none cursor-pointer rounded ${
                    isSelected ? "bg-cyan-950/20 border-l border-cyan-400 text-cyan-300" : "hover:bg-zinc-900/30"
                  }`}
                >
                  {/* File label / folder flag */}
                  <div className="flex items-center space-x-2.5 w-1/2 overflow-hidden pr-2">
                    {item.type === "directory" ? (
                      <Folder className="w-4 h-4 text-cyan-400/80 shrink-0" />
                    ) : (
                      <FileCode className="w-4 h-4 text-amber-500/80 shrink-0" />
                    )}
                    <span className="truncate font-bold tracking-wider">{item.name}</span>
                  </div>

                  {/* Size stamp */}
                  <span className="w-1/4 text-center text-[10px] text-zinc-500">
                    {item.size}
                  </span>

                  {/* Operations actions */}
                  <div className="w-1/4 flex items-center justify-end space-x-1">
                    <button
                      onClick={() => handleOpenItem(id)}
                      className="p-1 rounded bg-zinc-900 hover:bg-cyan-950 border border-zinc-800 text-zinc-400 hover:border-cyan-400/60 hover:text-cyan-400 transition"
                      title={item.type === "directory" ? "Browse Folder" : "Edit File / Open Code"}
                    >
                      {item.type === "directory" ? <ChevronRight className="w-3.5 h-3.5" /> : <Edit className="w-3.5 h-3.5" />}
                    </button>
                    {id !== "bio" && id !== "career" && id !== "skills_txt" ? (
                      <button
                        onClick={(e) => handleDeleteItem(id, e)}
                        className="p-1 rounded bg-red-950/50 hover:bg-red-900 border border-red-950/30 text-red-400 transition"
                        title="Delete system file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="w-[22px] h-[22px] border border-zinc-950/10 block rounded shrink-0 opacity-10" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FOOTER METRICS */}
      <div className="mt-4 p-2.5 bg-[#03060a] border border-zinc-900 rounded font-mono text-[9px] text-[#00f3ff] leading-relaxed select-none uppercase tracking-wider flex justify-between">
        <span>[CORE SECTOR STATUS]: CACHED STACKS RESPONDING</span>
        <span>INDEXED ASSET COUNT: {Object.keys(items).length}</span>
      </div>

      {/* NOTEPAD / TEXT EDITOR FULL SCREEN OVERLAY OVER EXPLORER WINDOW */}
      {editedFileId && (
        <div className="absolute inset-0 bg-slate-950/95 z-50 rounded-lg p-5 flex flex-col justify-between animate-fade-in border border-cyan-400 select-text">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center space-x-2">
              <File className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] text-zinc-500 uppercase font-black">EDITING PROTOCOL FILE:</span>
              <input
                type="text"
                value={editedFileName}
                onChange={(e) => setEditedFileName(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-xs text-[#00f3ff] font-bold font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => {
                setEditedFileId(null);
                playBeep(450, 0.05);
              }}
              className="text-zinc-500 hover:text-red-400 font-bold uppercase text-[10px] border border-zinc-850 px-2 py-1 rounded hover:border-red-500 transition cursor-pointer"
            >
              CLOSE
            </button>
          </div>

          {/* Interactive Text area */}
          <div className="flex-1 my-4">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-full min-h-[170px] bg-slate-900 rounded border border-zinc-850 focus:border-cyan-400 text-zinc-300 font-mono text-xs focus:outline-none p-4 leading-relaxed resize-none font-sans scrollbar-thin"
              placeholder="Provide document content logs..."
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[8px] text-zinc-600 block uppercase tracking-wider">
              TOTAL FILE FOOTPRINT: {editedContent.length} BYTES
            </span>

            <button
              onClick={handleSaveFileContent}
              disabled={isSaving}
              className="px-4 py-1.5 bg-cyan-950 hover:bg-cyan-900/60 border border-cyan-400 text-[#00f3ff] rounded font-bold transition text-[10px] tracking-widest flex items-center gap-1.5 cursor-pointer uppercase"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "SAVING..." : "COMMIT_CHANGES"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
