"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";

interface ImpactCardProps {
  totalRides: number;
  totalCO2: number;
  trees: number;
  streak: number;
  onClose: () => void;
}

export default function ImpactCard({
  totalRides,
  totalCO2,
  trees,
  streak,
  onClose,
}: ImpactCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = "my-bike-hero-impact.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm">
        {/* The shareable card — this is what gets exported */}
        <div
          ref={cardRef}
          className="rounded-3xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-8 text-white shadow-2xl"
        >
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <span className="text-4xl">🚴</span>
            <div>
              <p className="text-lg font-extrabold leading-tight">Bike Hero</p>
              <p className="text-xs text-green-100">My Impact Report</p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl bg-white/20 p-4">
              <p className="text-xs text-green-100 font-medium mb-1">Total Rides</p>
              <p className="text-3xl font-extrabold">{totalRides}</p>
              <p className="text-xs text-green-100">🚲 rides logged</p>
            </div>
            <div className="rounded-2xl bg-white/20 p-4">
              <p className="text-xs text-green-100 font-medium mb-1">CO₂ Saved</p>
              <p className="text-3xl font-extrabold">{totalCO2.toFixed(1)}</p>
              <p className="text-xs text-green-100">🌿 kg total</p>
            </div>
            <div className="rounded-2xl bg-white/20 p-4">
              <p className="text-xs text-green-100 font-medium mb-1">Trees Equiv.</p>
              <p className="text-3xl font-extrabold">{trees.toFixed(1)}</p>
              <p className="text-xs text-green-100">🌳 trees/year</p>
            </div>
            <div className="rounded-2xl bg-white/20 p-4">
              <p className="text-xs text-green-100 font-medium mb-1">Best Streak</p>
              <p className="text-3xl font-extrabold">{streak}</p>
              <p className="text-xs text-green-100">🔥 days</p>
            </div>
          </div>

          {/* Footer */}
          <div className="rounded-xl bg-white/10 px-4 py-3 text-center text-xs text-green-100">
            Every km counts — keep riding! 💚
          </div>
        </div>

        {/* Action buttons — outside the exported card */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-bold text-green-600 shadow transition hover:bg-green-50 disabled:opacity-60"
          >
            {downloading ? "Saving…" : "⬇ Download as Image"}
          </button>
        </div>
      </div>
    </div>
  );
}
