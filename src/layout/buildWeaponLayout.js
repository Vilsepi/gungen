import { VIEWBOX } from '../model/constants.js';
import {
  boundsFromPoints,
  createGripPolygon,
  createHandguardPolygon,
  createMagazinePolygon,
  createReceiverPolygon,
  createStockPolygon,
  fitPointsToViewbox,
  point,
  rectPolygon,
  shiftBounds,
  shiftPoints,
} from './primitives.js';

function createThemeMap(themeName, themes) {
  return themes.find((theme) => theme.name === themeName) ?? themes[0];
}

function normalizeLayout(layout) {
  const fit = fitPointsToViewbox([
    ...Object.values(layout.parts).filter(Boolean),
    ...layout.attachments.filter((item) => item.points),
    { points: [point(layout.barrel.startX, layout.barrel.centerY - layout.barrel.width), point(layout.barrel.endX, layout.barrel.centerY + layout.barrel.width)] },
  ], VIEWBOX);

  for (const key of Object.keys(layout.parts)) {
    const part = layout.parts[key];
    if (part) {
      part.points = shiftPoints(part.points, fit.dx, fit.dy);
      part.bounds = shiftBounds(part.bounds, fit.dx, fit.dy);
    }
  }

  layout.barrel = {
    ...layout.barrel,
    startX: layout.barrel.startX + fit.dx,
    endX: layout.barrel.endX + fit.dx,
    centerY: layout.barrel.centerY + fit.dy,
  };

  layout.accents = layout.accents.map((accent) => ({
    ...accent,
    points: shiftPoints(accent.points, fit.dx, fit.dy),
  }));

  layout.attachments = layout.attachments.map((attachment) => {
    if (attachment.points) {
      return {
        ...attachment,
        points: shiftPoints(attachment.points, fit.dx, fit.dy),
        mount: attachment.mount ? shiftPoints(attachment.mount, fit.dx, fit.dy) : attachment.mount,
      };
    }

    return attachment;
  });

  layout.anchors = Object.fromEntries(
    Object.entries(layout.anchors).map(([key, anchor]) => [key, point(anchor.x + fit.dx, anchor.y + fit.dy)]),
  );

  layout.controls = {
    trigger: point(layout.controls.trigger.x + fit.dx, layout.controls.trigger.y + fit.dy),
    guardStart: point(layout.controls.guardStart.x + fit.dx, layout.controls.guardStart.y + fit.dy),
    guardEnd: point(layout.controls.guardEnd.x + fit.dx, layout.controls.guardEnd.y + fit.dy),
  };

  return layout;
}

function createPart(name, points, fill, stroke) {
  return { name, points, fill, stroke, bounds: boundsFromPoints(points) };
}

