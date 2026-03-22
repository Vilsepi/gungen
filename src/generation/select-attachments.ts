import { PartKind, WeaponCategory } from "../core/types";
import { chance } from "../random/pick";
import { Prng } from "../random/prng";
import { categoryPresets } from "../presets/category-attachment-rules";

export function selectAttachments(
  category: WeaponCategory,
  prng: Prng,
): PartKind[] {
  const preset = categoryPresets[category];
  const selected = new Set<PartKind>();

  for (const partKind of preset.optionalParts) {
    const probability = preset.attachmentOdds[partKind] ?? 0;
    if (probability > 0 && chance(prng, probability)) {
      selected.add(partKind);
    }
  }

  if (
    selected.has("frontGrip") ||
    selected.has("laser") ||
    selected.has("flashlight")
  ) {
    selected.add("handguard");
  }

  if (category !== "Pistol") {
    selected.add("stock");
  }

  if ((category === "DMR" || category === "Sniper") && !selected.has("optic")) {
    selected.add("optic");
  }

  return [...selected];
}
