"use client";

import Link from "next/link";

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  team: "Engineering" | "Marketing";
  totalCO2: number;
  rides: number;
  streak: number;
}

const MOCK_USERS: LeaderboardUser[] = [
  { id: "anna",   name: "Anna",    avatar: "A", team: "Engineering", totalCO2: 3.57,  rides: 24,  streak: 2 },
  { id: "tom",    name: "Tom",     avatar: "T", team: "Marketing",   totalCO2: 12.40, rides: 52,  streak: 7 },
  { id: "sara",   name: "Sara",    avatar: "S", team: "Engineering", totalCO2: 9.85,  rides: 41,  streak: 5 },
  { id: "leo",    name: "Leo",     avatar: "L", team: "Marketing",   totalCO2: 7.03,  rides: 30,  streak: 3 },
  { id: "mia",    name: "Mia",     avatar: "M", team: "Engineering", totalCO2: 14.11, rides: 60,  streak: 12 },
  { id: "felix",  name: "Felix",   avatar: "F", team: "Marketing",   totalCO2: 5.88,  rides: 25,  streak: 1 },
  { id: "julia",  name: "Julia",   avatar: "J", team: "Engineering", totalCO2: 2.21,  rides: 10,  streak: 0 },
  { id: "chris",  name: "Chris",   avatar: "C", team: "Marketing",   totalCO2: 10.29, rides: 44,  streak: 6 },
];

const CURRENT_USER_ID = "anna";

const MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

function TeamCard({
  team,
  users,
}: {
  team: "Engineering" | "Marketing";
  users: LeaderboardUser[];
}) {
  const total = users.reduce((s, u) => s + u.totalCO2, 0);
  const emoji = team === "Engineering" ? "⚙️" : "📣";
  const colorClass =
    team === "Engineering"
      ? "bg-blue-50 ring-blue-100 text-blue-700"
      : "bg-purple-50 ring-purple-100 text-purple-700";

  return (
    <div className={`rounded-2xl p-5 ring-1 ${colorClass}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-60">
        {emoji} {team}
      </p>
      <p className="mt-1 text-3xl font-extrabold">{total.toFixed(2)}</p>
      <p className="text-sm font-medium opacity-70">kg CO₂ saved</p>
      <p className="mt-1 text-xs opacity-50">{users.length} riders</p>
    </div>
  );
}

export default function LeaderboardPage() {
  const sorted = [...MOCK_USERS].sort((a, b) => b.totalCO2 - a.totalCO2);

  const engineering = MOCK_USERS.filter((u) => u.team === "Engineering");
  const marketing = MOCK_USERS.filter((u) => u.team === "Marketing");

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
          <Link
            href="/"
            className="rounded-xl bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">🏆 Leaderboard</h2>
          <p className="text-gray-500">Who&apos;s saving the most CO₂?</p>
        </div>

        {/* Team Totals */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TeamCard team="Engineering" users={engineering} />
          <TeamCard team="Marketing" users={marketing} />
        </div>

        {/* Rankings */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          <div className="border-b border-gray-100 px-6 py-4">
            <h3 className="text-base font-semibold text-gray-900">
              Individual Rankings
            </h3>
            <p className="text-xs text-gray-400">Ranked by all-time CO₂ saved</p>
          </div>

          <ul className="divide-y divide-gray-50">
            {sorted.map((user, index) => {
              const rank = index + 1;
              const isCurrentUser = user.id === CURRENT_USER_ID;

              return (
                <li
                  key={user.id}
                  className={`flex items-center gap-4 px-6 py-4 transition ${
                    isCurrentUser
                      ? "bg-green-50 ring-inset ring-1 ring-green-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 shrink-0 text-center">
                    {rank <= 3 ? (
                      <span className="text-2xl">{MEDAL[rank]}</span>
                    ) : (
                      <span className="text-sm font-bold text-gray-400">
                        #{rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                      isCurrentUser ? "bg-green-500" : "bg-gray-400"
                    }`}
                  >
                    {user.avatar}
                  </div>

                  {/* Name + team */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold ${
                        isCurrentUser ? "text-green-700" : "text-gray-900"
                      }`}
                    >
                      {user.name}
                      {isCurrentUser && (
                        <span className="ml-2 rounded-full bg-green-200 px-2 py-0.5 text-xs font-medium text-green-800">
                          You
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      {user.team} · {user.rides} rides ·{" "}
                      <span aria-label={`${user.streak} day streak`}>
                        {user.streak}🔥
                      </span>
                    </p>
                  </div>

                  {/* CO₂ */}
                  <div className="text-right shrink-0">
                    <p
                      className={`text-base font-extrabold ${
                        isCurrentUser ? "text-green-600" : "text-gray-800"
                      }`}
                    >
                      {user.totalCO2.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">kg CO₂</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Data refreshes each time you log a ride. Keep biking! 🚲
        </p>
      </main>
    </div>
  );
}
