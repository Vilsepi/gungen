import { clamp } from '../core/random.js';

export function formatNumber(value) {
  return Number.parseFloat(value.toFixed(2));
}

export function point(x, y) {
  return { x: formatNumber(x), y: formatNumber(y) };
}

export function polygonToString(points) {
  return points.map(({ x, y }) => `${x},${y}`).join(' ');
}

export function rotateAround(origin, vector, radians) {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return point(
    origin.x + vector.x * cos - vector.y * sin,
    origin.y + vector.x * sin + vector.y * cos,
  );
}

export function rectPolygon(x, y, width, height, rotationDeg = 0, origin = point(x, y)) {
  const corners = [
    point(x, y),
    point(x + width, y),
    point(x + width, y + height),
    point(x, y + height),
  ];

  if (!rotationDeg) {
    return corners;
  }

  const radians = (rotationDeg * Math.PI) / 180;
  return corners.map((corner) => rotateAround(origin, { x: corner.x - origin.x, y: corner.y - origin.y }, radians));
}

export function createGripPolygon(anchor, length, widthTop, widthBottom, leanDeg) {
  const radians = (leanDeg * Math.PI) / 180;
  const direction = { x: Math.sin(radians), y: Math.cos(radians) };
  const normal = { x: Math.cos(radians), y: -Math.sin(radians) };

  const p1 = point(anchor.x + normal.x * widthTop * 0.5, anchor.y + normal.y * widthTop * 0.5);
  const p2 = point(anchor.x - normal.x * widthTop * 0.5, anchor.y - normal.y * widthTop * 0.5);
  const base = point(anchor.x + direction.x * length, anchor.y + direction.y * length);
  const p3 = point(base.x - normal.x * widthBottom * 0.5, base.y - normal.y * widthBottom * 0.5);
  const p4 = point(base.x + normal.x * widthBottom * 0.5, base.y + normal.y * widthBottom * 0.5);
  return [p1, p2, p3, p4];
}

export function createMagazinePolygon(anchor, width, length, tiltDeg, flare = 1) {
  const topLeft = point(anchor.x - width * 0.5, anchor.y);
  const points = rectPolygon(topLeft.x, topLeft.y, width, length, tiltDeg, anchor);

  if (flare === 1) {
    return points;
  }

  const [p1, p2, p3, p4] = points;
  const centerBottom = point((p3.x + p4.x) * 0.5, (p3.y + p4.y) * 0.5);
  const widenFactor = flare - 1;

  return [
    p1,
    p2,
    point(p3.x + (p3.x - centerBottom.x) * widenFactor, p3.y + (p3.y - centerBottom.y) * widenFactor),
    point(p4.x + (p4.x - centerBottom.x) * widenFactor, p4.y + (p4.y - centerBottom.y) * widenFactor),
  ];
}

export function createReceiverPolygon(x, y, width, height, options = {}) {
  const topInset = options.topInset ?? height * 0.12;
  const frontBevel = options.frontBevel ?? width * 0.06;
  const rearBevel = options.rearBevel ?? width * 0.08;
  const lowerRearCut = options.lowerRearCut ?? width * 0.12;
  const lowerFrontCut = options.lowerFrontCut ?? width * 0.08;
  const belly = options.belly ?? height * 0.18;

  return [
    point(x + frontBevel, y),
    point(x + width - rearBevel, y),
    point(x + width, y + topInset),
    point(x + width, y + height * 0.52),
    point(x + width - lowerRearCut, y + height),
    point(x + lowerFrontCut, y + height),
    point(x, y + height - belly),
    point(x, y + height * 0.32),
  ];
}

export function createHandguardPolygon(frontX, y, width, height, variation = {}) {
  const noseDrop = variation.noseDrop ?? height * 0.2;
  const lowerInset = variation.lowerInset ?? width * 0.08;
  const rearDrop = variation.rearDrop ?? height * 0.12;

  return [
    point(frontX, y + height * 0.12),
    point(frontX + width * 0.82, y),
    point(frontX + width, y + rearDrop),
    point(frontX + width, y + height * 0.58),
    point(frontX + width * 0.88, y + height),
    point(frontX + lowerInset, y + height),
    point(frontX, y + height - noseDrop),
  ];
}

export function createStockPolygon(type, attachX, topY, width, height) {
  if (type === 'skeletal') {
    return [
      point(attachX, topY + height * 0.1),
      point(attachX + width * 0.6, topY),
      point(attachX + width, topY + height * 0.2),
      point(attachX + width * 0.78, topY + height * 0.42),
      point(attachX + width * 0.28, topY + height * 0.6),
      point(attachX, topY + height * 0.45),
    ];
  }

  if (type === 'pdw') {
    return [
      point(attachX, topY + height * 0.16),
      point(attachX + width * 0.74, topY + height * 0.08),
      point(attachX + width, topY + height * 0.24),
      point(attachX + width * 0.92, topY + height * 0.48),
      point(attachX + width * 0.4, topY + height * 0.8),
      point(attachX, topY + height * 0.62),
    ];
  }

  return [
    point(attachX, topY + height * 0.08),
    point(attachX + width * 0.75, topY),
    point(attachX + width, topY + height * 0.16),
    point(attachX + width * 0.96, topY + height * 0.42),
    point(attachX + width * 0.72, topY + height * 0.92),
    point(attachX + width * 0.12, topY + height),
    point(attachX, topY + height * 0.7),
  ];
}

export function shiftPoints(points, dx = 0, dy = 0) {
  return points.map(({ x, y }) => point(x + dx, y + dy));
}

export function boundsFromPoints(points) {
  const xs = points.map((item) => item.x);
  const ys = points.map((item) => item.y);
  return {
    left: Math.min(...xs),
    right: Math.max(...xs),
    top: Math.min(...ys),
    bottom: Math.max(...ys),
  };
}

export function shiftBounds(bounds, dx, dy) {
  return {
    left: bounds.left + dx,
    right: bounds.right + dx,
    top: bounds.top + dy,
    bottom: bounds.bottom + dy,
  };
}

export function fitPointsToViewbox(parts, viewbox, padding = 40) {
  const allPoints = parts.flatMap((part) => part.points ?? []);
  const bounds = boundsFromPoints(allPoints);
  const dx = clamp(padding - bounds.left, -999, 999);
  const dyTop = padding - bounds.top;
  const dyBottom = viewbox.height - padding - bounds.bottom;
  const dy = dyTop > 0 ? dyTop : dyBottom < 0 ? dyBottom : 0;

  return {
    dx,
    dy,
    bounds,
  };
}
