import { useEffect, useRef } from "react";

interface Node {
  id: number;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  originalX: number;
  originalY: number;
}

interface Packet {
  from: Node;
  to: Node;
  progress: number;
  speed: number;
}

const CONST_LABELS = [
  "Cisco CCNP", "CCNA", "Laravel", "ASP.NET Core", "C# .NET",
  "PostgreSQL", "MongoDB", "Docker", "DevOps", "BGP / OSPF",
  "Azure Data", "Security", "SmartCare HMIS", "API Gateway"
];

interface CanvasNetworkBgProps {
  themeColor?: string; // e.g. "#00f3ff"
  wallpaperMode?: string; // "network" | "starfield" | "minimal"
}

export default function CanvasNetworkBg({ themeColor = "#00f3ff", wallpaperMode = "network" }: CanvasNetworkBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Parse theme to RGB values for transparency settings
    const hexToRgb = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : { r: 0, g: 243, b: 255 };
    };

    const rgb = hexToRgb(themeColor);

    // Initial node layouts
    const nodes: Node[] = [];
    const count = wallpaperMode === "starfield" ? 80 : 35; // More static nodes for starfield
    for (let i = 0; i < count; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const hasLabel = wallpaperMode === "network" ? Math.random() < 0.35 : false;
      const label = hasLabel ? CONST_LABELS[Math.floor(Math.random() * CONST_LABELS.length)] : "";
      
      const sizeValue = wallpaperMode === "starfield" 
        ? Math.random() * 2 
        : (hasLabel ? 5 : 2.5);

      nodes.push({
        id: i,
        label,
        x: rx,
        y: ry,
        vx: wallpaperMode === "starfield" ? 0 : (Math.random() - 0.5) * 0.4,
        vy: wallpaperMode === "starfield" ? 0 : (Math.random() - 0.5) * 0.4,
        size: sizeValue,
        color: wallpaperMode === "starfield" 
          ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.random() * 0.7 + 0.1})`
          : (hasLabel ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.75)` : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`),
        originalX: rx,
        originalY: ry
      });
    }

    // Packet tracking
    const packets: Packet[] = [];
    const maxPackets = 15;

    const findNeighbors = (node: Node) => {
      if (wallpaperMode !== "network") return [];
      return nodes
        .filter((n) => n.id !== node.id)
        .map((n) => {
          const dx = n.x - node.x;
          const dy = n.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          return { n, dist };
        })
        .filter((item) => item.dist < 180)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3)
        .map((item) => item.n);
    };

    const spawnPacket = () => {
      if (wallpaperMode !== "network") return;
      if (packets.length >= maxPackets || nodes.length < 2) return;
      const source = nodes[Math.floor(Math.random() * nodes.length)];
      const neighbors = findNeighbors(source);
      if (neighbors.length > 0) {
        const dest = neighbors[Math.floor(Math.random() * neighbors.length)];
        packets.push({
          from: source,
          to: dest,
          progress: 0,
          speed: 0.005 + Math.random() * 0.012
        });
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Animation Loop
    const draw = () => {
      ctx.fillStyle = "rgba(4, 7, 13, 1)";
      ctx.fillRect(0, 0, width, height);

      // Render futuristic network scan grid lines
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.025)`;
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Physics updating and link lines
      const mouse = mouseRef.current;
      ctx.lineWidth = 0.8;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        
        // Drift movement
        n.x += n.vx;
        n.y += n.vy;

        // Bounce on borders
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Cursor attraction magnetism (only if in network/starfield mode)
        if (mouse.active && wallpaperMode !== "minimal") {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            n.x -= (dx / dist) * force * 1.5;
            n.y -= (dy / dist) * force * 1.5;
          }
        }

        // Draw connections for network mode
        if (wallpaperMode === "network") {
          const neighbors = findNeighbors(n);
          neighbors.forEach((neigh) => {
            const dx = neigh.x - n.x;
            const dy = neigh.y - n.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const alpha = Math.max(0, 1 - dist / 180) * 0.18;
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(neigh.x, neigh.y);
            ctx.stroke();
          });
        }
      }

      // Spawns routing packets
      if (wallpaperMode === "network" && Math.random() < 0.12) spawnPacket();

      // Render routing packets (data bursts)
      if (wallpaperMode === "network") {
        for (let i = packets.length - 1; i >= 0; i--) {
          const p = packets[i];
          p.progress += p.speed;
          
          if (p.progress >= 1) {
            packets.splice(i, 1);
            continue;
          }

          const currX = p.from.x + (p.to.x - p.from.x) * p.progress;
          const currY = p.from.y + (p.to.y - p.from.y) * p.progress;

          // Glowing packet dot
          ctx.beginPath();
          ctx.arc(currX, currY, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.95)`;
          ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      }

      // Draw all nodes and labels (only in network or random twinkle for starfield)
      if (wallpaperMode !== "minimal") {
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          
          // twinkle starfield naturally
          if (wallpaperMode === "starfield" && Math.random() < 0.05) {
            n.color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.random() * 0.70 + 0.15})`;
          }

          ctx.beginPath();
          ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
          ctx.fillStyle = n.color;
          if (wallpaperMode === "network" && n.size > 4) {
            ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
            ctx.shadowBlur = 4;
          }
          ctx.fill();
          ctx.shadowBlur = 0;

          // Label rendering (only network mode)
          if (wallpaperMode === "network" && n.label) {
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.65)`;
            ctx.font = "9px monospace";
            ctx.fillText(n.label, n.x + 8, n.y + 3);
            
            // Microscopic hardware circle indicator
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`;
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.size + 3, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      // Draw static border grid coordinates to elevate desktop operating system look
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`;
      ctx.lineWidth = 1;
      ctx.font = "8px monospace";
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;
      ctx.fillText("DEV_GW: CHIPATA_EAST_ZMH", 30, 80);
      ctx.fillText("CCNP_CORE_OSPF_OK", 30, 95);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [themeColor, wallpaperMode]);

  return (
    <canvas
      id="sys-matrix-canvas"
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full block -z-40 pointer-events-none"
    />
  );
}
