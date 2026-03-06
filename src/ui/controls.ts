import { weaponCategories } from "../core/types";
import { Store } from "./state";

function escapeAttribute(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

export function renderControls(store: Store): string {
  const state = store.getState();
  const options = weaponCategories
    .map(
      (category) =>
        `<option value="${category}" ${category === state.seeds.category ? "selected" : ""}>${category}</option>`,
    )
    .join("");

  const seedFields = [
    ["dataModelSeed", "Data Model Seed"],
    ["partSizeSeed", "Part Size Seed"],
    ["aestheticDetailSeed", "Aesthetic Detail Seed"],
  ] as const;

  const seedMarkup = seedFields
    .map(
      ([field, label]) => `
        <div class="control-row">
          <label for="${field}">${label}</label>
          <div class="seed-row">
            <input id="${field}" name="${field}" value="${escapeAttribute(state.seeds[field])}" />
            <button type="button" data-action="reroll" data-field="${field}">Reroll</button>
          </div>
        </div>
      `,
    )
    .join("");

  return `
    <div class="section">
      <span class="eyebrow">Generator Controls</span>
      <div class="control-row">
        <label for="category">Category</label>
        <select id="category" name="category">${options}</select>
      </div>
      ${seedMarkup}
    </div>

    <div class="section">
      <div class="action-stack">
        <button type="button" class="primary" data-action="reroll-all">Reroll All</button>
      </div>
    </div>

    <div class="section utility-section">
      <span class="eyebrow">Utilities</span>
      <div class="inline-actions utility-actions">
        <button type="button" data-action="toggle-debug">${state.debug ? "Hide Debug" : "Show Debug"}</button>
        <button type="button" data-action="copy-seeds">Copy Seeds</button>
        <button type="button" data-action="export-svg">Export SVG</button>
      </div>
      <!--<p class="footnote"></p>-->
    </div>
  `;
}
