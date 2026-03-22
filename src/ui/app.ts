import {
  SeedBundle,
  WeaponCategory,
  WeaponSummaryItem,
  weaponCategories,
} from "../core/types";
import { createDefaultSeeds } from "../generation/defaults";
import { createWeaponName } from "../generation/weapon-name";
import { renderWeaponSvg } from "../render/weapon/render-weapon";
import { renderControls } from "./controls";
import { createInitialState, createStore, Store } from "./state";

const seedFields = [
  "dataModelSeed",
  "partSizeSeed",
  "aestheticDetailSeed",
] as const;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function isWeaponCategory(value: string | null): value is WeaponCategory {
  return value !== null && weaponCategories.includes(value as WeaponCategory);
}

function readSeedsFromUrl(): SeedBundle | null {
  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get("category");
  const hasAnySeedParam = seedFields.some((field) => params.has(field));
  const hasCategoryParam = isWeaponCategory(categoryParam);

  if (!hasCategoryParam && !hasAnySeedParam) {
    return null;
  }

  const fallback = createDefaultSeeds(
    hasCategoryParam ? categoryParam : undefined,
  );

  return {
    category: hasCategoryParam ? categoryParam : fallback.category,
    dataModelSeed: params.get("dataModelSeed") ?? fallback.dataModelSeed,
    partSizeSeed: params.get("partSizeSeed") ?? fallback.partSizeSeed,
    aestheticDetailSeed:
      params.get("aestheticDetailSeed") ?? fallback.aestheticDetailSeed,
  };
}

function syncUrl(seeds: SeedBundle): void {
  const url = new URL(window.location.href);
  url.searchParams.set("category", seeds.category);
  url.searchParams.set("dataModelSeed", seeds.dataModelSeed);
  url.searchParams.set("partSizeSeed", seeds.partSizeSeed);
  url.searchParams.set("aestheticDetailSeed", seeds.aestheticDetailSeed);
  window.history.replaceState(null, "", url);
}

function formatNumber(value: number): string {
  return Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(value);
}

function formatDecimal(value: number, maximumFractionDigits: number): string {
  return Intl.NumberFormat("en", { maximumFractionDigits }).format(value);
}

function formatCurrency(valueCents: number): string {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valueCents / 100);
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

function buildRenderCommand(seeds: SeedBundle): string {
  return `npm run --silent render:svg -- --category=${seeds.category} --dataModelSeed=${seeds.dataModelSeed} --partSizeSeed=${seeds.partSizeSeed} --aestheticDetailSeed=${seeds.aestheticDetailSeed}`;
}

function copyRenderCommand(store: Store): void {
  const { seeds } = store.getState();
  void navigator.clipboard.writeText(buildRenderCommand(seeds));
}

function renderSummary(store: Store): string {
  const state = store.getState();
  const summaryItems = getSummaryItems(store);

  return `
    <div class="summary-grid">
      <div class="stat"><span class="stat-label">Weight</span><span class="stat-value">${formatDecimal(Number(state.weapon.metrics.totalWeight) / 1000, 2)} kg</span></div>
      <div class="stat"><span class="stat-label">Price</span><span class="stat-value">${formatCurrency(Number(state.weapon.metrics.totalPrice))}</span></div>
      <div class="stat"><span class="stat-label">Dimensions</span><span class="stat-value">${formatDecimal(Number(state.weapon.metrics.totalLength) / 10, 1)} x ${formatDecimal(Number(state.weapon.metrics.totalHeight) / 10, 1)} cm</span></div>
    </div>
    <div class="list-grid">
      <div class="list-card">
        <h3>${state.weapon.category}</h3>
        <ul>
          ${summaryItems
            .map(
              (item) =>
                `<li>${item.displayName}: ${formatNumber(item.length)} x ${formatNumber(item.width)} mm, ${formatNumber(item.weight)} g</li>`,
            )
            .join("")}
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
    .querySelector<HTMLButtonElement>(
      "button[data-action='copy-render-command']",
    )
    ?.addEventListener("click", () => {
      copyRenderCommand(store);
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
  const weaponName = createWeaponName(state.seeds);
  root.innerHTML = `
    <div class="app-shell">
      <header class="hero">
        <div>
          <h1>Gungen</h1>
        </div>
      </header>

      <main class="grid">
        <aside class="app-panel controls">${renderControls(store)}</aside>
        <section class="preview">
          <div class="app-panel canvas">
            <div class="canvas-stage">
              <h2 class="weapon-name">${escapeHtml(weaponName)}</h2>
              <div class="canvas-frame">${svg}</div>
            </div>
          </div>
          <div class="app-panel summary">${renderSummary(store)}</div>
        </section>
      </main>
    </div>
  `;
  bindControls(root, store);
}

export function mountApp(root: HTMLElement): void {
  const initialSeeds = readSeedsFromUrl();
  const store = createStore(
    initialSeeds ? createInitialState(initialSeeds) : createInitialState(),
  );

  store.subscribe(() => {
    syncUrl(store.getState().seeds);
    renderApp(root, store);
  });
}
