export const VIEWBOX = { width: 1000, height: 420 };
export const CENTER_Y = 205;

export const CLASS_LABELS = {
  any: 'Any class',
  pistol: 'Semi-automatic pistol',
  smg: 'SMG',
  assault: 'Assault rifle',
  battle: 'Battle rifle',
  dmr: 'DMR',
};

export const CLASS_CHOICES = [
  { value: 'pistol', weight: 1.1 },
  { value: 'smg', weight: 1 },
  { value: 'assault', weight: 1.25 },
  { value: 'battle', weight: 0.75 },
  { value: 'dmr', weight: 0.85 },
];

export const THEMES = [
  { name: 'graphite', bodyA: '#667487', bodyB: '#42505f', accent: '#96a6b8', detail: '#bfd0e3', attachment: '#7e8ea3', stroke: '#d9e4ef', shadow: '#09101d' },
  { name: 'tan', bodyA: '#9b8a6b', bodyB: '#675b46', accent: '#cfbc96', detail: '#efe2c2', attachment: '#7e7361', stroke: '#fbf6ea', shadow: '#120f0a' },
  { name: 'od', bodyA: '#64745d', bodyB: '#46543f', accent: '#94a886', detail: '#cfdbca', attachment: '#5d6854', stroke: '#eff8eb', shadow: '#0d110b' },
  { name: 'slate', bodyA: '#606778', bodyB: '#363d4d', accent: '#8393af', detail: '#ccd8ee', attachment: '#778399', stroke: '#eef4ff', shadow: '#090d15' },
];
