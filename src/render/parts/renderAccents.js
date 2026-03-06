import { createElement, createPolyline } from '../svg.js';

export function renderAccents(accents) {
  const group = createElement('g', { 'data-layer': 'accents' });
  accents.forEach((accent) => {
    group.appendChild(createPolyline(accent.points, {
      stroke: accent.stroke,
      'stroke-width': accent.width,
      opacity: 0.85,
    }));
  });
  return group;
}
