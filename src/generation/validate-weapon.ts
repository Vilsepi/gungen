import { ValidationError } from "../core/errors";
import { Connection, PartKind, WeaponCategory } from "../core/types";
import { Part } from "../domain/parts";
import { categoryPresets } from "../presets/category-attachment-rules";

export function validateWeapon(
  category: WeaponCategory,
  parts: Part[],
  connections: Connection[],
): void {
  const preset = categoryPresets[category];
  const kinds = new Set(parts.map((part) => part.kind));

  for (const required of preset.requiredParts) {
    if (!kinds.has(required)) {
      throw new ValidationError(`Missing required part: ${required}`);
    }
  }

  for (const part of parts) {
    if (
      ![...preset.requiredParts, ...preset.optionalParts].includes(part.kind)
    ) {
      throw new ValidationError(`Unsupported part ${part.kind} in ${category}`);
    }
  }

  if (!kinds.has("barrel") || !kinds.has("receiver")) {
    throw new ValidationError("Weapon must contain a receiver and barrel.");
  }

  const partIds = new Set(parts.map((part) => part.id));
  for (const connection of connections) {
    if (
      !partIds.has(connection.fromPartId) ||
      !partIds.has(connection.toPartId)
    ) {
      throw new ValidationError("Connection references a missing part.");
    }
  }

  const requiresHandguard: PartKind[] = [
    "laser",
    "flashlight",
    "frontGrip",
  ];
  if (
    requiresHandguard.some((kind) => kinds.has(kind)) &&
    !kinds.has("handguard")
  ) {
    throw new ValidationError("Rail accessories require a handguard.");
  }

  if (category === "Pistol" && kinds.has("stock")) {
    throw new ValidationError(
      "Pistols cannot have a stock in this implementation.",
    );
  }
}
