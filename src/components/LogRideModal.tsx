"use client";

import { useState } from "react";
import { CO2_PER_KM } from "@/lib/constants";

interface LogRideModalProps {
  onClose: () => void;
  onSubmit: (distance: number) => void;
}

export default function LogRideModal({ onClose, onSubmit }: LogRideModalProps) {
  const [distance, setDistance] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const km = parseFloat(distance);
    if (isNaN(km) || km <= 0) {
      setError("Please enter a valid distance greater than 0.");
      return;
    }
    onSubmit(km);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-1 text-2xl font-bold text-gray-900">Log a Ride 🚴</h2>
        <p className="mb-6 text-sm text-gray-500">
          Enter your one-way commute distance (we'll count the round trip).
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="distance"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Distance (km)
            </label>
            <input
              id="distance"
              type="number"
              min="0.1"
              step="0.1"
              value={distance}
              onChange={(e) => {
                setDistance(e.target.value);
                setError("");
              }}
              placeholder="e.g. 12.5"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 outline-none ring-0 transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
              autoFocus
            />
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
          </div>

          {distance && !isNaN(parseFloat(distance)) && parseFloat(distance) > 0 && (
            <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              🌿 Round trip: {(parseFloat(distance) * 2).toFixed(1)} km • CO₂ saved:{" "}
              <span className="font-semibold">
                {(parseFloat(distance) * 2 * CO2_PER_KM).toFixed(3)} kg
              </span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
            >
              Log Ride
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
