import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Shield, Server, Wifi, Cpu, Layers, Terminal as TermIcon, TerminalSquare } from "lucide-react";

interface RouterNode {
  id: string;
  name: string;
  ip: string;
  role: string;
  status: "ACTIVE" | "OFFLINE" | "FILTERED";
  interface: string;
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
  bandwidth: string;
  cost: number;
}

const CONST_NODES: RouterNode[] = [
  { id: "R1", name: "CHIPATA-HQ-GW", ip: "10.15.10.1", role: "HQ Gateway", status: "ACTIVE", interface: "Gig0/0/1", x: 10, y: 50 },
  { id: "R2", name: "CCNP-CORE-R1", ip: "10.15.0.254", role: "OSPF Core Router", status: "ACTIVE", interface: "Gig0/0/0", x: 45, y: 20 },
  { id: "R3", name: "SECURE-ASA-FW", ip: "172.16.50.1", role: "Security Adaptive Appliance", status: "ACTIVE", interface: "Ten0/1/1", x: 45, y: 80 },
  { id: "R4", name: "MALAWI-VACC-DB", ip: "192.168.20.44", role: "C# Database Terminal", status: "ACTIVE", interface: "Fas0/24", x: 85, y: 15 },
  { id: "R5", name: "FIELD-WLC-HUB", ip: "10.15.30.5", role: "Wireless LAN Controller", status: "ACTIVE", interface: "Gig0/0/2", x: 85, y: 80 }
];

const CONST_CONNECTIONS: Connection[] = [
  { from: "R1", to: "R2", bandwidth: "10 Gbps", cost: 10 },
  { from: "R1", to: "R3", bandwidth: "1 Gbps", cost: 100 },
  { from: "R2", to: "R4", bandwidth: "100 Mbps", cost: 1000 },
  { from: "R2", to: "R5", bandwidth: "1 Gbps", cost: 100 },
  { from: "R3", to: "R5", bandwidth: "10 Gbps", cost: 10 },
  { from: "R4", to: "R5", bandwidth: "1 Gbps", cost: 100 }
];

