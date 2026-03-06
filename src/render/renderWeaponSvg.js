import { VIEWBOX } from '../model/constants.js';
import { renderAccents } from './parts/renderAccents.js';
import { renderAttachments } from './parts/renderAttachments.js';
import { renderBarrel } from './parts/renderBarrel.js';
import { renderCaption } from './parts/renderCaption.js';
import { renderControls } from './parts/renderControls.js';
import { renderFrame } from './parts/renderFrame.js';
import { renderGrip } from './parts/renderGrip.js';
import { renderHandguard } from './parts/renderHandguard.js';
import { renderMagazine } from './parts/renderMagazine.js';
import { renderReceiver } from './parts/renderReceiver.js';
import { renderSlide } from './parts/renderSlide.js';
import { renderStock } from './parts/renderStock.js';
import { clearNode, createElement } from './svg.js';

function appendIfPresent(parent, node) {
  if (node) {
    parent.appendChild(node);
  }
}

function createDefs(palette) {
  const defs = createElement('defs');

  const bodyGradient = createElement('linearGradient', { id: 'bodyGradient', x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
  bodyGradient.appendChild(createElement('stop', { offset: '0%', 'stop-color': palette.bodyA }));
  bodyGradient.appendChild(createElement('stop', { offset: '100%', 'stop-color': palette.bodyB }));
  defs.appendChild(bodyGradient);

  const attachmentGradient = createElement('linearGradient', { id: 'attachmentGradient', x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
  attachmentGradient.appendChild(createElement('stop', { offset: '0%', 'stop-color': palette.accent }));
  attachmentGradient.appendChild(createElement('stop', { offset: '100%', 'stop-color': palette.attachment }));
  defs.appendChild(attachmentGradient);

  const glow = createElement('filter', { id: 'glow', x: '-20%', y: '-20%', width: '140%', height: '140%' });
  glow.appendChild(createElement('feDropShadow', {
    dx: '0',
    dy: '10',
    stdDeviation: '12',
    'flood-color': '#000000',
    'flood-opacity': '0.35',
  }));
  defs.appendChild(glow);

  return defs;
}

function createGrid() {
  const grid = createElement('g', { opacity: 0.2, 'data-layer': 'grid' });
  for (let x = 40; x < VIEWBOX.width; x += 40) {
    grid.appendChild(createElement('line', {
      x1: x,
      y1: 0,
      x2: x,
      y2: VIEWBOX.height,
      stroke: '#1e293b',
      'stroke-width': 1,
    }));
  }
  for (let y = 40; y < VIEWBOX.height; y += 40) {
    grid.appendChild(createElement('line', {
      x1: 0,
      y1: y,
      x2: VIEWBOX.width,
      y2: y,
      stroke: '#1e293b',
      'stroke-width': 1,
    }));
  }
  return grid;
}

export function renderWeaponSvg(svg, layout) {
  clearNode(svg);

  svg.appendChild(createDefs(layout.palette));
  svg.appendChild(createElement('rect', { x: 0, y: 0, width: VIEWBOX.width, height: VIEWBOX.height, fill: layout.palette.shadow }));
  svg.appendChild(createGrid());

  const shadowLayer = createElement('g', { filter: 'url(#glow)', 'data-layer': 'shadow' });
  appendIfPresent(shadowLayer, renderHandguard(layout.parts.handguard));
  appendIfPresent(shadowLayer, renderReceiver(layout.parts.receiver));
  appendIfPresent(shadowLayer, renderFrame(layout.parts.frame));
  appendIfPresent(shadowLayer, renderSlide(layout.parts.slide));
  appendIfPresent(shadowLayer, renderStock(layout.parts.stock));
  appendIfPresent(shadowLayer, renderGrip(layout.parts.grip));
  appendIfPresent(shadowLayer, renderMagazine(layout.parts.magazine));
  shadowLayer.appendChild(renderBarrel(layout.barrel, layout.palette.stroke));
  svg.appendChild(shadowLayer);

  svg.appendChild(renderAccents(layout.accents));
  svg.appendChild(renderControls(layout.controls, layout.palette));
  svg.appendChild(renderAttachments(layout.attachments));
  svg.appendChild(renderCaption(layout));
}
