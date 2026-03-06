import { AttachmentPointSpec } from "../../core/types";

export class AttachmentPoint {
  readonly id: string;
  readonly ownerPartId: string;
  readonly kind: AttachmentPointSpec["kind"];
  readonly allowedPartKinds: AttachmentPointSpec["allowedPartKinds"];
  readonly maxConnections: number;

  constructor(ownerPartId: string, spec: AttachmentPointSpec) {
    this.id = spec.id;
    this.ownerPartId = ownerPartId;
    this.kind = spec.kind;
    this.allowedPartKinds = spec.allowedPartKinds;
    this.maxConnections = spec.maxConnections;
  }
}
