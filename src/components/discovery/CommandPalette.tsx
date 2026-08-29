"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Cpu, FileText, Server, Layers, ArrowUpRight } from "lucide-react";
import { ENTITIES } from "@/lib/data/dataset";
import { useEpochStore } from "@/lib/store/useEpochStore";
import { Entity } from "@/types/schema";

export function CommandPalette() {
  const isSearchOpen = useEpochStore((s) => s.isSearchOpen);
  const setSearchOpen = useEpochStore((s) => s.setSearchOpen);
  const selectEntity = useEpochStore((s) => s.selectEntity);
  const isEntered = useEpochStore((s) => s.isEntered);
  const enterEpoch = useEpochStore((s) => s.enterEpoch);

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      } else if (e.key === "Escape" && isSearchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  // Focus input on open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isSearchOpen]);

  // Search filtering
  const results = useMemo(() => {
    if (!query.trim()) return ENTITIES.slice(0, 10);
    const q = query.toLowerCase();
    return ENTITIES.filter((entity) => {
      const matchName = entity.name.toLowerCase().includes(q);
      const matchCreator = (entity.creator_name || entity.creator)
        .toLowerCase()
        .includes(q);
      const matchCategory = entity.category.toLowerCase().includes(q);
      const matchFamily = entity.model_family?.toLowerCase().includes(q);
      const matchArch = entity.architecture?.type.toLowerCase().includes(q);
      const matchAlias = entity.aliases?.some((a) => a.toLowerCase().includes(q));
      return (
        matchName ||
        matchCreator ||
        matchCategory ||
        matchFamily ||
        matchArch ||
        matchAlias
      );
    });
  }, [query]);

  const handleSelect = (entity: Entity) => {
    if (!isEntered) enterEpoch();
    selectEntity(entity.id);
    setSearchOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "hardware":
        return <Server className="w-4 h-4 text-emerald-400" />;
      case "paper":
      case "concept":
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case "architecture":
      case "algorithm":
        return <Layers className="w-4 h-4 text-purple-400" />;
      default:
        return <Cpu className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md"
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden font-sans"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-800/80">
              <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search models, architectures, papers, hardware, creators..."
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none font-mono"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-900">
              {results.length === 0 ? (
                <div className="p-8 text-center text-sm font-mono text-slate-400">
                  No matching entities found for &quot;{query}&quot;
                </div>
              ) : (
                results.map((entity, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={entity.id}
                      onClick={() => handleSelect(entity)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-slate-900 border border-cyan-500/30"
                          : "hover:bg-slate-900/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
                          {getEntityIcon(entity.type)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-semibold text-sm text-slate-100 truncate">
                              {entity.name}
                            </span>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {entity.type.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5 font-sans">
                            {entity.creator_name || entity.creator} • {entity.category} (
                            {entity.release_date.split("-")[0]})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 ml-4">
                        <span className="text-xs font-mono text-cyan-400 flex items-center space-x-1">
                          <span>Target</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Keyboard Hints */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/50 border-t border-slate-900 text-[11px] font-mono text-slate-400">
              <div className="flex items-center space-x-3">
                <span>↑↓ Navigate</span>
                <span>↵ Inspect</span>
                <span>ESC Close</span>
              </div>
              <div>{results.length} results</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
