import { SeedBundle } from "../core/types";
import { Weapon } from "../domain/bom/weapon";
import { generateBom } from "./generate-bom";
import { layoutWeapon } from "../composition/layout-weapon";

export function generateWeapon(seedBundle: SeedBundle): Weapon {
  const { parts, connections } = generateBom(seedBundle);
  const { layout, bounds, metrics } = layoutWeapon(parts, seedBundle.category);
  return {
    category: seedBundle.category,
    seedBundle,
    parts,
    connections,
    rootPartId:
      parts.find((part) => part.kind === "receiver")?.id ?? parts[0]!.id,
    layout,
    bounds,
    metrics,
  };
}