function createAttachmentGeometry(attachment, anchors, palette, family, profileHint) {
  if (attachment.slot === 'muzzle') {
    if (attachment.type === 'suppressor') {
      const length = family === 'pistol' ? 62 : 74;
      const height = family === 'pistol' ? 18 : 22;
      const x = anchors.muzzle.x - length;
      const y = anchors.muzzle.y - height * 0.5;
      return {
        ...attachment,
        points: createReceiverPolygon(x, y, length, height, {
          topInset: height * 0.1,
          frontBevel: length * 0.04,
          rearBevel: length * 0.04,
          lowerRearCut: length * 0.04,
          lowerFrontCut: length * 0.03,
          belly: height * 0.08,
        }),
        fill: palette.attachment,
        stroke: palette.stroke,
      };
    }

    return {
      ...attachment,
      points: createReceiverPolygon(anchors.muzzle.x - 18, anchors.muzzle.y - 10, 18, 20, {
        topInset: 3,
        frontBevel: 4,
        rearBevel: 3,
        lowerRearCut: 4,
        lowerFrontCut: 3,
        belly: 3,
      }),
      fill: palette.attachment,
      stroke: palette.stroke,
    };
  }

  if (attachment.slot === 'top') {
    if (attachment.type === 'scope') {
      return {
        ...attachment,
        points: [
          point(anchors.top.x - 10, anchors.top.y),
          point(anchors.top.x + 64, anchors.top.y),
          point(anchors.top.x + 76, anchors.top.y + 12),
          point(anchors.top.x + 68, anchors.top.y + 28),
          point(anchors.top.x + 6, anchors.top.y + 28),
          point(anchors.top.x - 8, anchors.top.y + 12),
        ],
        mount: rectPolygon(anchors.top.x + 16, anchors.top.y + 28, 28, 10),
        fill: palette.attachment,
        stroke: palette.stroke,
      };
    }

    if (attachment.type === 'micro') {
      return {
        ...attachment,
        points: [
          point(anchors.top.x, anchors.top.y + 8),
          point(anchors.top.x + 24, anchors.top.y),
          point(anchors.top.x + 36, anchors.top.y + 6),
          point(anchors.top.x + 28, anchors.top.y + 24),
          point(anchors.top.x + 6, anchors.top.y + 24),
        ],
        mount: rectPolygon(anchors.top.x + 8, anchors.top.y + 24, 16, 8),
        fill: palette.attachment,
        stroke: palette.stroke,
      };
    }

    return {
      ...attachment,
      points: attachment.type === 'tube'
        ? [
          point(anchors.top.x, anchors.top.y + 8),
          point(anchors.top.x + 48, anchors.top.y + 2),
          point(anchors.top.x + 56, anchors.top.y + 12),
          point(anchors.top.x + 44, anchors.top.y + 24),
          point(anchors.top.x + 4, anchors.top.y + 26),
        ]
        : [
          point(anchors.top.x + 4, anchors.top.y + 10),
          point(anchors.top.x + 22, anchors.top.y),
          point(anchors.top.x + 44, anchors.top.y + 8),
          point(anchors.top.x + 38, anchors.top.y + 28),
          point(anchors.top.x + 10, anchors.top.y + 28),
        ],
      mount: rectPolygon(anchors.top.x + 10, anchors.top.y + 26, attachment.type === 'tube' ? 22 : 18, 8),
      fill: palette.attachment,
      stroke: palette.stroke,
    };
  }

  const width = attachment.type === 'flashlight' ? 42 : 30;
  const height = attachment.type === 'flashlight' ? 14 : 12;
  const anchor = attachment.slot === 'underbarrel' ? anchors.underbarrel : anchors.side;
  const y = attachment.slot === 'underbarrel' ? anchor.y : anchor.y + (profileHint === 'vented' ? 2 : 0);

  return {
    ...attachment,
    points: rectPolygon(anchor.x, y, width, height),
    fill: palette.attachment,
    stroke: palette.stroke,
  };
}

