"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Compass, Search, GitBranch, ArrowRight } from "lucide-react";
import { useEpochStore } from "@/lib/store/useEpochStore";

export function LandingOverlay() {
  const isEntered = useEpochStore((s) => s.isEntered);
  const enterEpoch = useEpochStore((s) => s.enterEpoch);

  return (
    <AnimatePresence>
      {!isEntered && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-between p-8 bg-[#030609]/90 backdrop-blur-md text-white select-none pointer-events-auto"
        >
          {/* Top Status Mark */}
          <div className="w-full flex items-center justify-between text-xs tracking-widest text-slate-400 font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>SYSTEM ONLINE // ARCHITECTURE V2</span>
            </div>
            <span>3D KNOWLEDGE GRAPH</span>
          </div>

          {/* Center Brand Hero */}
          <div className="max-w-2xl text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 text-xs font-mono tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              <span>THE EXPLORABLE 3D ARCHIVE OF ARTIFICIAL INTELLIGENCE</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500">
              SILICON EPOCH
            </h1>

            <p className="text-sm md:text-base text-slate-300 font-sans leading-relaxed max-w-xl mx-auto">
              Travel across eight decades of computing evolution. Research
              breakthroughs, neural architectures, hardware accelerators, and
              frontier foundation models rendered as physical silicon modules on a
              massive navigable motherboard.
            </p>

            {/* Enter Button */}
            <div className="pt-4">
              <button
                onClick={enterEpoch}
                className="group relative inline-flex items-center space-x-3 px-8 py-3.5 rounded-lg border border-cyan-400/50 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white font-mono text-sm tracking-wider transition-all duration-300 shadow-[0_0_25px_-5px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_0px_rgba(0,240,255,0.6)]"
              >
                <span>ENTER THE EPOCH</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Bottom Interaction Guide Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl pt-8 border-t border-slate-800/80 text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-2.5 p-2.5 rounded bg-slate-900/50 border border-slate-800">
              <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-slate-200 font-semibold">The Glide</div>
                <div className="text-[11px] text-slate-400">Scroll or Drag to travel time</div>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 p-2.5 rounded bg-slate-900/50 border border-slate-800">
              <Cpu className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-slate-200 font-semibold">Exploded CAD</div>
                <div className="text-[11px] text-slate-400">Click node for physical teardown</div>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 p-2.5 rounded bg-slate-900/50 border border-slate-800">
              <GitBranch className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-slate-200 font-semibold">Lineage Traces</div>
                <div className="text-[11px] text-slate-400">Follow architectural influence</div>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 p-2.5 rounded bg-slate-900/50 border border-slate-800">
              <Search className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <div className="text-slate-200 font-semibold">Command Jump</div>
                <div className="text-[11px] text-slate-400">Press ⌘K to search all entities</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
