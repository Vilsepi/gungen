import { appendPolygon, createElement } from '../svg.js';
import { polygonToString } from '../../layout/primitives.js';

export function renderAttachments(attachments) {
  const group = createElement('g', { 'data-layer': 'attachments' });

  attachments.forEach((attachment) => {
    if (attachment.points) {
      appendPolygon(group, attachment.points, {
        fill: attachment.fill || 'url(#attachmentGradient)',
        stroke: attachment.stroke,
        'stroke-width': 2.8,
      });
    }

    if (attachment.mount) {
      group.appendChild(createElement('polygon', {
        points: polygonToString(attachment.mount),
        fill: 'url(#attachmentGradient)',
        stroke: attachment.stroke,
        'stroke-width': 2.6,
        'stroke-linejoin': 'round',
      }));
    }
  });

  return group;
}
