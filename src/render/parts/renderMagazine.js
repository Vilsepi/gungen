import { appendPolygon, createElement } from '../svg.js';

export function renderMagazine(part) {
  if (!part) {
    return null;
  }

  const group = createElement('g', { 'data-part': 'magazine' });
  appendPolygon(group, part.points, {
    fill: 'url(#attachmentGradient)',
    stroke: part.stroke,
    'stroke-width': 3.2,
  });
  return group;
}
