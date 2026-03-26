"use client";

interface BadgeModalProps {
  emoji: string;
  name: string;
  onDismiss: () => void;
}

export default function BadgeModal({ emoji, name, onDismiss }: BadgeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Confetti particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {["🌿", "✨", "🍃", "⭐", "💚", "🌟", "🍀", "✨"].map((p, i) => (
          <span
            key={i}
            className="absolute text-2xl animate-confetti"
            style={{
              left: `${10 + i * 11}%`,
              animationDelay: `${i * 0.12}s`,
              animationDuration: "1.8s",
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div className="relative w-full max-w-xs rounded-3xl bg-white p-8 shadow-2xl text-center animate-badge-pop">
        <div className="mb-4 text-7xl animate-bounce">{emoji}</div>
        <p className="text-xs font-semibold uppercase tracking-widest text-green-500 mb-1">
          Badge Unlocked!
        </p>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{name}</h2>
        <p className="text-sm text-gray-500 mb-6">
          Amazing work — you&apos;ve earned this milestone! 🎉
        </p>
        <button
          onClick={onDismiss}
          className="w-full rounded-2xl bg-green-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-600 active:scale-95"
          autoFocus
        >
          Awesome! 🙌
        </button>
      </div>
    </div>
  );
}