export default function CiscoSandbox() {
  const [protocol, setProtocol] = useState<"OSPF" | "BGP" | "STATIC">("OSPF");
  const [sourceNode, setSourceNode] = useState<string>("R1");
  const [destNode, setDestNode] = useState<string>("R4");
  const [isPinging, setIsPinging] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "CCNP-CORE-R1# show ip route",
    "Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP",
    "       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area",
    "O*E2  0.0.0.0/0 [110/1] via 10.15.10.1, 04:32:15, GigabitEthernet0/0/1",
    "O     192.168.20.0/24 [110/1010] via 10.15.0.254, 02:40:55, CoreLink-1",
    "System matrix active. Select endpoints above to simulate routing path maps."
  ]);
  const [packetProgress, setPacketProgress] = useState<number | null>(null);
  const [pathNodes, setPathNodes] = useState<string[]>([]);

  // Calculate shortest path utilizing customized cost criteria based on selected routing protocol
  const computeRoute = (start: string, end: string, proto: "OSPF" | "BGP" | "STATIC") => {
    // Basic Dijkstra or direct search
    const queue = [start];
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};

    CONST_NODES.forEach((node) => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
    });
    distances[start] = 0;

    while (queue.length > 0) {
      // Sort based on routing adjustments
      queue.sort((a, b) => distances[a] - distances[b]);
      const curr = queue.shift()!;

      if (curr === end) break;

      // Find connections
      const connected = CONST_CONNECTIONS.filter((c) => c.from === curr || c.to === curr);
      connected.forEach((conn) => {
        const neighbor = conn.from === curr ? conn.to : conn.from;
        
        let pathCost = conn.cost;
        if (proto === "BGP") {
          // BGP path cost relies on AS hops (uniform cost here)
          pathCost = 1; 
        } else if (proto === "STATIC") {
          // Static routing overrides specific nodes, prioritizing secure path ASA (R3)
          if (neighbor === "R3") pathCost = 5;
          if (neighbor === "R2") pathCost = 500;
        }

        const alt = distances[curr] + pathCost;
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = curr;
          if (!queue.includes(neighbor)) {
            queue.push(neighbor);
          }
        }
      });
    }

    // Trace route backwards
    const path: string[] = [];
    let current: string | null = end;
    while (current) {
      path.unshift(current);
      current = previous[current];
    }
    return path;
  };

  const handlePing = () => {
    if (sourceNode === destNode) {
      setTerminalLogs((prev) => [
        ...prev,
        `CCNP-CORE-R1# ping ${CONST_NODES.find((n) => n.id === sourceNode)?.ip}`,
        `Type escape sequence to abort.`,
        `Ping status: SUCCESS. Loopback response active (0ms).`
      ]);
      return;
    }

    setIsPinging(true);
    setPacketProgress(0);
    const computedPath = computeRoute(sourceNode, destNode, protocol);
    setPathNodes(computedPath);

    const fromNode = CONST_NODES.find((n) => n.id === sourceNode);
    const toNode = CONST_NODES.find((n) => n.id === destNode);

    setTerminalLogs((prev) => [
      ...prev,
      `[ADMIN-COMMAND] CCNA-CLI# traceroute to ${toNode?.name} (${toNode?.ip}) via protocol:${protocol}...`,
      `Traceroute packet created (TTL: 64, Payload: 56 bytes)`
    ]);

    // Animate packet step by step
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setPacketProgress((prev) => (prev !== null ? prev + 35 : 35));

      if (step < computedPath.length) {
        const currentNode = CONST_NODES.find((n) => n.id === computedPath[step]);
        const prevNode = CONST_NODES.find((n) => n.id === computedPath[step - 1]);
        setTerminalLogs((prev) => [
          ...prev,
          `  Hop #${step}: passing ${prevNode?.name} -> ${currentNode?.name} [${currentNode?.ip}]  (Metric cost: OSPF-110/${step * 10})`
        ]);
      }

      if (step >= computedPath.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          setIsPinging(false);
          setPacketProgress(null);
          setTerminalLogs((prev) => [
            ...prev,
            `Ping sequence completed.`,
            `Success rate is 100 percent (5/5), round-trip min/avg/max = 4/8/12 ms`,
            `Cisco-Topology Status: ROUTE RESOLVED OVER ${protocol} LINK NETWORK.`
          ]);
        }, 400);
      }
    }, 600);
  };

  const activePath = computeRoute(sourceNode, destNode, protocol);

  return (
    <div className="flex flex-col lg:flex-row gap-5 p-4 bg-zinc-950/40 backdrop-blur-md rounded-lg border border-cyan-500/20 shadow-lg shadow-cyan-900/10">
      
      {/* Topology map Panel */}
      <div className="flex-1 min-h-[300px] h-[350px] bg-slate-950/90 border border-cyan-500/10 rounded p-4 relative overflow-hidden select-none">
        
        {/* Futuristic Dashboard grid metrics */}
        <div className="absolute top-2 left-3 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-cyan-400">CISCO TOPOLOGY RESOLVER V3</span>
        </div>

        <div className="absolute top-2 right-3 flex items-center space-x-1 font-mono text-[9px] text-zinc-400 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-700/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1"></span>
          <span>ROUTING PROTOCOL: {protocol}</span>
        </div>

        {/* Connections Layer (Lines) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>
            <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#00f3ff" />
            </marker>
          </defs>

          {CONST_CONNECTIONS.map((conn, idx) => {
            const nodeFrom = CONST_NODES.find((n) => n.id === conn.from)!;
            const nodeTo = CONST_NODES.find((n) => n.id === conn.to)!;
            
            // Check if connection is part of the currently active simulated path
            const fromIndexInPath = activePath.indexOf(conn.from);
            const toIndexInPath = activePath.indexOf(conn.to);
            const isPath = fromIndexInPath !== -1 && toIndexInPath !== -1 && Math.abs(fromIndexInPath - toIndexInPath) === 1;

            return (
              <g key={idx}>
                <line
                  x1={`${nodeFrom.x}%`}
                  y1={`${nodeFrom.y}%`}
                  x2={`${nodeTo.x}%`}
                  y2={`${nodeTo.y}%`}
                  stroke={isPath ? "#00f3ff" : "rgba(0, 243, 255, 0.15)"}
                  strokeWidth={isPath ? "2.5" : "1"}
                  className={isPath ? "stroke-cyan-400 drop-shadow-[0_0_8px_rgba(0,243,255,1)]" : ""}
                />
              </g>
            );
          })}
        </svg>

        {/* Visual Nodes mapping */}
        {CONST_NODES.map((node) => {
          const isSource = sourceNode === node.id;
          const isDest = destNode === node.id;
          const isInPath = activePath.includes(node.id);

          let NodeIcon = Cpu;
          if (node.id === "R1") NodeIcon = Layers;
          if (node.id === "R3") NodeIcon = Shield;
          if (node.id === "R4") NodeIcon = Server;
          if (node.id === "R5") NodeIcon = Wifi;

          return (
            <div
              key={node.id}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer"
              onClick={() => {
                if (!isPinging) {
                  if (activePath[0] === node.id) return; // ignore clicking same
                  if (!isSource) {
                    setDestNode(node.id);
                  } else {
                    setSourceNode(node.id);
                  }
                }
              }}
            >
              {/* Interaction ring glow */}
              <div className={`p-2.5 rounded-full border transition-all duration-300 ${
                isSource 
                  ? "bg-cyan-950/95 border-cyan-400 scale-110 shadow-lg shadow-cyan-500/20" 
                  : isDest 
                  ? "bg-blue-950/95 border-blue-400 scale-110 shadow-lg shadow-blue-500/20"
                  : isInPath
                  ? "bg-zinc-900 border-cyan-500/80 scale-105"
                  : "bg-zinc-950/90 border-zinc-700/80 hover:border-cyan-400"
              }`}>
                <NodeIcon className={`w-5 h-5 ${
                  isSource ? "text-cyan-400 animate-pulse" : isDest ? "text-blue-400 animate-bounce" : "text-zinc-400"
                }`} />
              </div>

              {/* Status Indicator Beacon */}
              <span className={`absolute top-0 right-0 w-2.5 h-2.5 rounded-full border border-black ${
                node.status === "ACTIVE" ? "bg-emerald-500 animate-pulse" : "bg-red-500"
              }`} />

              {/* Floating Node Data */}
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-zinc-950/85 px-2 py-1 rounded text-center border border-zinc-800 pointer-events-none group-hover:block transition shadow-md">
                <p className="text-[9px] font-bold font-mono text-zinc-200">{node.name}</p>
                <p className="text-[8px] font-mono text-cyan-400">{node.ip} ({node.interface})</p>
                <p className="text-[8px] font-mono text-zinc-500">{node.role}</p>
              </div>
            </div>
          );
        })}

        {/* Bottom controls panel */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-zinc-400 bg-zinc-950/90 py-1.5 px-3 rounded border border-zinc-800">
          <div>
            <span className="text-zinc-500">SOURCE: </span>
            <span className="text-cyan-400 font-bold">{CONST_NODES.find((n) => n.id === sourceNode)?.name}</span>
          </div>
          <div>
            <span className="text-zinc-500">DESTINATION: </span>
            <span className="text-blue-400 font-bold">{CONST_NODES.find((n) => n.id === destNode)?.name}</span>
          </div>
        </div>

      </div>

      {/* Control console panel */}
      <div className="w-full lg:w-72 bg-zinc-950 border border-cyan-500/10 rounded overflow-hidden flex flex-col justify-between p-3 min-h-[350px]">
        
        {/* Header selections */}
        <div>
          <h4 className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-bold mb-3 flex items-center gap-1">
            <TerminalSquare className="w-4 h-4" /> Topo Configuration
          </h4>

          {/* Protocols select */}
          <div className="mb-4">
            <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Select Core Routing Engine:</span>
            <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-1 rounded border border-zinc-800">
              {(["OSPF", "BGP", "STATIC"] as const).map((proto) => (
                <button
                  key={proto}
                  disabled={isPinging}
                  onClick={() => {
                    setProtocol(proto);
                    setTerminalLogs((prev) => [
                      ...prev,
                      `CCNP-CORE-R1(config)# router ${proto === "OSPF" ? "ospf 10" : proto === "BGP" ? "bgp 65001" : "static-route"}`,
                      `Applying metrics parameters. Path costs updated dynamically.`
                    ]);
                  }}
                  className={`text-[9px] font-mono font-bold py-1 rounded select-none cursor-pointer transition ${
                    protocol === proto 
                      ? "bg-cyan-500 text-black text-shadow-none" 
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/80"
                  }`}
                >
                  {proto}
                </button>
              ))}
            </div>
            <p className="text-[8px] font-mono text-zinc-500 mt-1.5 leading-normal">
              {protocol === "OSPF" && "OSPF Cost Matrix: Calculates bandwidth parameters. Lowest cumulative link cost determines priority."}
              {protocol === "BGP" && "BGP AS-Path: Routing optimization depends directly on Autonomous System hop weights."}
              {protocol === "STATIC" && "Static Redundant Override: Configured manual pathways favoring Secure-ASA-FW node."}
            </p>
          </div>

          {/* Source node select */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <span className="text-[8px] font-mono text-zinc-500 uppercase">Packet Source IP:</span>
              <select
                disabled={isPinging}
                value={sourceNode}
                onChange={(e) => setSourceNode(e.target.value)}
                className="w-full bg-zinc-900 text-[10px] font-mono text-zinc-300 py-1 px-1 rounded border border-zinc-800 focus:outline-none focus:border-cyan-500"
              >
                {CONST_NODES.map((n) => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </select>
            </div>

            <div>
              <span className="text-[8px] font-mono text-zinc-500 uppercase">Target Node Host:</span>
              <select
                disabled={isPinging}
                value={destNode}
                onChange={(e) => setDestNode(e.target.value)}
                className="w-full bg-zinc-900 text-[10px] font-mono text-zinc-300 py-1 px-1 rounded border border-zinc-800 focus:outline-none focus:border-cyan-500"
              >
                {CONST_NODES.map((n) => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cisco Terminal interface */}
        <div className="flex-1 bg-black/95 p-2 border border-zinc-800 rounded font-mono text-[8px] overflow-y-auto leading-normal h-36 select-text text-zinc-300">
          <div className="flex items-center space-x-1 border-b border-zinc-900 pb-1 mb-1.5 opacity-80">
            <TermIcon className="w-3 h-3 text-cyan-400" />
            <span className="text-[7px] text-zinc-500 tracking-wider">Cisco ASA v9.16(2) console printout</span>
          </div>
          {terminalLogs.map((log, idx) => (
            <div key={idx} className={log.startsWith("  ") ? "text-cyan-400/90 pl-1" : log.includes("SUCCESS") || log.includes("completed") ? "text-emerald-400" : "text-zinc-400"}>
              {log}
            </div>
          ))}
        </div>

        {/* Simulator controls */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-zinc-900">
          <button
            disabled={isPinging}
            onClick={handlePing}
            className="flex items-center justify-center gap-1.5 bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-mono text-[10px] py-1.5 rounded font-bold cursor-pointer hover:bg-cyan-900/60 disabled:opacity-50 transition"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isPinging ? "ROUTING..." : "TEST ROUTE"}</span>
          </button>

          <button
            disabled={isPinging}
            onClick={() => {
              setTerminalLogs([
                "CCNP-CORE-R1# show ip route",
                "System metrics reset. Terminal interface cleared."
              ]);
              setSourceNode("R1");
              setDestNode("R4");
            }}
            className="flex items-center justify-center gap-1.5 bg-zinc-900 text-zinc-400 border border-zinc-800 font-mono text-[10px] py-1.5 rounded cursor-pointer hover:bg-zinc-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>

      </div>

    </div>
  );
}
