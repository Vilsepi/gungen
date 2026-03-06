import { chance, createRng, pick, range, weightedPick } from '../core/random.js';
import { CLASS_CHOICES, THEMES } from './constants.js';

const LONG_GUN_TUNING = {
  smg: {
    receiverLength: [250, 320],
    receiverHeight: [62, 78],
    handguardLength: [110, 165],
    barrelLength: [120, 185],
    barrelWidth: [5.5, 7.5],
    gripLength: [92, 114],
    gripLean: [18, 26],
    magazineLength: [118, 168],
    magazineWidth: [28, 36],
    magazineFlare: [1, 1.06],
    stockChance: 0.5,
    stockTypes: ['pdw', 'skeletal', 'fixed'],
    opticChance: 0.55,
    opticTypes: ['reflex', 'tube'],
    muzzleChance: 0.24,
    lightChance: 0.28,
    laserChance: 0.18,
    forwardMagazineChance: 0.62,
  },
  assault: {
    receiverLength: [310, 380],
    receiverHeight: [70, 86],
    handguardLength: [170, 240],
    barrelLength: [175, 250],
    barrelWidth: [6, 8],
    gripLength: [102, 124],
    gripLean: [20, 28],
    magazineLength: [126, 176],
    magazineWidth: [30, 38],
    magazineFlare: [1.04, 1.16],
    stockChance: 0.84,
    stockTypes: ['fixed', 'skeletal', 'pdw'],
    opticChance: 0.72,
    opticTypes: ['reflex', 'tube', 'scope'],
    muzzleChance: 0.48,
    lightChance: 0.34,
    laserChance: 0.24,
    forwardMagazineChance: 0.88,
  },
  battle: {
    receiverLength: [340, 420],
    receiverHeight: [74, 92],
    handguardLength: [170, 240],
    barrelLength: [200, 275],
    barrelWidth: [6.5, 8.5],
    gripLength: [104, 128],
    gripLean: [18, 26],
    magazineLength: [138, 184],
    magazineWidth: [34, 42],
    magazineFlare: [1.02, 1.12],
    stockChance: 0.84,
    stockTypes: ['fixed', 'skeletal'],
    opticChance: 0.68,
    opticTypes: ['tube', 'scope'],
    muzzleChance: 0.58,
    lightChance: 0.26,
    laserChance: 0.18,
    forwardMagazineChance: 0.92,
  },
  dmr: {
    receiverLength: [360, 450],
    receiverHeight: [78, 94],
    handguardLength: [220, 300],
    barrelLength: [245, 335],
    barrelWidth: [6.5, 8.8],
    gripLength: [108, 132],
    gripLean: [18, 24],
    magazineLength: [126, 168],
    magazineWidth: [32, 40],
    magazineFlare: [1, 1.08],
    stockChance: 0.92,
    stockTypes: ['fixed', 'skeletal'],
    opticChance: 0.94,
    opticTypes: ['scope'],
    muzzleChance: 0.42,
    lightChance: 0.16,
    laserChance: 0.08,
    forwardMagazineChance: 0.95,
  },
};

function createTheme(rng) {
  return pick(rng, THEMES).name;
}

function chooseWeaponClass(rng, requestedClass) {
  if (requestedClass && requestedClass !== 'any') {
    return requestedClass;
  }
  return weightedPick(rng, CLASS_CHOICES);
}

function createAttachmentList(rng, options) {
  const attachments = [];

  if (options.opticChance && chance(rng, options.opticChance)) {
    attachments.push({ slot: 'top', type: pick(rng, options.opticTypes) });
  }

  if (options.lightChance && chance(rng, options.lightChance)) {
    attachments.push({ slot: 'underbarrel', type: 'flashlight' });
  }

  if (options.laserChance && chance(rng, options.laserChance)) {
    attachments.push({ slot: 'side', type: 'laser' });
  }

  if (options.muzzleChance && chance(rng, options.muzzleChance)) {
    attachments.push({ slot: 'muzzle', type: pick(rng, ['suppressor', 'brake']) });
  }

  return attachments;
}