function buildPistolLayout(spec, palette) {
  const frameX = 320;
  const frameY = 146;
  const slideWidth = spec.body.frameLength;
  const slideHeight = spec.body.slideHeight;
  const frameHeight = spec.body.frameHeight;
  const dustCover = slideWidth * spec.body.dustCoverRatio;

  const gripAnchor = point(frameX + slideWidth * spec.grip.rearBias, frameY + slideHeight + 20);
  const grip = createPart('grip', createGripPolygon(gripAnchor, spec.grip.length, spec.grip.widthTop, spec.grip.widthBottom, spec.grip.lean), palette.bodyB, palette.stroke);

  const gripBounds = grip.bounds;
  const magazineAnchor = point(gripBounds.left + (gripBounds.right - gripBounds.left) * 0.45, gripBounds.top + 22);
  const magazine = createPart('magazine', createMagazinePolygon(magazineAnchor, spec.magazine.width, spec.magazine.length, spec.magazine.tilt, spec.magazine.flare), palette.attachment, palette.stroke);

  const frame = createPart('frame', [
    point(frameX + dustCover * 0.18, frameY + slideHeight - 3),
    point(frameX + slideWidth * 0.94, frameY + slideHeight - 3),
    point(frameX + slideWidth, frameY + slideHeight + 18),
    point(frameX + slideWidth * 0.92, frameY + frameHeight * 0.9),
    point(frameX + slideWidth * 0.66, frameY + frameHeight),
    point(frameX + dustCover * 0.44, frameY + frameHeight),
    point(frameX, frameY + slideHeight + 18),
    point(frameX + dustCover * 0.08, frameY + slideHeight + 4),
  ], palette.bodyB, palette.stroke);

  const slide = createPart('slide', [
    point(frameX + 12, frameY + 2),
    point(frameX + slideWidth - 16, frameY),
    point(frameX + slideWidth, frameY + 12),
    point(frameX + slideWidth - 8, frameY + slideHeight),
    point(frameX + 2, frameY + slideHeight),
  ], palette.bodyA, palette.stroke);

  const barrel = {
    startX: frameX + spec.barrel.offsetFromFrame,
    endX: frameX - spec.barrel.length,
    centerY: frameY + slideHeight * 0.5,
    width: spec.barrel.width,
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

  const anchors = {
    top: point(frameX + slideWidth * 0.56, frameY - 18),
    muzzle: point(barrel.endX, barrel.centerY),
    underbarrel: point(frameX + dustCover * 0.28, frameY + slideHeight + 20),
    side: point(frameX + dustCover * 0.22, frameY + slideHeight + 10),
  };

  return {
    type: spec.class,
    palette,
    theme: spec.theme,
    metadata: spec.metadata,
    parts: { receiver: null, handguard: null, stock: null, frame, slide, grip, magazine },
    barrel,
    accents,
    anchors,
    controls: {
      trigger: point(frame.bounds.left + (frame.bounds.right - frame.bounds.left) * 0.56, frame.bounds.top + (frame.bounds.bottom - frame.bounds.top) * 0.74),
      guardStart: point(frame.bounds.left + (frame.bounds.right - frame.bounds.left) * 0.48, frame.bounds.top + (frame.bounds.bottom - frame.bounds.top) * 0.66),
      guardEnd: point(frame.bounds.left + (frame.bounds.right - frame.bounds.left) * 0.68, frame.bounds.top + (frame.bounds.bottom - frame.bounds.top) * 0.64),
    },
    attachments: spec.attachments.map((attachment) => createAttachmentGeometry(attachment, anchors, palette, spec.family)),
    spec,
  };
}

function buildLongGunLayout(spec, palette) {
  const receiverX = 356;
  const receiverY = 148;
  const receiverWidth = spec.body.receiverLength;
  const receiverHeight = spec.body.receiverHeight;
  const handguardHeight = receiverHeight * spec.body.handguardHeightRatio;
  const handguardWidth = spec.body.handguardLength;
  const handguardX = receiverX - handguardWidth + 4;
  const handguardY = receiverY + 8;

  const receiver = createPart('receiver', createReceiverPolygon(receiverX, receiverY, receiverWidth, receiverHeight, {
    topInset: receiverHeight * 0.1,
    frontBevel: receiverWidth * 0.06,
    rearBevel: receiverWidth * 0.08,
    lowerRearCut: receiverWidth * 0.1,
    lowerFrontCut: receiverWidth * 0.07,
    belly: receiverHeight * 0.16,
  }), palette.bodyA, palette.stroke);

  const handguard = createPart('handguard', createHandguardPolygon(handguardX, handguardY, handguardWidth, handguardHeight, {
    noseDrop: handguardHeight * 0.2,
    lowerInset: handguardWidth * 0.08,
    rearDrop: handguardHeight * 0.12,
  }), palette.bodyB, palette.stroke);

  const gripAnchor = point(receiverX + receiverWidth * spec.grip.rearBias, receiverY + receiverHeight * 0.84);
  const grip = createPart('grip', createGripPolygon(gripAnchor, spec.grip.length, spec.grip.widthTop, spec.grip.widthBottom, spec.grip.lean), palette.bodyB, palette.stroke);

  const magazineAnchor = spec.magazine.placement === 'forward'
    ? point(receiverX + receiverWidth * 0.34, receiverY + receiverHeight * 0.9)
    : point(grip.bounds.left + 4, receiverY + receiverHeight * 0.88);
  const tilt = spec.magazine.placement === 'forward' ? spec.magazine.tiltForward : spec.magazine.tiltRear;
  const magazine = createPart('magazine', createMagazinePolygon(magazineAnchor, spec.magazine.width, spec.magazine.length, tilt, spec.magazine.flare), palette.attachment, palette.stroke);

  const stock = spec.body.stock
    ? createPart('stock', createStockPolygon(spec.body.stock.type, receiverX + receiverWidth - 12, receiverY + receiverHeight * 0.04, spec.body.stock.length, spec.body.stock.height), palette.bodyB, palette.stroke)
    : null;

  const barrel = {
    startX: handguardX + spec.barrel.inset,
    endX: handguardX - spec.barrel.length,
    centerY: handguardY + handguardHeight * 0.32,
    width: spec.barrel.width,
  };

  const railY = receiver.bounds.top - spec.accents.railInset;
  const railFront = handguardX + handguardWidth * 0.52;
  const railRear = receiverX + receiverWidth * 0.88;
  const accents = [
    {
      stroke: palette.detail,
      width: 2,
      points: [point(railFront, railY + 7), point(railRear, railY + 7)],
    },
    {
      stroke: palette.detail,
      width: 2,
      points: [point(handguardX + 22, handguardY + handguardHeight * 0.42), point(handguardX + handguardWidth - 28, handguardY + handguardHeight * 0.42)],
    },
    {
      stroke: palette.detail,
      width: 2,
      points: [point(receiverX + 18, receiverY + receiverHeight * 0.36), point(receiverX + receiverWidth - 30, receiverY + receiverHeight * 0.34)],
    },
  ];

  const anchors = {
    top: point(railFront + 22, railY - 16),
    muzzle: point(barrel.endX, barrel.centerY),
    underbarrel: point(handguardX + handguardWidth * 0.3, handguardY + handguardHeight + 8),
    side: point(handguardX + handguardWidth * 0.24, handguardY + handguardHeight * 0.6),
  };

  return {
    type: spec.class,
    palette,
    theme: spec.theme,
    metadata: spec.metadata,
    parts: { receiver, handguard, stock, frame: null, slide: null, grip, magazine },
    barrel,
    accents,
    anchors,
    controls: {
      trigger: point(receiver.bounds.left + (receiver.bounds.right - receiver.bounds.left) * 0.64, receiver.bounds.top + (receiver.bounds.bottom - receiver.bounds.top) * 0.8),
      guardStart: point(receiver.bounds.left + (receiver.bounds.right - receiver.bounds.left) * 0.56, receiver.bounds.top + (receiver.bounds.bottom - receiver.bounds.top) * 0.72),
      guardEnd: point(receiver.bounds.left + (receiver.bounds.right - receiver.bounds.left) * 0.76, receiver.bounds.top + (receiver.bounds.bottom - receiver.bounds.top) * 0.7),
    },
    attachments: spec.attachments.map((attachment) => createAttachmentGeometry(attachment, anchors, palette, spec.family, spec.body.handguardProfile)),
    spec,
  };
}

export function validateLayout(layout) {
  if (layout.barrel.endX >= layout.barrel.startX) {
    return false;
  }

  if (!layout.parts.grip || !layout.parts.magazine) {
    return false;
  }

  const magTop = layout.parts.magazine.bounds.top;
  return magTop >= 160;
}

export function buildWeaponLayout(spec, themes) {
  const palette = createThemeMap(spec.theme, themes);
  const layout = spec.family === 'pistol'
    ? buildPistolLayout(spec, palette)
    : buildLongGunLayout(spec, palette);

  return normalizeLayout(layout);
}
