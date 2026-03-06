(() => {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const VIEWBOX = { width: 1000, height: 420 };
  const CENTER_Y = 205;

  const CLASS_LABELS = {
    any: 'Any class',
    pistol: 'Semi-automatic pistol',
    smg: 'SMG',
    assault: 'Assault rifle',
    battle: 'Battle rifle',
    dmr: 'DMR',
  };

  const CLASS_CHOICES = [
    { value: 'pistol', weight: 1.1 },
    { value: 'smg', weight: 1 },
    { value: 'assault', weight: 1.25 },
    { value: 'battle', weight: 0.75 },
    { value: 'dmr', weight: 0.85 },
  ];

  const THEMES = [
    { name: 'graphite', bodyA: '#667487', bodyB: '#42505f', accent: '#96a6b8', detail: '#bfd0e3', attachment: '#7e8ea3', stroke: '#d9e4ef', shadow: '#09101d' },
    { name: 'tan', bodyA: '#9b8a6b', bodyB: '#675b46', accent: '#cfbc96', detail: '#efe2c2', attachment: '#7e7361', stroke: '#fbf6ea', shadow: '#120f0a' },
    { name: 'od', bodyA: '#64745d', bodyB: '#46543f', accent: '#94a886', detail: '#cfdbca', attachment: '#5d6854', stroke: '#eff8eb', shadow: '#0d110b' },
    { name: 'slate', bodyA: '#606778', bodyB: '#363d4d', accent: '#8393af', detail: '#ccd8ee', attachment: '#778399', stroke: '#eef4ff', shadow: '#090d15' },
  ];

  function createMulberry32(seed) {
    return function random() {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashSeed(input) {
    let hash = 2166136261;
    for (let index = 0; index < input.length; index += 1) {
      hash ^= input.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function createRng(seedText) {
    return createMulberry32(hashSeed(seedText));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(min, max, t) {
    return min + (max - min) * t;
  }

  function range(rng, min, max) {
    return lerp(min, max, rng());
  }

  function intRange(rng, min, max) {
    return Math.round(range(rng, min, max));
  }

  function chance(rng, probability) {
    return rng() < probability;
  }

  function pick(rng, values) {
    return values[Math.floor(rng() * values.length)];
  }

  function weightedPick(rng, values) {
    const total = values.reduce((sum, item) => sum + item.weight, 0);
    let roll = rng() * total;
    for (const item of values) {
      roll -= item.weight;
      if (roll <= 0) {
        return item.value;
      }
    }
    return values[values.length - 1].value;
  }

  function createSeed() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function formatNumber(value) {
    return Number.parseFloat(value.toFixed(2));
  }

  function point(x, y) {
    return { x: formatNumber(x), y: formatNumber(y) };
  }

  function polygonToString(points) {
    return points.map(({ x, y }) => `${x},${y}`).join(' ');
  }

  function createElement(name, attrs = {}) {
    const element = document.createElementNS(SVG_NS, name);
    Object.entries(attrs).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        element.setAttribute(key, String(value));
      }
    });
    return element;
  }

  function clearNode(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function rotateAround(origin, vector, radians) {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    return point(
      origin.x + vector.x * cos - vector.y * sin,
      origin.y + vector.x * sin + vector.y * cos,
    );
  }

  function rectPolygon(x, y, width, height, rotationDeg = 0, origin = point(x, y)) {
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

  function createGripPolygon(anchor, length, widthTop, widthBottom, leanDeg) {
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

  function createMagazinePolygon(anchor, width, length, tiltDeg, flare = 1) {
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

  function createReceiverPolygon(x, y, width, height, options = {}) {
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

  function createHandguardPolygon(frontX, y, width, height, variation = {}) {
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

  function createStockPolygon(type, attachX, topY, width, height) {
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

  function shiftPoints(points, dx = 0, dy = 0) {
    return points.map(({ x, y }) => point(x + dx, y + dy));
  }

  function boundsFromPoints(points) {
    const xs = points.map((item) => item.x);
    const ys = points.map((item) => item.y);
    return {
      left: Math.min(...xs),
      right: Math.max(...xs),
      top: Math.min(...ys),
      bottom: Math.max(...ys),
    };
  }

  function normalizeSpec(spec) {
    const allPoints = [];

    [spec.receiver, spec.frame, spec.slide, spec.handguard, spec.stock, spec.grip, spec.magazine]
      .filter(Boolean)
      .forEach((shape) => allPoints.push(...shape.points));

    allPoints.push(point(spec.barrel.startX, spec.barrel.centerY - spec.barrel.width), point(spec.barrel.endX, spec.barrel.centerY + spec.barrel.width));

    spec.attachments.forEach((attachment) => {
      if (attachment.points) {
        allPoints.push(...attachment.points);
      }
    });

    const bounds = boundsFromPoints(allPoints);
    const pad = 40;
    const dx = clamp(pad - bounds.left, -999, 999);
    const dyTop = pad - bounds.top;
    const dyBottom = VIEWBOX.height - pad - bounds.bottom;
    const dy = dyTop > 0 ? dyTop : dyBottom < 0 ? dyBottom : 0;

    ['receiver', 'frame', 'slide', 'handguard', 'stock', 'grip', 'magazine'].forEach((key) => {
      if (spec[key]) {
        spec[key].points = shiftPoints(spec[key].points, dx, dy);
      }
    });

    spec.barrel.startX += dx;
    spec.barrel.endX += dx;
    spec.barrel.centerY += dy;

    spec.accents = spec.accents.map((accent) => ({
      ...accent,
      points: shiftPoints(accent.points, dx, dy),
    }));

    spec.attachments = spec.attachments.map((attachment) => {
      if (attachment.points) {
        return {
          ...attachment,
          points: shiftPoints(attachment.points, dx, dy),
          mount: attachment.mount ? shiftPoints(attachment.mount, dx, dy) : attachment.mount,
        };
      }

      return {
        ...attachment,
        center: point(attachment.center.x + dx, attachment.center.y + dy),
      };
    });

    spec.anchors = Object.fromEntries(
      Object.entries(spec.anchors).map(([key, anchor]) => [key, point(anchor.x + dx, anchor.y + dy)]),
    );

    return spec;
  }

  function createPalette(rng) {
    return pick(rng, THEMES);
  }

  function createMuzzleAttachment(rng, barrel, palette) {
    const type = pick(rng, ['suppressor', 'brake']);
    if (type === 'suppressor') {
      const length = range(rng, 38, 78);
      const height = barrel.width * 2.2;
      return {
        name: 'suppressor',
        fill: palette.attachment,
        stroke: palette.stroke,
        points: createReceiverPolygon(barrel.endX - length, barrel.centerY - height * 0.5, length, height, {
          topInset: height * 0.08,
          frontBevel: length * 0.04,
          rearBevel: length * 0.02,
          lowerRearCut: length * 0.04,
          lowerFrontCut: length * 0.02,
          belly: height * 0.08,
        }),
      };
    }

    const width = 18;
    const height = barrel.width * 2.3;
    return {
      name: 'muzzle brake',
      fill: palette.attachment,
      stroke: palette.stroke,
      points: createReceiverPolygon(barrel.endX - width, barrel.centerY - height * 0.5, width, height, {
        topInset: height * 0.14,
        frontBevel: width * 0.2,
        rearBevel: width * 0.14,
        lowerRearCut: width * 0.22,
        lowerFrontCut: width * 0.18,
        belly: height * 0.12,
      }),
    };
  }

  function createOpticAttachment(type, anchor, palette) {
    if (type === 'scope') {
      return {
        name: 'scope',
        fill: palette.attachment,
        stroke: palette.stroke,
        points: [
          point(anchor.x - 10, anchor.y),
          point(anchor.x + 64, anchor.y),
          point(anchor.x + 76, anchor.y + 12),
          point(anchor.x + 68, anchor.y + 28),
          point(anchor.x + 6, anchor.y + 28),
          point(anchor.x - 8, anchor.y + 12),
        ],
        mount: rectPolygon(anchor.x + 16, anchor.y + 28, 28, 10),
      };
    }

    if (type === 'micro') {
      return {
        name: 'micro optic',
        fill: palette.attachment,
        stroke: palette.stroke,
        points: [
          point(anchor.x, anchor.y + 8),
          point(anchor.x + 24, anchor.y),
          point(anchor.x + 36, anchor.y + 6),
          point(anchor.x + 28, anchor.y + 24),
          point(anchor.x + 6, anchor.y + 24),
        ],
        mount: rectPolygon(anchor.x + 8, anchor.y + 24, 16, 8),
      };
    }

    return {
      name: type === 'tube' ? 'tube sight' : 'reflex sight',
      fill: palette.attachment,
      stroke: palette.stroke,
      points: type === 'tube'
        ? [
          point(anchor.x, anchor.y + 8),
          point(anchor.x + 48, anchor.y + 2),
          point(anchor.x + 56, anchor.y + 12),
          point(anchor.x + 44, anchor.y + 24),
          point(anchor.x + 4, anchor.y + 26),
        ]
        : [
          point(anchor.x + 4, anchor.y + 10),
          point(anchor.x + 22, anchor.y),
          point(anchor.x + 44, anchor.y + 8),
          point(anchor.x + 38, anchor.y + 28),
          point(anchor.x + 10, anchor.y + 28),
        ],
      mount: rectPolygon(anchor.x + 10, anchor.y + 26, type === 'tube' ? 22 : 18, 8),
    };
  }

  function createSideAttachment(kind, anchor, palette) {
    const base = rectPolygon(anchor.x, anchor.y, kind === 'flashlight' ? 42 : 30, kind === 'flashlight' ? 14 : 12);
    return {
      name: kind,
      fill: palette.attachment,
      stroke: palette.stroke,
      points: base,
    };
  }

  function generatePistolSpec(rng, palette) {
    const frameX = range(rng, 280, 340);
    const frameY = range(rng, 155, 178);
    const slideWidth = range(rng, 220, 300);
    const slideHeight = range(rng, 44, 60);
    const frameHeight = slideHeight + range(rng, 34, 52);
    const dustCover = range(rng, 80, 118);
    const barrelLength = range(rng, 90, 136);
    const gripAnchor = point(frameX + slideWidth * range(rng, 0.58, 0.7), frameY + slideHeight + range(rng, 18, 26));
    const grip = {
      points: createGripPolygon(gripAnchor, range(rng, 104, 136), range(rng, 26, 34), range(rng, 42, 52), range(rng, 20, 30)),
      fill: palette.bodyB,
      stroke: palette.stroke,
    };

    const gripBounds = boundsFromPoints(grip.points);
    const magAnchor = point(gripBounds.left + (gripBounds.right - gripBounds.left) * 0.45, gripBounds.top + 22);
    const magTilt = range(rng, 4, 9);
    const magazine = {
      points: createMagazinePolygon(magAnchor, range(rng, 24, 30), range(rng, 72, 112), magTilt, range(rng, 1.02, 1.12)),
      fill: palette.attachment,
      stroke: palette.stroke,
    };

    const frame = {
      points: [
        point(frameX + dustCover * 0.18, frameY + slideHeight - 3),
        point(frameX + slideWidth * 0.94, frameY + slideHeight - 3),
        point(frameX + slideWidth, frameY + slideHeight + 18),
        point(frameX + slideWidth * 0.92, frameY + frameHeight * 0.9),
        point(frameX + slideWidth * 0.66, frameY + frameHeight),
        point(frameX + dustCover * 0.44, frameY + frameHeight),
        point(frameX, frameY + slideHeight + 18),
        point(frameX + dustCover * 0.08, frameY + slideHeight + 4),
      ],
      fill: palette.bodyB,
      stroke: palette.stroke,
    };

    const slide = {
      points: [
        point(frameX + range(rng, 10, 16), frameY + range(rng, 1, 4)),
        point(frameX + slideWidth - range(rng, 10, 24), frameY),
        point(frameX + slideWidth, frameY + range(rng, 10, 14)),
        point(frameX + slideWidth - range(rng, 6, 12), frameY + slideHeight),
        point(frameX + range(rng, 0, 5), frameY + slideHeight),
      ],
      fill: palette.bodyA,
      stroke: palette.stroke,
    };

    const barrel = {
      startX: frameX + range(rng, 18, 28),
      endX: frameX - barrelLength,
      centerY: frameY + slideHeight * 0.5,
      width: range(rng, 5, 7),
    };

    const accents = [
      {
        stroke: palette.detail,
        width: 2,
        points: [point(frameX + 22, frameY + slideHeight * 0.42), point(frameX + slideWidth - 28, frameY + slideHeight * 0.36)],
      },
      {
        stroke: palette.detail,
        width: 2,
        points: [point(frameX + dustCover * 0.24, frameY + slideHeight + 18), point(frameX + dustCover * 0.94, frameY + slideHeight + 18)],
      },
    ];

    const attachments = [];
    const attachmentNames = [];

    if (chance(rng, 0.22)) {
      const optic = createOpticAttachment('micro', point(frameX + slideWidth * 0.56, frameY - 18), palette);
      attachments.push(optic);
      attachmentNames.push(optic.name);
    }

    if (chance(rng, 0.28)) {
      const light = createSideAttachment('flashlight', point(frameX + dustCover * 0.28, frameY + slideHeight + 20), palette);
      attachments.push(light);
      attachmentNames.push(light.name);
    }

    if (chance(rng, 0.12)) {
      const muzzle = createMuzzleAttachment(rng, barrel, palette);
      attachments.push(muzzle);
      attachmentNames.push(muzzle.name);
    }

    return normalizeSpec({
      type: 'pistol',
      palette,
      receiver: null,
      handguard: null,
      stock: null,
      frame,
      slide,
      grip,
      magazine,
      barrel,
      accents,
      attachments,
      anchors: {
        optic: point(frameX + slideWidth * 0.58, frameY - 12),
      },
      meta: {
        attachmentNames,
        parts: ['chassis', 'barrel', 'magazine', 'pistol grip', ...attachmentNames],
      },
    });
  }

  function generateLongGunSpec(rng, palette, type) {
    const tuning = {
      smg: {
        receiverRange: [240, 320],
        receiverHeight: [62, 82],
        handguardRange: [96, 158],
        barrelRange: [110, 170],
        gripLength: [96, 118],
        gripLean: [18, 28],
        magLength: [118, 168],
        magWidth: [28, 36],
        magCurve: [1, 1.06],
        stockChance: 0.46,
        stockTypes: ['pdw', 'skeletal', 'fixed'],
        opticChance: 0.54,
        opticTypes: ['reflex', 'tube'],
        muzzleChance: 0.2,
        lightChance: 0.24,
        laserChance: 0.18,
        forwardMagBias: 0.56,
      },
      assault: {
        receiverRange: [300, 380],
        receiverHeight: [68, 86],
        handguardRange: [160, 238],
        barrelRange: [170, 240],
        gripLength: [104, 126],
        gripLean: [20, 28],
        magLength: [126, 176],
        magWidth: [30, 38],
        magCurve: [1.05, 1.16],
        stockChance: 0.86,
        stockTypes: ['fixed', 'skeletal', 'pdw'],
        opticChance: 0.72,
        opticTypes: ['reflex', 'tube', 'scope'],
        muzzleChance: 0.48,
        lightChance: 0.34,
        laserChance: 0.24,
        forwardMagBias: 0.88,
      },
      battle: {
        receiverRange: [330, 420],
        receiverHeight: [74, 92],
        handguardRange: [165, 240],
        barrelRange: [190, 268],
        gripLength: [106, 130],
        gripLean: [18, 26],
        magLength: [138, 184],
        magWidth: [34, 42],
        magCurve: [1.02, 1.12],
        stockChance: 0.84,
        stockTypes: ['fixed', 'skeletal'],
        opticChance: 0.68,
        opticTypes: ['tube', 'scope'],
        muzzleChance: 0.58,
        lightChance: 0.26,
        laserChance: 0.18,
        forwardMagBias: 0.92,
      },
      dmr: {
        receiverRange: [360, 460],
        receiverHeight: [76, 94],
        handguardRange: [210, 310],
        barrelRange: [240, 330],
        gripLength: [108, 132],
        gripLean: [18, 24],
        magLength: [126, 168],
        magWidth: [32, 40],
        magCurve: [1, 1.08],
        stockChance: 0.92,
        stockTypes: ['fixed', 'skeletal'],
        opticChance: 0.94,
        opticTypes: ['scope'],
        muzzleChance: 0.44,
        lightChance: 0.16,
        laserChance: 0.08,
        forwardMagBias: 0.95,
      },
    }[type];

    const receiverX = range(rng, 336, 412);
    const receiverY = range(rng, 148, 178);
    const receiverWidth = range(rng, tuning.receiverRange[0], tuning.receiverRange[1]);
    const receiverHeight = range(rng, tuning.receiverHeight[0], tuning.receiverHeight[1]);
    const handguardWidth = range(rng, tuning.handguardRange[0], tuning.handguardRange[1]);
    const handguardHeight = receiverHeight * range(rng, 0.86, 0.96);
    const handguardFrontX = receiverX - handguardWidth + range(rng, -10, 8);
    const handguardY = receiverY + range(rng, 4, 12);
    const barrelLength = range(rng, tuning.barrelRange[0], tuning.barrelRange[1]);

    const receiver = {
      points: createReceiverPolygon(receiverX, receiverY, receiverWidth, receiverHeight, {
        topInset: receiverHeight * range(rng, 0.08, 0.14),
        frontBevel: receiverWidth * range(rng, 0.05, 0.08),
        rearBevel: receiverWidth * range(rng, 0.05, 0.11),
        lowerRearCut: receiverWidth * range(rng, 0.08, 0.16),
        lowerFrontCut: receiverWidth * range(rng, 0.05, 0.1),
        belly: receiverHeight * range(rng, 0.12, 0.2),
      }),
      fill: palette.bodyA,
      stroke: palette.stroke,
    };

    const handguard = {
      points: createHandguardPolygon(handguardFrontX, handguardY, handguardWidth, handguardHeight, {
        noseDrop: handguardHeight * range(rng, 0.16, 0.26),
        lowerInset: handguardWidth * range(rng, 0.06, 0.12),
        rearDrop: handguardHeight * range(rng, 0.1, 0.18),
      }),
      fill: palette.bodyB,
      stroke: palette.stroke,
    };

    const gripAnchor = point(receiverX + receiverWidth * range(rng, 0.62, 0.72), receiverY + receiverHeight * range(rng, 0.8, 0.92));
    const grip = {
      points: createGripPolygon(
        gripAnchor,
        range(rng, tuning.gripLength[0], tuning.gripLength[1]),
        range(rng, 26, 34),
        range(rng, 42, 56),
        range(rng, tuning.gripLean[0], tuning.gripLean[1]),
      ),
      fill: palette.bodyB,
      stroke: palette.stroke,
    };

    const forwardMagazine = chance(rng, tuning.forwardMagBias);
    const magazineAnchor = forwardMagazine
      ? point(receiverX + receiverWidth * range(rng, 0.28, 0.42), receiverY + receiverHeight * range(rng, 0.82, 0.94))
      : point(boundsFromPoints(grip.points).left + 4, receiverY + receiverHeight * 0.88);

    const magTilt = forwardMagazine ? range(rng, -8, 4) : range(rng, 6, 10);
    const magazine = {
      points: createMagazinePolygon(
        magazineAnchor,
        range(rng, tuning.magWidth[0], tuning.magWidth[1]),
        range(rng, tuning.magLength[0], tuning.magLength[1]),
        magTilt,
        range(rng, tuning.magCurve[0], tuning.magCurve[1]),
      ),
      fill: palette.attachment,
      stroke: palette.stroke,
    };

    const barrel = {
      startX: handguardFrontX + range(rng, 10, 18),
      endX: handguardFrontX - barrelLength,
      centerY: handguardY + handguardHeight * range(rng, 0.28, 0.36),
      width: range(rng, 5.5, 8.5),
    };

    const railY = Math.min(...receiver.points.map((item) => item.y)) - range(rng, 4, 8);
    const railFront = handguardFrontX + handguardWidth * range(rng, 0.42, 0.7);
    const railRear = receiverX + receiverWidth * range(rng, 0.7, 0.94);

    const accents = [
      {
        stroke: palette.detail,
        width: 2,
        points: [point(railFront, railY + 7), point(railRear, railY + 7)],
      },
      {
        stroke: palette.detail,
        width: 2,
        points: [point(handguardFrontX + 22, handguardY + handguardHeight * 0.42), point(handguardFrontX + handguardWidth - 28, handguardY + handguardHeight * 0.42)],
      },
      {
        stroke: palette.detail,
        width: 2,
        points: [point(receiverX + 18, receiverY + receiverHeight * 0.36), point(receiverX + receiverWidth - 30, receiverY + receiverHeight * 0.34)],
      },
    ];

    let stock = null;
    if (chance(rng, tuning.stockChance)) {
      const stockType = pick(rng, tuning.stockTypes);
      stock = {
        points: createStockPolygon(
          stockType,
          receiverX + receiverWidth - range(rng, 8, 14),
          receiverY + receiverHeight * range(rng, 0.02, 0.08),
          range(rng, type === 'smg' ? 92 : 122, type === 'smg' ? 164 : 218),
          range(rng, 56, type === 'smg' ? 90 : 112),
        ),
        fill: palette.bodyB,
        stroke: palette.stroke,
      };
    }

    const attachments = [];
    const attachmentNames = [];

    if (chance(rng, tuning.opticChance)) {
      const opticType = pick(rng, tuning.opticTypes);
      const optic = createOpticAttachment(opticType, point(railFront + range(rng, 18, 42), railY - (opticType === 'scope' ? 24 : 16)), palette);
      attachments.push(optic);
      attachmentNames.push(optic.name);
    }

    if (chance(rng, tuning.lightChance)) {
      const light = createSideAttachment('flashlight', point(handguardFrontX + handguardWidth * range(rng, 0.22, 0.54), handguardY + handguardHeight + 8), palette);
      attachments.push(light);
      attachmentNames.push(light.name);
    }

    if (chance(rng, tuning.laserChance)) {
      const laser = createSideAttachment('laser', point(handguardFrontX + handguardWidth * range(rng, 0.14, 0.42), handguardY + handguardHeight * range(rng, 0.56, 0.68)), palette);
      attachments.push(laser);
      attachmentNames.push(laser.name);
    }

    if (chance(rng, tuning.muzzleChance)) {
      const muzzle = createMuzzleAttachment(rng, barrel, palette);
      attachments.push(muzzle);
      attachmentNames.push(muzzle.name);
    }

    return normalizeSpec({
      type,
      palette,
      receiver,
      frame: null,
      slide: null,
      handguard,
      stock,
      grip,
      magazine,
      barrel,
      accents,
      attachments,
      anchors: {
        optic: point(railFront + 18, railY - 12),
      },
      meta: {
        attachmentNames,
        parts: ['chassis', 'barrel', 'magazine', 'pistol grip', ...(stock ? ['stock'] : []), ...attachmentNames],
      },
    });
  }

  function chooseWeaponClass(rng, requestedClass) {
    if (requestedClass && requestedClass !== 'any') {
      return requestedClass;
    }
    return weightedPick(rng, CLASS_CHOICES);
  }

  function generateWeaponSpec(seedText, requestedClass) {
    const rng = createRng(`${seedText}::${requestedClass}`);
    const palette = createPalette(rng);
    const weaponClass = chooseWeaponClass(rng, requestedClass);

    if (weaponClass === 'pistol') {
      return generatePistolSpec(rng, palette);
    }

    return generateLongGunSpec(rng, palette, weaponClass);
  }

  function validateWeaponSpec(spec) {
    if (spec.barrel.endX >= spec.barrel.startX) {
      return false;
    }

    if (!spec.meta.parts.includes('chassis') || !spec.meta.parts.includes('barrel') || !spec.meta.parts.includes('magazine') || !spec.meta.parts.includes('pistol grip')) {
      return false;
    }

    const magBounds = boundsFromPoints(spec.magazine.points);
    if (magBounds.top < CENTER_Y - 15) {
      return false;
    }

    return true;
  }

  function ensureValidSpec(seedText, weaponClass) {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const spec = generateWeaponSpec(`${seedText}#${attempt}`, weaponClass);
      if (validateWeaponSpec(spec)) {
        spec.seed = seedText;
        return spec;
      }
    }

    const fallback = generateWeaponSpec(`${seedText}#fallback`, weaponClass);
    fallback.seed = seedText;
    return fallback;
  }

  function renderShapeGroup(parent, points, fill, stroke, strokeWidth = 3.2, extra = {}) {
    parent.appendChild(createElement('polygon', {
      points: polygonToString(points),
      fill,
      stroke,
      'stroke-width': strokeWidth,
      'stroke-linejoin': 'round',
      'stroke-linecap': 'round',
      ...extra,
    }));
  }

  function renderAttachmentMount(parent, attachment) {
    if (!attachment.mount) {
      return;
    }

    parent.appendChild(createElement('polygon', {
      points: polygonToString(attachment.mount),
      fill: 'url(#attachmentGradient)',
      stroke: attachment.stroke,
      'stroke-width': 2.6,
      'stroke-linejoin': 'round',
    }));
  }

  function renderWeaponSvg(svg, spec) {
    clearNode(svg);

    const defs = createElement('defs');
    defs.appendChild(createElement('linearGradient', { id: 'bodyGradient', x1: '0%', y1: '0%', x2: '100%', y2: '100%' }));
    defs.lastChild.appendChild(createElement('stop', { offset: '0%', 'stop-color': spec.palette.bodyA }));
    defs.lastChild.appendChild(createElement('stop', { offset: '100%', 'stop-color': spec.palette.bodyB }));

    defs.appendChild(createElement('linearGradient', { id: 'attachmentGradient', x1: '0%', y1: '0%', x2: '100%', y2: '100%' }));
    defs.lastChild.appendChild(createElement('stop', { offset: '0%', 'stop-color': spec.palette.accent }));
    defs.lastChild.appendChild(createElement('stop', { offset: '100%', 'stop-color': spec.palette.attachment }));

    defs.appendChild(createElement('filter', { id: 'glow', x: '-20%', y: '-20%', width: '140%', height: '140%' }));
    defs.lastChild.appendChild(createElement('feDropShadow', {
      dx: '0',
      dy: '10',
      stdDeviation: '12',
      'flood-color': '#000000',
      'flood-opacity': '0.35',
    }));

    svg.appendChild(defs);
    svg.appendChild(createElement('rect', { x: 0, y: 0, width: VIEWBOX.width, height: VIEWBOX.height, fill: spec.palette.shadow }));

    const grid = createElement('g', { opacity: 0.2 });
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
    svg.appendChild(grid);

    const shadowGroup = createElement('g', { filter: 'url(#glow)' });
    const bodyGroup = createElement('g');
    const accentGroup = createElement('g');
    const attachmentGroup = createElement('g');

    const renderBodyShape = (shape, fillOverride = null) => {
      if (!shape) {
        return;
      }
      renderShapeGroup(shadowGroup, shape.points, fillOverride || shape.fill, shape.stroke);
    };

    renderBodyShape(spec.handguard, 'url(#bodyGradient)');
    renderBodyShape(spec.receiver, 'url(#bodyGradient)');
    renderBodyShape(spec.frame, 'url(#bodyGradient)');
    renderBodyShape(spec.slide, spec.slide ? spec.slide.fill : null);
    renderBodyShape(spec.stock, spec.stock ? spec.stock.fill : null);
    renderBodyShape(spec.grip, spec.grip.fill);
    renderBodyShape(spec.magazine, 'url(#attachmentGradient)');

    shadowGroup.appendChild(createElement('rect', {
      x: spec.barrel.endX,
      y: spec.barrel.centerY - spec.barrel.width,
      width: spec.barrel.startX - spec.barrel.endX,
      height: spec.barrel.width * 2,
      rx: spec.barrel.width * 0.9,
      fill: 'url(#attachmentGradient)',
      stroke: spec.palette.stroke,
      'stroke-width': 2.8,
    }));

    svg.appendChild(shadowGroup);

    spec.accents.forEach((accent) => {
      bodyGroup.appendChild(createElement('polyline', {
        points: polygonToString(accent.points),
        fill: 'none',
        stroke: accent.stroke,
        'stroke-width': accent.width,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        opacity: 0.85,
      }));
    });

    const triggerX = spec.type === 'pistol'
      ? boundsFromPoints(spec.frame.points).left + (boundsFromPoints(spec.frame.points).right - boundsFromPoints(spec.frame.points).left) * 0.56
      : boundsFromPoints(spec.receiver.points).left + (boundsFromPoints(spec.receiver.points).right - boundsFromPoints(spec.receiver.points).left) * 0.64;
    const triggerY = spec.type === 'pistol'
      ? boundsFromPoints(spec.frame.points).top + (boundsFromPoints(spec.frame.points).bottom - boundsFromPoints(spec.frame.points).top) * 0.74
      : boundsFromPoints(spec.receiver.points).top + (boundsFromPoints(spec.receiver.points).bottom - boundsFromPoints(spec.receiver.points).top) * 0.8;

    bodyGroup.appendChild(createElement('path', {
      d: `M ${triggerX - 12} ${triggerY} Q ${triggerX} ${triggerY + 24} ${triggerX + 16} ${triggerY + 6}`,
      fill: 'none',
      stroke: spec.palette.detail,
      'stroke-width': 3,
      'stroke-linecap': 'round',
    }));

    bodyGroup.appendChild(createElement('path', {
      d: `M ${triggerX - 18} ${triggerY - 4} Q ${triggerX - 4} ${triggerY - 26} ${triggerX + 18} ${triggerY - 8}`,
      fill: 'none',
      stroke: spec.palette.stroke,
      'stroke-width': 3,
      'stroke-linecap': 'round',
    }));

    spec.attachments.forEach((attachment) => {
      if (attachment.points) {
        renderShapeGroup(attachmentGroup, attachment.points, attachment.fill || 'url(#attachmentGradient)', attachment.stroke, 2.8);
      }
      renderAttachmentMount(attachmentGroup, attachment);
    });

    svg.appendChild(bodyGroup);
    svg.appendChild(accentGroup);
    svg.appendChild(attachmentGroup);

    const caption = createElement('g', { opacity: 0.95 });
    caption.appendChild(createElement('text', {
      x: 28,
      y: 34,
      fill: spec.palette.stroke,
      'font-size': 20,
      'font-family': 'Inter, system-ui, sans-serif',
      'font-weight': 700,
    }));
    caption.lastChild.textContent = CLASS_LABELS[spec.type];

    caption.appendChild(createElement('text', {
      x: 28,
      y: 58,
      fill: spec.palette.detail,
      'font-size': 12,
      'font-family': 'Inter, system-ui, sans-serif',
      'letter-spacing': '0.12em',
      'text-transform': 'uppercase',
    }));
    caption.lastChild.textContent = spec.meta.attachmentNames.length ? spec.meta.attachmentNames.join(' • ') : 'Base configuration';
    svg.appendChild(caption);
  }

  function updateMeta(spec, elements) {
    elements.classPill.textContent = `Class: ${CLASS_LABELS[spec.type]}`;
    elements.seedPill.textContent = `Seed: ${spec.seed}`;
    elements.attachmentPill.textContent = `Attachments: ${spec.meta.attachmentNames.length ? spec.meta.attachmentNames.join(', ') : 'none'}`;
  }

  function bootstrap() {
    if (typeof document === 'undefined') {
      return;
    }

    const svg = document.getElementById('weaponSvg');
    const weaponClass = document.getElementById('weaponClass');
    const seedInput = document.getElementById('seedInput');
    const randomizeButton = document.getElementById('randomizeButton');
    const classPill = document.getElementById('classPill');
    const seedPill = document.getElementById('seedPill');
    const attachmentPill = document.getElementById('attachmentPill');

    const elements = { classPill, seedPill, attachmentPill };

    function renderFromSeed(seedText) {
      const spec = ensureValidSpec(seedText, weaponClass.value);
      renderWeaponSvg(svg, spec);
      updateMeta(spec, elements);
    }

    function randomize() {
      const seed = createSeed();
      seedInput.value = seed;
      renderFromSeed(seed);
    }

    randomizeButton.addEventListener('click', randomize);

    weaponClass.addEventListener('change', () => {
      const seed = seedInput.value.trim() || createSeed();
      if (!seedInput.value.trim()) {
        seedInput.value = seed;
      }
      renderFromSeed(seed);
    });

    seedInput.addEventListener('change', () => {
      const seed = seedInput.value.trim();
      if (seed) {
        renderFromSeed(seed);
      }
    });

    seedInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const seed = seedInput.value.trim() || createSeed();
        seedInput.value = seed;
        renderFromSeed(seed);
      }
    });

    randomize();
  }

  bootstrap();
})();
