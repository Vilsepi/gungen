import { polygonToString } from '../layout/primitives.js';

export const SVG_NS = 'http://www.w3.org/2000/svg';

export function createElement(name, attrs = {}) {
  const element = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      element.setAttribute(key, String(value));
    }
  });
  return element;
}

export function clearNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

export function createPolygon(points, attrs = {}) {
  return createElement('polygon', {
    points: polygonToString(points),
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round',
    ...attrs,
  });
}

export function createPolyline(points, attrs = {}) {
  return createElement('polyline', {
    points: polygonToString(points),
    fill: 'none',
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round',
    ...attrs,
  });
}

export function appendPolygon(parent, points, attrs = {}) {
  parent.appendChild(createPolygon(points, attrs));
}
