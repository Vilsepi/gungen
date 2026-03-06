import { createElement } from '../svg.js';

export function renderControls(controls, palette) {
  const group = createElement('g', { 'data-layer': 'controls' });

  group.appendChild(createElement('path', {
    d: `M ${controls.trigger.x - 12} ${controls.trigger.y} Q ${controls.trigger.x} ${controls.trigger.y + 24} ${controls.trigger.x + 16} ${controls.trigger.y + 6}`,
    fill: 'none',
    stroke: palette.detail,
    'stroke-width': 3,
    'stroke-linecap': 'round',
  }));

  group.appendChild(createElement('path', {
    d: `M ${controls.guardStart.x} ${controls.guardStart.y} Q ${controls.trigger.x - 4} ${controls.trigger.y - 26} ${controls.guardEnd.x} ${controls.guardEnd.y}`,
    fill: 'none',
    stroke: palette.stroke,
    'stroke-width': 3,
    'stroke-linecap': 'round',
  }));

  return group;
}
