import { CLASS_LABELS } from '../../model/constants.js';
import { createElement } from '../svg.js';

export function renderCaption(layout) {
  const group = createElement('g', { opacity: 0.95, 'data-layer': 'caption' });

  const title = createElement('text', {
    x: 28,
    y: 34,
    fill: layout.palette.stroke,
    'font-size': 20,
    'font-family': 'Inter, system-ui, sans-serif',
    'font-weight': 700,
  });
  title.textContent = CLASS_LABELS[layout.type];
  group.appendChild(title);

  const subtitle = createElement('text', {
    x: 28,
    y: 58,
    fill: layout.palette.detail,
    'font-size': 12,
    'font-family': 'Inter, system-ui, sans-serif',
    'letter-spacing': '0.12em',
    'text-transform': 'uppercase',
  });
  subtitle.textContent = layout.metadata.attachmentNames.length ? layout.metadata.attachmentNames.join(' • ') : 'Base configuration';
  group.appendChild(subtitle);

  return group;
}
