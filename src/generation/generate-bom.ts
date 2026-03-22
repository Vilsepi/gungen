import { Connection, PartKind, PartLevel, SeedBundle } from "../core/types";
import { partLevelWeights } from "../core/constants";
import { Part, partConstructors } from "../domain/parts";
import { pickWeighted } from "../random/pick";
import { createPrng } from "../random/prng";
import { normalizeSeedBundle } from "../random/seed";
import { selectAttachments } from "./select-attachments";
import { sizeParts } from "./size-parts";
import { validateWeapon } from "./validate-weapon";

function createPartId(kind: PartKind, index: number): string {
  return `${kind}-${index}`;
}

function selectPartLevel(prng: ReturnType<typeof createPrng>): PartLevel {
  return pickWeighted(prng, partLevelWeights) ?? "Normal";
}

function buildConnections(
  selectedKinds: Set<PartKind>,
  partsByKind: Map<PartKind, Part>,
): Connection[] {
  const connections: Connection[] = [];
  const connect = (
    fromKind: PartKind,
    fromPointId: string,
    toKind: PartKind,
    toPointId: string,
  ) => {
    const fromPart = partsByKind.get(fromKind);
    const toPart = partsByKind.get(toKind);
    if (!fromPart || !toPart) {
      return;
    }
    connections.push({
      fromPartId: fromPart.id,
      fromPointId,
      toPartId: toPart.id,
      toPointId,
    });
  };

  connect("pistolGrip", "mount", "receiver", "bottom");
  connect(
    "magwell",
    "host",
    selectedKinds.has("handguard") ? "receiver" : "receiver",
    "bottom",
  );
  connect("magazine", "feed", "magwell", "mag");

  if (selectedKinds.has("handguard")) {
    connect("handguard", "rear", "receiver", "front");
    connect("barrel", "start", "handguard", "front");
  } else {
    connect("barrel", "start", "receiver", "front");
  }

  if (selectedKinds.has("muzzleDevice")) {
    connect("muzzleDevice", "mount", "barrel", "end");
  }
  if (selectedKinds.has("optic")) {
    connect("optic", "mount", "receiver", "top");
  }
  if (selectedKinds.has("stock")) {
    connect("stock", "mount", "receiver", "rear");
  }
  if (selectedKinds.has("laser")) {
    connect("laser", "mount", "handguard", "side");
  }
  if (selectedKinds.has("flashlight")) {
    connect("flashlight", "mount", "handguard", "bottom");
  }
  if (selectedKinds.has("frontGrip")) {
    connect("frontGrip", "mount", "handguard", "bottom");
  }

  return connections;
}

export function generateBom(seedBundle: SeedBundle): {
  parts: Part[];
  connections: Connection[];
} {
  const normalized = normalizeSeedBundle(seedBundle);
  const dataPrng = createPrng(normalized.dataModelSeed);
  const sizePrng = createPrng(normalized.partSizeSeed);

  const required: PartKind[] = [
    "receiver",
    "barrel",
    "magwell",
    "magazine",
    "pistolGrip",
  ];
  const selectedKinds = new Set<PartKind>(required);
  for (const kind of selectAttachments(seedBundle.category, dataPrng)) {
    selectedKinds.add(kind);
  }

  const parts: Part[] = [];
  const partsByKind = new Map<PartKind, Part>();
  let index = 1;
  for (const kind of selectedKinds) {
    const PartCtor = partConstructors[kind];
    const part = new PartCtor(
      createPartId(kind, index),
      selectPartLevel(dataPrng),
    );
    index += 1;
    parts.push(part);
    partsByKind.set(kind, part);
  }

  sizeParts(parts, seedBundle.category, sizePrng);
  const connections = buildConnections(selectedKinds, partsByKind);
  validateWeapon(seedBundle.category, parts, connections);

  return { parts, connections };
}
