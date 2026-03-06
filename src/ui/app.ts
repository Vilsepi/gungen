import { WeaponSummaryItem } from "../core/types";
import { renderWeaponSvg } from "../render/weapon/render-weapon";
import { renderControls } from "./controls";
import { createStore, Store } from "./state";

function formatNumber(value: number): string {
  return Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(value);
}

function getSummaryItems(store: Store): WeaponSummaryItem[] {
  return store.getState().weapon.parts.map((part) => ({
    id: part.id,
    kind: part.kind,
    displayName: part.displayName,
    length: Number(part.dimensionsMm.length),
    width: Number(part.dimensionsMm.width),
    weight: Number(part.weight),
  }));
}

function downloadSvg(svg: string, filename: string): void {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function copySeeds(store: Store): void {
  const { seeds } = store.getState();
  const text = JSON.stringify(seeds, null, 2);
  void navigator.clipboard.writeText(text);
}

function renderSummary(store: Store): string {
  const state = store.getState();
  const summaryItems = getSummaryItems(store);
  const attachments = summaryItems.filter(
    (item) =>
      !["receiver", "barrel", "magwell", "magazine", "pistolGrip"].includes(
        item.kind,
      ),
  );

  return `
    <div class="summary-grid">
      <div class="stat"><span class="stat-label">Category</span><span class="stat-value">${state.weapon.category}</span></div>
      <div class="stat"><span class="stat-label">Parts</span><span class="stat-value">${summaryItems.length}</span></div>
      <div class="stat"><span class="stat-label">Weight</span><span class="stat-value">${formatNumber(Number(state.weapon.metrics.totalWeight))} g</span></div>
      <div class="stat"><span class="stat-label">Envelope</span><span class="stat-value">${formatNumber(Number(state.weapon.metrics.totalLength))} x ${formatNumber(Number(state.weapon.metrics.totalHeight))} mm</span></div>
    </div>
    <div class="list-grid">
      <div class="list-card">
        <h3>Bill of Materials</h3>
        <ul>
          ${summaryItems
            .map(
              (item) =>
                `<li>${item.displayName}: ${formatNumber(item.length)} x ${formatNumber(item.width)} mm, ${formatNumber(item.weight)} g</li>`,
            )
            .join("")}
        </ul>
      </div>
      <div class="list-card">
        <h3>Selected Attachments</h3>
        <ul>
          ${
            attachments.length > 0
              ? attachments
                  .map((item) => `<li>${item.displayName}</li>`)
                  .join("")
              : "<li>No optional attachments</li>"
          }
        </ul>
      </div>
    </div>
  `;
}

function bindControls(root: HTMLElement, store: Store): void {
  const categorySelect = root.querySelector<HTMLSelectElement>("#category");
  categorySelect?.addEventListener("change", (event) => {
    store.setCategory(
      (event.currentTarget as HTMLSelectElement).value as never,
    );
  });

  const seedFields = [
    "dataModelSeed",
    "partSizeSeed",
    "aestheticDetailSeed",
  ] as const;
  for (const field of seedFields) {
    root
      .querySelector<HTMLInputElement>(`#${field}`)
      ?.addEventListener("change", (event) => {
        store.setSeed(field, (event.currentTarget as HTMLInputElement).value);
      });
  }

  root
    .querySelectorAll<HTMLButtonElement>("button[data-action='reroll']")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const field = button.dataset.field as (typeof seedFields)[number];
        store.reroll(field);
      });
    });

  root
    .querySelector<HTMLButtonElement>("button[data-action='reroll-all']")
    ?.addEventListener("click", () => {
      store.rerollAll();
    });
  root
    .querySelector<HTMLButtonElement>("button[data-action='toggle-debug']")
    ?.addEventListener("click", () => {
      store.toggleDebug();
    });
  root
    .querySelector<HTMLButtonElement>("button[data-action='copy-seeds']")
    ?.addEventListener("click", () => {
      copySeeds(store);
    });
  root
    .querySelector<HTMLButtonElement>("button[data-action='export-svg']")
    ?.addEventListener("click", () => {
      const state = store.getState();
      downloadSvg(
        renderWeaponSvg(state.weapon, { debug: state.debug }),
        `gungen-${state.weapon.category.toLowerCase()}.svg`,
      );
    });
}

function renderApp(root: HTMLElement, store: Store): void {
  const state = store.getState();
  const svg = renderWeaponSvg(state.weapon, { debug: state.debug });
  root.innerHTML = `
    <div class="shell">
      <header class="hero">
        <div>
          <span class="eyebrow">Procedural SVG Weapons</span>
          <h1>GunGen</h1>
          <p>Deterministic firearm UI art generation with separate seeds for bill of materials, part sizing, and aesthetic detail.</p>
        </div>
        <p class="footnote">The drawing is composed from typed parts, validated as a connected graph, then rendered as a left-facing SVG.</p>
      </header>

      <main class="grid">
        <aside class="panel controls">${renderControls(store)}</aside>
        <section class="preview">
          <div class="panel canvas">
            <div class="canvas-frame">${svg}</div>
          </div>
          <div class="panel summary">${renderSummary(store)}</div>
        </section>
      </main>
    </div>
  `;
  bindControls(root, store);
}

export function mountApp(root: HTMLElement): void {
  const store = createStore();
  store.subscribe(() => {
    renderApp(root, store);
  });
}