function createPistolSpec(rng, seed) {
  const attachments = [];
  if (chance(rng, 0.22)) {
    attachments.push({ slot: 'top', type: 'micro' });
  }
  if (chance(rng, 0.28)) {
    attachments.push({ slot: 'underbarrel', type: 'flashlight' });
  }
  if (chance(rng, 0.12)) {
    attachments.push({ slot: 'muzzle', type: pick(rng, ['suppressor', 'brake']) });
  }

  const metadataParts = ['chassis', 'barrel', 'magazine', 'pistol grip', ...attachments.map((item) => item.type)];

  return {
    seed,
    class: 'pistol',
    family: 'pistol',
    theme: createTheme(rng),
    body: {
      coreType: 'frame',
      slideProfile: pick(rng, ['slab', 'beveled', 'tapered']),
      frameProfile: pick(rng, ['compact', 'duty', 'race']),
      frameLength: range(rng, 220, 300),
      frameHeight: range(rng, 86, 112),
      slideHeight: range(rng, 42, 58),
      dustCoverRatio: range(rng, 0.26, 0.42),
    },
    grip: {
      style: 'pistol',
      length: range(rng, 104, 136),
      lean: range(rng, 20, 30),
      widthTop: range(rng, 26, 34),
      widthBottom: range(rng, 42, 52),
      rearBias: range(rng, 0.58, 0.7),
    },
    magazine: {
      placement: 'grip',
      length: range(rng, 72, 112),
      width: range(rng, 24, 30),
      tilt: range(rng, 4, 9),
      flare: range(rng, 1.02, 1.12),
    },
    barrel: {
      length: range(rng, 90, 136),
      width: range(rng, 5, 7),
      offsetFromFrame: range(rng, 18, 28),
    },
    accents: {
      serrationCount: Math.round(range(rng, 3, 6)),
      railSlots: Math.round(range(rng, 2, 4)),
    },
    attachments,
    metadata: {
      attachmentNames: attachments.map((item) => item.type),
      parts: metadataParts,
    },
  };
}

function createLongGunSpec(rng, seed, weaponClass) {
  const tuning = LONG_GUN_TUNING[weaponClass];
  const hasStock = chance(rng, tuning.stockChance);
  const attachments = createAttachmentList(rng, tuning);
  const metadataParts = ['chassis', 'barrel', 'magazine', 'pistol grip', ...(hasStock ? ['stock'] : []), ...attachments.map((item) => item.type)];

  return {
    seed,
    class: weaponClass,
    family: 'longGun',
    theme: createTheme(rng),
    body: {
      coreType: 'receiver',
      receiverProfile: pick(rng, ['angular', 'slab', 'forged']),
      handguardProfile: pick(rng, ['vented', 'blocky', 'tapered']),
      receiverLength: range(rng, tuning.receiverLength[0], tuning.receiverLength[1]),
      receiverHeight: range(rng, tuning.receiverHeight[0], tuning.receiverHeight[1]),
      handguardLength: range(rng, tuning.handguardLength[0], tuning.handguardLength[1]),
      handguardHeightRatio: range(rng, 0.86, 0.96),
      stock: hasStock ? { type: pick(rng, tuning.stockTypes), length: range(rng, weaponClass === 'smg' ? 92 : 122, weaponClass === 'smg' ? 164 : 218), height: range(rng, 56, weaponClass === 'smg' ? 90 : 112) } : null,
    },
    grip: {
      style: 'rifle',
      length: range(rng, tuning.gripLength[0], tuning.gripLength[1]),
      lean: range(rng, tuning.gripLean[0], tuning.gripLean[1]),
      widthTop: range(rng, 26, 34),
      widthBottom: range(rng, 42, 56),
      rearBias: range(rng, 0.62, 0.72),
    },
    magazine: {
      placement: chance(rng, tuning.forwardMagazineChance) ? 'forward' : 'grip-adjacent',
      length: range(rng, tuning.magazineLength[0], tuning.magazineLength[1]),
      width: range(rng, tuning.magazineWidth[0], tuning.magazineWidth[1]),
      tiltForward: range(rng, -8, 4),
      tiltRear: range(rng, 6, 10),
      flare: range(rng, tuning.magazineFlare[0], tuning.magazineFlare[1]),
    },
    barrel: {
      length: range(rng, tuning.barrelLength[0], tuning.barrelLength[1]),
      width: range(rng, tuning.barrelWidth[0], tuning.barrelWidth[1]),
      inset: range(rng, 10, 18),
    },
    accents: {
      ventCount: Math.round(range(rng, 3, 7)),
      railInset: range(rng, 4, 8),
    },
    attachments,
    metadata: {
      attachmentNames: attachments.map((item) => item.type),
      parts: metadataParts,
    },
  };
}

export function validateWeaponSpec(spec) {
  const required = ['chassis', 'barrel', 'magazine', 'pistol grip'];
  return required.every((part) => spec.metadata.parts.includes(part));
}

export function generateWeaponSpec(seedText, requestedClass = 'any') {
  const rng = createRng(`${seedText}::${requestedClass}`);
  const weaponClass = chooseWeaponClass(rng, requestedClass);
  const spec = weaponClass === 'pistol'
    ? createPistolSpec(rng, seedText)
    : createLongGunSpec(rng, seedText, weaponClass);

  return spec;
}
