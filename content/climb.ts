// The climb is data-driven: add a project later by adding a Marker (mountain icon)
// and a matching card window in components/Ascent.tsx.

export const WORLD_H = 2800; // tallest world-y used by the scene; the camera pans within it

// sky gradient stops, night (base) -> dawn (summit)
export const SKY: { at: number; c: [string, string] }[] = [
  { at: 0, c: ["#070a1c", "#10173a"] },
  { at: 0.5, c: ["#1b2348", "#3a2c54"] },
  { at: 0.8, c: ["#5a3a63", "#a85f55"] },
  { at: 1, c: ["#e98a4e", "#ffd17a"] },
];

export type MarkerType = "base" | "tent" | "flag" | "note" | "post" | "summit";
export type Marker = { id: string; label: string; at: number; type: MarkerType };

// markers planted on the trail (major camps = work; note/post = checkpoints)
export const markers: Marker[] = [
  { id: "base-camp", label: "BASE CAMP", at: 0.05, type: "base" },
  { id: "crest-data", label: "CAMP I · CREST DATA", at: 0.3, type: "tent" },
  { id: "field-note", label: "FIELD NOTE", at: 0.47, type: "note" },
  { id: "state-street", label: "CAMP II · STATE STREET", at: 0.63, type: "flag" },
  { id: "projects", label: "PROJECTS", at: 0.8, type: "post" },
  { id: "summit", label: "SUMMIT", at: 0.99, type: "summit" },
];

// HUD quick-nav (major stops only)
export const hudCamps = [
  { label: "Base Camp", at: 0.05 },
  { label: "Camp I", at: 0.3 },
  { label: "Camp II", at: 0.63 },
  { label: "Summit", at: 0.99 },
];

// decorative props in world coords: [x, y, scale]
export const trees: [number, number, number][] = [
  [120, 2640, 1], [230, 2585, 0.8], [330, 2675, 1.15], [690, 2620, 1],
  [815, 2560, 0.85], [905, 2680, 1.05], [470, 2715, 0.9], [560, 2660, 0.75],
];
export const rocks: [number, number, number][] = [
  [360, 1980, 1], [660, 1640, 0.8], [300, 2260, 1.1],
  [720, 2200, 0.9], [520, 2430, 1], [180, 2380, 0.85],
];
