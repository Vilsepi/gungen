import { describe, expect, it } from "vitest";

import { Connection, PartKind, SeedBundle } from "../core/types";
import { generateBom } from "./generate-bom";

function createSeedBundle(
  category: SeedBundle["category"],
  dataModelSeed: string,
  partSizeSeed: string,
): SeedBundle {
  return {
    category,
    dataModelSeed,
    partSizeSeed,
    aestheticDetailSeed: "unused",
  };
}

function getKinds(result: ReturnType<typeof generateBom>): PartKind[] {
  return result.parts.map((part) => part.kind);
}

function getIdByKind(
  result: ReturnType<typeof generateBom>,
  kind: PartKind,
): string {
  const part = result.parts.find((candidate) => candidate.kind === kind);
  if (!part) {
    throw new Error(`Missing ${kind} in BOM.`);
  }
  return part.id;
}

function expectConnection(
  connections: Connection[],
  fromPartId: string,
  fromPointId: string,
  toPartId: string,
  toPointId: string,
): void {
  expect(connections).toContainEqual({
    fromPartId,
    fromPointId,
    toPartId,
    toPointId,
  });
}

describe("generateBom", () => {
  it("builds a pistol from the required core parts only when attachment rolls miss", () => {
    const result = generateBom(createSeedBundle("Pistol", "alpha", "bravo"));

    expect(getKinds(result)).toEqual([
      "receiver",
      "barrel",
      "magwell",
      "magazine",
      "pistolGrip",
    ]);
    expect(result.parts.map((part) => part.id)).toEqual([
      "receiver-1",
      "barrel-2",
      "magwell-3",
      "magazine-4",
      "pistolGrip-5",
    ]);
    expect(result.connections).toHaveLength(4);
    expectConnection(
      result.connections,
      "pistolGrip-5",
      "mount",
      "receiver-1",
      "bottom",
    );
    expectConnection(
      result.connections,
      "magwell-3",
      "host",
      "receiver-1",
      "bottom",
    );
    expectConnection(
      result.connections,
      "magazine-4",
      "feed",
      "magwell-3",
      "mag",
    );
    expectConnection(
      result.connections,
      "barrel-2",
      "start",
      "receiver-1",
      "front",
    );
  });

  it("adds precision attachments for DMRs and routes the barrel through the handguard", () => {
    const result = generateBom(createSeedBundle("DMR", "alpha", "bravo"));

    expect(getKinds(result)).toEqual([
      "receiver",
      "barrel",
      "magwell",
      "magazine",
      "pistolGrip",
      "stock",
      "handguard",
      "muzzleDevice",
      "optic",
    ]);

    expectConnection(
      result.connections,
      getIdByKind(result, "handguard"),
      "rear",
      getIdByKind(result, "receiver"),
      "front",
    );
    expectConnection(
      result.connections,
      getIdByKind(result, "barrel"),
      "start",
      getIdByKind(result, "handguard"),
      "front",
    );
    expectConnection(
      result.connections,
      getIdByKind(result, "stock"),
      "mount",
      getIdByKind(result, "receiver"),
      "rear",
    );
    expectConnection(
      result.connections,
      getIdByKind(result, "optic"),
      "mount",
      getIdByKind(result, "receiver"),
      "top",
    );
    expectConnection(
      result.connections,
      getIdByKind(result, "muzzleDevice"),
      "mount",
      getIdByKind(result, "barrel"),
      "end",
    );
  });

  it("keeps connection references valid and mounts rail accessories to the handguard", () => {
    const result = generateBom(createSeedBundle("SMG", "2", "2"));
    const partIds = new Set(result.parts.map((part) => part.id));

    expect(getKinds(result)).toContain("laser");
    expect(getKinds(result)).toContain("handguard");

    for (const connection of result.connections) {
      expect(partIds.has(connection.fromPartId)).toBe(true);
      expect(partIds.has(connection.toPartId)).toBe(true);
    }

    expectConnection(
      result.connections,
      getIdByKind(result, "laser"),
      "mount",
      getIdByKind(result, "handguard"),
      "side",
    );
  });
});
