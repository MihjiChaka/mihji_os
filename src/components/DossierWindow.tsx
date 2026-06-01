import React, { useRef, useState, useEffect } from "react";
import { Minus, Square, X, Move } from "lucide-react";

interface DossierWindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  initialX: number;
  initialY: number;
  width: string | number;
  height: string | number;
  onFocus: (bypassCentering?: boolean) => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  onPositionChange?: (x: number, y: number) => void;
  children: React.ReactNode;
}

export default function DossierWindow({
  id,
  title,
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  initialX,
  initialY,
  width,
  height,
  onFocus,
  onMinimize,
  onMaximize,
  onClose,
  onPositionChange,
  children
}: DossierWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  
  // Keep refs to avoid stale closures in event listeners
  const positionRef = useRef(position);
  positionRef.current = position;

  const isDraggingRef = useRef(isDragging);
  isDraggingRef.current = isDragging;

  const dragStartRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);

  const onPositionChangeRef = useRef(onPositionChange);
  onPositionChangeRef.current = onPositionChange;

  const onFocusRef = useRef(onFocus);
  onFocusRef.current = onFocus;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync position state with props when initial coordinates are updated
  useEffect(() => {
    if (!isDraggingRef.current) {
      setPosition({ x: initialX, y: initialY });
    }
  }, [initialX, initialY]);

  // Handle drag initiation
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMaximized) return;
    // On mouse down, active focus without centering to prevent snapping mid-drag
    onFocusRef.current(true);
    
    // Only drag with left click to avoid interfere with context menus
    if (e.button !== 0) return;

    setIsDragging(true);
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    
    dragStartRef.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y
    };
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      
      hasDraggedRef.current = true;
      // Constrain window inside the viewport. Header constraint (y >= 48) protects header from disappearing behind the top 46px system header
      const newX = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragStartRef.current.x));
      const newY = Math.max(48, Math.min(window.innerHeight - 80, e.clientY - dragStartRef.current.y));
      
      setPosition({ x: newX, y: newY });
      if (onPositionChangeRef.current) {
        onPositionChangeRef.current(newX, newY);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        setIsDragging(false);
        isDraggingRef.current = false;
        // Keep a short timeout to clear hasDraggedRef to prevent the raw onClick handler from triggering center immediately after dragging release
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 50);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const windowStyle: React.CSSProperties = isMaximized
    ? {
        position: "fixed",
        top: "60px",
        left: "20px",
        right: "20px",
        bottom: "75px",
        zIndex: zIndex
      }
    : {
        position: "fixed",
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        zIndex: zIndex
      };

  if (!isOpen || isMinimized) return null;

  return (
    <div
      ref={windowRef}
      style={windowStyle}
      onClick={() => {
        // Only trigger centering on a clean click, bypass if dragging just took place
        const shouldBypass = hasDraggedRef.current;
        onFocusRef.current(shouldBypass);
      }}
      className={`dossier-window pointer-events-auto flex flex-col rounded-lg bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 shadow-2xl overflow-hidden ${
        isDragging ? "transition-none" : "transition-all duration-150"
      } ${
        isMaximized ? "shadow-cyan-500/5 animate-fade-in" : "shadow-cyan-950/40 hover:border-cyan-400"
      }`}
    >
      {/* OS Top Navigation Card Header */}
      <div
        onMouseDown={handleDragStart}
        className={`flex items-center justify-between px-3.5 py-2.5 border-b border-cyan-500/10 cursor-grab active:cursor-grabbing select-none bg-slate-900/80 ${
          isDragging ? "bg-cyan-950/20" : ""
        }`}
      >
        <div className="flex items-center space-x-2.5">
          <Move className="w-3.5 h-3.5 text-cyan-500 opacity-60 pointer-events-none" />
          <span className="text-[10px] md:text-xs font-mono tracking-widest uppercase font-bold text-cyan-300">
            {title}
          </span>
        </div>

        {/* Action Window Switches */}
        <div className="flex items-center space-x-2">
          {/* Minimize button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="p-1 rounded bg-zinc-900 border border-zinc-800 hover:border-cyan-400 hover:text-cyan-400 text-zinc-400 cursor-pointer transition select-none"
            title="Minimize window"
          >
            <Minus className="w-3 h-3" />
          </button>

          {/* Maximize button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
            className="p-1 rounded bg-zinc-900 border border-zinc-800 hover:border-cyan-400 hover:text-cyan-400 text-zinc-400 cursor-pointer transition select-none"
            title="Maximize window"
          >
            <Square className="w-3 h-3" />
          </button>

          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 rounded bg-red-950/50 border border-red-900/40 hover:bg-red-500 hover:text-white text-red-400 cursor-pointer transition select-none"
            title="Close window"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Internal View scroll */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 text-sm font-sans text-zinc-300 leading-normal scrollbar-thin">
        {children}
      </div>

    </div>
  );
}
