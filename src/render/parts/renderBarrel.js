import { createElement } from '../svg.js';

export function renderBarrel(barrel, stroke) {
  const group = createElement('g', { 'data-part': 'barrel' });
  group.appendChild(createElement('rect', {
    x: barrel.endX,
    y: barrel.centerY - barrel.width,
    width: barrel.startX - barrel.endX,
    height: barrel.width * 2,
    rx: barrel.width * 0.9,
    fill: 'url(#attachmentGradient)',
    stroke,
    'stroke-width': 2.8,
  }));
  return group;
}
