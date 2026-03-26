"use client";

import { useState } from "react";
import Link from "next/link";
import { CO2_PER_KM, KG_CO2_PER_TREE, MILESTONE_KG, BADGES } from "@/lib/constants";
import LogRideModal from "./LogRideModal";
import BadgeModal from "./BadgeModal";
import ImpactCard from "./ImpactCard";
import TransparencyModal from "./TransparencyModal";

interface Ride {
  id: string;
  date: string;
  distance: number;
  co2: number;
}

type Badge = (typeof BADGES)[number];

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
  const [badgesUnlocked, setBadgesUnlocked] = useState<Badge[]>([]);
  const [pendingBadges, setPendingBadges] = useState<Badge[]>([]);
  const [showImpactCard, setShowImpactCard] = useState(false);
  const [showTransparency, setShowTransparency] = useState(false);

  const currentMonth = todayISO().slice(0, 7); // "YYYY-MM"
  const monthRides = rides.filter((r) => r.date.startsWith(currentMonth));

  const totalCO2 = monthRides.reduce((sum, r) => sum + r.co2, 0);
  const allTimeCO2 = rides.reduce((sum, r) => sum + r.co2, 0);
  const allTimeTrees = allTimeCO2 / KG_CO2_PER_TREE;
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
    const updatedRides = [newRide, ...rides];
    const allTimeCO2 = rides.reduce((sum, r) => sum + r.co2, 0) + co2;
    const newlyEarned = BADGES.filter(
      (b) => allTimeCO2 >= b.threshold && !badgesUnlocked.some((ub) => ub.id === b.id)
    );
    setRides(updatedRides);
    if (newlyEarned.length > 0) {
      setBadgesUnlocked((prev) => [...prev, ...newlyEarned]);
      setPendingBadges((prev) => [...prev, ...newlyEarned]);
    }
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
            <Link
              href="/leaderboard"
              className="rounded-xl bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 transition hover:bg-green-100"
            >
              🏆 Leaderboard
            </Link>
            <div className="h-9 w-9 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold text-white">
              A
            </div>
            <span className="text-sm font-medium text-gray-700">Anna</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Greeting */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Hey Anna! 👋
            </h2>
            <p className="text-gray-500">Here&apos;s your impact this month.</p>
          </div>
          <button
            onClick={() => setShowImpactCard(true)}
            className="shrink-0 rounded-xl bg-white hover:bg-gray-50 px-4 py-2 text-sm font-bold text-green-600 shadow-lg ring-2 ring-green-500/20 transition transform hover:-translate-y-0.5"
          >
            Share My Impact 📱
          </button>
        </div>

        {/* Hero CO₂ Card */}
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-8 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-white/90">CO₂ Saved This Month</p>
            <button
              onClick={() => setShowTransparency(true)}
              className="text-xs text-white/70 transition hover:text-white"
              title="How is this calculated?"
              aria-label="How is this calculated?"
            >
              ℹ️ How?
            </button>
          </div>
          <div className="text-center">
            <p className="text-7xl font-extrabold text-white mb-2">
              {totalCO2.toFixed(1)}
            </p>
            <p className="text-3xl font-bold text-white/90 mb-4">kg CO₂</p>
            
            {/* Metrics as Text */}
            <div className="space-y-2 text-white/90 text-lg">
              <p>= {trees.toFixed(1)} trees planted 🌳</p>
              <p>= {Math.round(totalCO2 / 250)} flights offset ✈️</p>
              <p>= {monthRides.length} rides this month 🚴</p>
            </div>
          </div>
        </div>

        {/* Secondary Stats Grid */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Streak Card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-medium text-gray-500">Current Streak</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-5xl font-extrabold text-orange-500">{streak}</p>
              <p className="text-2xl">🔥</p>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700">
              {streak === 0 && "Start your streak today!"}
              {streak === 1 && "Great start! Keep it going!"}
              {streak === 2 && "Building momentum!"}
              {streak >= 3 && streak < 7 && "On fire! 🔥"}
              {streak >= 7 && streak < 14 && "Weekly warrior! 💪"}
              {streak >= 14 && streak < 30 && "Unstoppable! 🚀"}
              {streak >= 30 && "Legendary status! 🏆"}
            </p>
          </div>

          {/* Total Rides Card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-medium text-gray-500">Total Rides</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-5xl font-extrabold text-blue-500">{monthRides.length}</p>
              <p className="text-2xl">🚴</p>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              this month • {rides.length} all-time
            </p>
          </div>
        </div>

        {/* Smart Milestone Progress */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          {(() => {
            // Smart milestones: 10, 25, 50, 100, 250, 500kg
            const milestones = [10, 25, 50, 100, 250, 500];
            const nextMilestone = milestones.find(m => totalCO2 < m) || 500;
            const prevMilestone = milestones.filter(m => totalCO2 >= m).pop() || 0;
            const progressToNext = ((totalCO2 - prevMilestone) / (nextMilestone - prevMilestone)) * 100;
            const remaining = nextMilestone - totalCO2;

            return (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Next Milestone: {nextMilestone}kg
                    </p>
                    <p className="text-xs text-gray-400">
                      {remaining.toFixed(1)}kg to go
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {progressToNext.toFixed(0)}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700"
                    style={{ width: `${Math.min(progressToNext, 100)}%` }}
                  />
                </div>
                {prevMilestone > 0 && (
                  <p className="mt-2 text-sm text-green-600">
                    ✅ {prevMilestone}kg milestone unlocked!
                  </p>
                )}
              </>
            );
          })()}
        </div>

        {/* Badges Section */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h3 className="mb-4 text-base font-semibold text-gray-900">Your Badges</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BADGES.map((badge) => {
              const earned = badgesUnlocked.some((b) => b.id === badge.id);
              const remaining = Math.max(0, badge.threshold - allTimeCO2);
              const progress = Math.min((allTimeCO2 / badge.threshold) * 100, 100);
              
              return (
                <div
                  key={badge.id}
                  className={`rounded-2xl p-4 transition-all ${
                    earned
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 ring-2 ring-green-200 shadow-sm"
                      : "bg-gray-50 ring-1 ring-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl ${!earned && 'grayscale opacity-40'}`}>
                        {badge.emoji}
                      </span>
                      <div>
                        <p className={`text-sm font-semibold ${earned ? 'text-green-800' : 'text-gray-600'}`}>
                          {badge.name}
                        </p>
                        <p className="text-xs text-gray-500">{badge.threshold}kg goal</p>
                      </div>
                    </div>
                    {earned && (
                      <span className="text-green-600 text-xl">✓</span>
                    )}
                  </div>
                  {!earned && (
                    <>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        {remaining.toFixed(1)}kg to go
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
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

      {showImpactCard && (
        <ImpactCard
          totalRides={monthRides.length}
          totalCO2={totalCO2}
          trees={trees}
          streak={streak}
          onClose={() => setShowImpactCard(false)}
        />
      )}

      {showTransparency && (
        <TransparencyModal onClose={() => setShowTransparency(false)} />
      )}

      {pendingBadges.length > 0 && (
        <BadgeModal
          emoji={pendingBadges[0].emoji}
          name={pendingBadges[0].name}
          onDismiss={() => setPendingBadges((prev) => prev.slice(1))}
        />
      )}
    </div>
  );
}
