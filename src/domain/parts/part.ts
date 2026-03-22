import {
  AttachmentPointSpec,
  DimensionRangeMm,
  DimensionsMm,
  Grams,
  PartKind,
  PartLevel,
  SquareMillimeters,
} from "../../core/types";
import { AttachmentPoint } from "./attachment-point";

export abstract class Part {
  readonly id: string;
  readonly kind: PartKind;
  readonly partLevel: PartLevel;
  readonly displayName: string;
  readonly density: number;
  readonly baseRange: DimensionRangeMm;
  readonly attachmentPoints: AttachmentPoint[];
  dimensionsMm: DimensionsMm;
  area: SquareMillimeters;
  weight: Grams;

  constructor(input: {
    id: string;
    kind: PartKind;
    partLevel: PartLevel;
    displayName: string;
    density: number;
    baseRange: DimensionRangeMm;
    attachmentPointSpecs: AttachmentPointSpec[];
    dimensionsMm: DimensionsMm;
    area: SquareMillimeters;
    weight: Grams;
  }) {
    this.id = input.id;
    this.kind = input.kind;
    this.partLevel = input.partLevel;
    this.displayName = input.displayName;
    this.density = input.density;
    this.baseRange = input.baseRange;
    this.dimensionsMm = input.dimensionsMm;
    this.area = input.area;
    this.weight = input.weight;
    this.attachmentPoints = input.attachmentPointSpecs.map(
      (spec) => new AttachmentPoint(input.id, spec),
    );
  }
}
