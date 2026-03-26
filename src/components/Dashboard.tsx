"use client";

import { useState } from "react";
import { CO2_PER_KM, KG_CO2_PER_TREE, MILESTONE_KG } from "@/lib/constants";
import LogRideModal from "./LogRideModal";

interface Ride {
  id: string;
  date: string;
  distance: number;
  co2: number;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function calcStreak(rides: Ride[]): number {
  if (rides.length === 0) return 0;

  // Collect unique ride dates
  const rideDates = new Set(rides.map((r) => r.date));

  let streak = 0;
  // Start checking from today; if today has no ride, allow yesterday as starting point
  const today = todayISO();
  let checking = rideDates.has(today) ? today : (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  })();

  while (rideDates.has(checking)) {
    streak++;
    const d = new Date(checking + "T00:00:00");
    d.setDate(d.getDate() - 1);
    checking = d.toISOString().slice(0, 10);
  }

  return streak;
}

const INITIAL_RIDES: Ride[] = [
  {
    id: "seed-1",
    date: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 2);
      return d.toISOString().slice(0, 10);
    })(),
    distance: 14,
    co2: parseFloat((14 * CO2_PER_KM).toFixed(3)),
  },
  {
    id: "seed-2",
    date: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d.toISOString().slice(0, 10);
    })(),
    distance: 10,
    co2: parseFloat((10 * CO2_PER_KM).toFixed(3)),
  },
];

export default function Dashboard() {
  const [rides, setRides] = useState<Ride[]>(INITIAL_RIDES);
  const [showModal, setShowModal] = useState(false);

  const currentMonth = todayISO().slice(0, 7); // "YYYY-MM"
  const monthRides = rides.filter((r) => r.date.startsWith(currentMonth));

  const totalCO2 = monthRides.reduce((sum, r) => sum + r.co2, 0);
  const trees = totalCO2 / KG_CO2_PER_TREE;
  const streak = calcStreak(rides);
  const progressPct = Math.min((totalCO2 / MILESTONE_KG) * 100, 100);

  function handleLogRide(distance: number) {
    const co2 = parseFloat((distance * CO2_PER_KM).toFixed(3));
    const newRide: Ride = {
      id: crypto.randomUUID(),
      date: todayISO(),
      distance,
      co2,
    };
    setRides((prev) => [newRide, ...prev]);
    setShowModal(false);
  }

  const sortedRides = [...rides].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="border-b border-green-100 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚴</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Bike Hero</h1>
              <p className="text-xs text-gray-500">CO₂ Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold text-white">
              A
            </div>
            <span className="text-sm font-medium text-gray-700">Anna</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Hey Anna! 👋
          </h2>
          <p className="text-gray-500">Here&apos;s your impact this month.</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* CO₂ Card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:col-span-1">
            <p className="text-sm font-medium text-gray-500">CO₂ Saved</p>
            <p className="mt-1 text-4xl font-extrabold text-green-600">
              {totalCO2.toFixed(2)}
            </p>
            <p className="text-lg font-semibold text-green-500">kg</p>
            <p className="mt-1 text-xs text-gray-400">this month</p>
          </div>

          {/* Trees Card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-medium text-gray-500">Tree Equivalent</p>
            <p className="mt-1 text-4xl font-extrabold text-emerald-600">
              {trees.toFixed(2)}
            </p>
            <p className="text-lg font-semibold text-emerald-500">🌳</p>
            <p className="mt-1 text-xs text-gray-400">trees worth of CO₂</p>
          </div>

          {/* Streak Card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-medium text-gray-500">Current Streak</p>
            <p className="mt-1 text-4xl font-extrabold text-orange-500">
              {streak}
            </p>
            <p className="text-lg font-semibold text-orange-400">🔥 days</p>
            <p className="mt-1 text-xs text-gray-400">consecutive biking days</p>
          </div>
        </div>

        {/* Progress Bar Card */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Progress to {MILESTONE_KG}kg Milestone
              </p>
              <p className="text-xs text-gray-400">
                {totalCO2.toFixed(2)} kg / {MILESTONE_KG} kg
              </p>
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              {progressPct.toFixed(1)}%
            </span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {progressPct >= 100 && (
            <p className="mt-2 text-sm font-semibold text-green-600">
              🎉 Milestone reached! Amazing work!
            </p>
          )}
        </div>

        {/* Activity List + Log Ride Button */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h3 className="text-base font-semibold text-gray-900">
              Activity Log
            </h3>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 active:scale-95"
            >
              <span className="text-base">+</span> Log Ride
            </button>
          </div>

          {sortedRides.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <span className="text-5xl">🚲</span>
              <p className="text-sm text-gray-500">
                No rides logged yet. Start biking!
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {sortedRides.map((ride) => (
                <li
                  key={ride.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(ride.date)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {ride.distance} km
                    </p>
                  </div>
                  <div className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                    -{ride.co2.toFixed(3)} kg CO₂
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {showModal && (
        <LogRideModal
          onClose={() => setShowModal(false)}
          onSubmit={handleLogRide}
        />
      )}
    </div>
  );
}
