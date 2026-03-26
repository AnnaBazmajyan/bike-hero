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

  function handleLinkedInShare() {
    const flights = Math.round(totalCO2 / 250); // Cologne-Berlin flight ~250kg CO₂
    
    const text = `🚴 MY CLIMATE IMPACT THIS MONTH 🌍

I saved ${totalCO2.toFixed(1)}kg of CO₂ by biking to work this month!

That's equivalent to:
🌳 ${trees.toFixed(1)} trees planted
✈️ ${flights} flight${flights !== 1 ? 's' : ''} offset
🚴 ${totalRides} ride${totalRides !== 1 ? 's' : ''} completed
🔥 ${streak} day streak!

Small changes add up. Who's ready to join the movement?

#BikeToWork #Sustainability #ClimateAction #Eurorad

Calculate your impact: https://bike-hero.vercel.app`;

    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://eurorad.vercel.app')}&summary=${encodeURIComponent(text)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md">
        {/* The shareable card — compact design */}
        <div
          ref={cardRef}
          className="rounded-3xl p-8 shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
            <div className="text-white text-center">
              <div className="text-4xl mb-2">🚴</div>
              <h2 className="text-2xl font-bold mb-1">MY CLIMATE IMPACT</h2>
              <div className="text-xs opacity-90">This Month</div>
            </div>
          </div>

          {/* Main Stat */}
          <div className="bg-white rounded-2xl p-6 mb-4 text-center shadow-xl">
            <div className="text-gray-600 text-sm mb-1">I saved</div>
            <div 
              className="text-5xl font-bold mb-1"
              style={{
                background: 'linear-gradient(to right, #10b981, #059669)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {totalCO2.toFixed(1)}kg
            </div>
            <div className="text-gray-500 text-xs">by biking to work</div>
          </div>

          {/* Impact Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-3xl mb-1">🌳</div>
              <div className="text-white font-bold text-lg">{trees.toFixed(0)}</div>
              <div className="text-white/80 text-xs">trees planted</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-3xl mb-1">✈️</div>
              <div className="text-white font-bold text-lg">{Math.round(totalCO2 / 250)}</div>
              <div className="text-white/80 text-xs">flights offset</div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-white/90 text-xs mb-1">Join the movement</div>
            <div className="text-white font-semibold text-base">#BikeToWork</div>
            <div className="text-white/70 text-[10px] mt-2">powered by eurorad</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 space-y-3">
          <button
            onClick={handleLinkedInShare}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow transition transform hover:-translate-y-0.5"
          >
            💼 Share on LinkedIn
          </button>
          
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full rounded-xl bg-green-500 hover:bg-green-600 px-4 py-3 text-sm font-bold text-white shadow transition transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {downloading ? "Saving…" : "📥 Download Card"}
          </button>
          
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
