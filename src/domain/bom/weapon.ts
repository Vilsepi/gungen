import {
  Connection,
  LayoutBounds,
  LayoutPart,
  SeedBundle,
  WeaponCategory,
  WeaponMetrics,
} from "../../core/types";
import { Part } from "../parts";

export interface Weapon {
  category: WeaponCategory;
  seedBundle: SeedBundle;
  parts: Part[];
  connections: Connection[];
  rootPartId: string;
  layout: LayoutPart[];
  bounds: LayoutBounds;
  metrics: WeaponMetrics;
}
