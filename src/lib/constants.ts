/** kg of CO₂ saved per kilometre biked vs driving */
export const CO2_PER_KM = 0.147;

/** kg of CO₂ absorbed per tree per MONTH (22 kg/year ÷ 12) — used for monthly tree-equivalent display */
export const KG_CO2_PER_TREE = 22 / 12;

/** Target CO₂ milestone in kg */
export const MILESTONE_KG = 500;

/** Badges awarded for cumulative CO₂ saved (all-time) */
export const BADGES = [
  { id: "seedling", emoji: "🌱", name: "Seedling", threshold: 100 },
  { id: "tree-planter", emoji: "🌳", name: "Tree Planter", threshold: 500 },
  { id: "forest-guardian", emoji: "🌲", name: "Forest Guardian", threshold: 1000 },
] as const;

export type BadgeId = (typeof BADGES)[number]["id"];
