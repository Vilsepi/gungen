import { describe, expect, it } from "vitest";

import { Connection, PartKind, WeaponCategory } from "../core/types";
import { partConstructors, Part } from "../domain/parts";
import { validateWeapon } from "./validate-weapon";

function createParts(kinds: readonly PartKind[]): Part[] {
  return kinds.map(
    (kind, index) => new partConstructors[kind](`${kind}-${index + 1}`),
  );
}

function createPartIdMap(parts: Part[]): Map<PartKind, string> {
  return new Map(parts.map((part) => [part.kind, part.id]));
}

function createValidConnections(parts: Part[]): Connection[] {
  const ids = createPartIdMap(parts);
  const connections: Connection[] = [
    {
      fromPartId: ids.get("pistolGrip")!,
      fromPointId: "mount",
      toPartId: ids.get("receiver")!,
      toPointId: "bottom",
    },
    {
      fromPartId: ids.get("magwell")!,
      fromPointId: "host",
      toPartId: ids.get("receiver")!,
      toPointId: "bottom",
    },
    {
      fromPartId: ids.get("magazine")!,
      fromPointId: "feed",
      toPartId: ids.get("magwell")!,
      toPointId: "mag",
    },
  ];

  if (ids.has("handguard")) {
    connections.push(
      {
        fromPartId: ids.get("handguard")!,
        fromPointId: "rear",
        toPartId: ids.get("receiver")!,
        toPointId: "front",
      },
      {
        fromPartId: ids.get("barrel")!,
        fromPointId: "start",
        toPartId: ids.get("handguard")!,
        toPointId: "front",
      },
    );
  } else {
    connections.push({
      fromPartId: ids.get("barrel")!,
      fromPointId: "start",
      toPartId: ids.get("receiver")!,
      toPointId: "front",
    });
  }

  if (ids.has("stock")) {
    connections.push({
      fromPartId: ids.get("stock")!,
      fromPointId: "mount",
      toPartId: ids.get("receiver")!,
      toPointId: "rear",
    });
  }

  if (ids.has("optic")) {
    connections.push({
      fromPartId: ids.get("optic")!,
      fromPointId: "mount",
      toPartId: ids.get("receiver")!,
      toPointId: "top",
    });
  }

  if (ids.has("laser")) {
    connections.push({
      fromPartId: ids.get("laser")!,
      fromPointId: "mount",
      toPartId: ids.get("handguard")!,
      toPointId: "side",
    });
  }

  return connections;
}

describe("validateWeapon", () => {
  it("rejects missing required parts", () => {
    const parts = createParts([
      "receiver",
      "magwell",
      "magazine",
      "pistolGrip",
    ]);

    expect(() => validateWeapon("SMG", parts, [])).toThrow(
      "Missing required part: barrel",
    );
  });

  it("rejects unsupported parts for a category", () => {
    const parts = createParts([
      "receiver",
      "barrel",
      "magwell",
      "magazine",
      "pistolGrip",
      "handguard",
      "laser",
    ]);

    expect(() =>
      validateWeapon("Sniper", parts, createValidConnections(parts)),
    ).toThrow("Unsupported part laser in Sniper");
  });

  it("rejects connections that reference missing parts", () => {
    const parts = createParts([
      "receiver",
      "barrel",
      "magwell",
      "magazine",
      "pistolGrip",
    ]);

    const connections: Connection[] = [
      {
        fromPartId: "missing-part",
        fromPointId: "mount",
        toPartId: parts[0]!.id,
        toPointId: "bottom",
      },
    ];

    expect(() => validateWeapon("Pistol", parts, connections)).toThrow(
      "Connection references a missing part.",
    );
  });

  it("rejects rail accessories without a handguard", () => {
    const parts = createParts([
      "receiver",
      "barrel",
      "magwell",
      "magazine",
      "pistolGrip",
      "laser",
      "stock",
    ]);

    const connections = createValidConnections(parts).filter(
      (connection) =>
        connection.fromPartId !== createPartIdMap(parts).get("laser"),
    );

    expect(() => validateWeapon("SMG", parts, connections)).toThrow(
      "Rail accessories require a handguard.",
    );
  });

  it("accepts a valid long-gun configuration with handguard-mounted accessories", () => {
    const category: WeaponCategory = "SMG";
    const parts = createParts([
      "receiver",
      "barrel",
      "magwell",
      "magazine",
      "pistolGrip",
      "stock",
      "handguard",
      "optic",
      "laser",
    ]);

    expect(() =>
      validateWeapon(category, parts, createValidConnections(parts)),
    ).not.toThrow();
  });
});
