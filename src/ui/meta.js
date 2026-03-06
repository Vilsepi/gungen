import { CLASS_LABELS } from '../model/constants.js';

export function updateMeta(spec, elements) {
  elements.classPill.textContent = `Class: ${CLASS_LABELS[spec.class]}`;
  elements.seedPill.textContent = `Seed: ${spec.seed}`;
  elements.attachmentPill.textContent = `Attachments: ${spec.metadata.attachmentNames.length ? spec.metadata.attachmentNames.join(', ') : 'none'}`;
}
