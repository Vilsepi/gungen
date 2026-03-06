import { appendPolygon, createElement } from '../svg.js';

export function renderHandguard(part) {
  if (!part) {
    return null;
  }

  const group = createElement('g', { 'data-part': 'handguard' });
  appendPolygon(group, part.points, {
    fill: 'url(#bodyGradient)',
    stroke: part.stroke,
    'stroke-width': 3.2,
  });
  return group;
}
