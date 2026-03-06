import { appendPolygon, createElement } from '../svg.js';

export function renderGrip(part) {
  if (!part) {
    return null;
  }

  const group = createElement('g', { 'data-part': 'grip' });
  appendPolygon(group, part.points, {
    fill: part.fill,
    stroke: part.stroke,
    'stroke-width': 3.2,
  });
  return group;
}
