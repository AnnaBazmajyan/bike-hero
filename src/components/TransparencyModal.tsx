"use client";

interface TransparencyModalProps {
  onClose: () => void;
}

export default function TransparencyModal({ onClose }: TransparencyModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            ℹ️ How is this calculated?
          </h2>
          <button
            onClick={onClose}
            className="ml-4 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-5 text-sm text-gray-700">
          {/* CO₂ Formula */}
          <div className="rounded-xl bg-green-50 p-4">
            <p className="mb-1 font-semibold text-green-800">CO₂ Savings Formula</p>
            <p className="font-mono text-green-700">
              CO₂ saved = distance (km) × 0.147 kg/km
            </p>
            <p className="mt-2 text-xs text-gray-500">
              This represents the average CO₂ emission factor for car travel in
              Germany. Each kilometre you bike instead of drive saves approximately
              147 g of CO₂.
            </p>
          </div>

          {/* Tree Equivalence */}
          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="mb-1 font-semibold text-emerald-800">Tree Equivalence</p>
            <p className="font-mono text-emerald-700">
              Trees = total CO₂ saved (kg) ÷ 22
            </p>
            <p className="mt-2 text-xs text-gray-500">
              A mature tree absorbs roughly 22 kg of CO₂ per year. We use this to
              translate your savings into a tangible, intuitive number.
            </p>
          </div>

          {/* Sources */}
          <div>
            <p className="mb-2 font-semibold text-gray-700">Sources</p>
            <ul className="flex flex-col gap-1 text-xs text-gray-500">
              <li>
                <span className="font-medium text-gray-600">Umweltbundesamt (UBA)</span>
                {" "}— German Federal Environment Agency, car emission factors
              </li>
              <li>
                <span className="font-medium text-gray-600">ICCT</span>
                {" "}— International Council on Clean Transportation, road transport CO₂
              </li>
              <li>
                <span className="font-medium text-gray-600">PCF</span>
                {" "}— Product Carbon Footprint methodology for lifecycle emissions
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
