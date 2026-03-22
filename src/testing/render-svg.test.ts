import { describe, expect, it } from "vitest";

import { renderSvgCanvas, resolveRenderSeeds } from "./render-svg";

describe("resolveRenderSeeds", () => {
  it("keeps explicitly supplied render inputs unchanged", () => {
    expect(
      resolveRenderSeeds({
        category: "AssaultRifle",
        dataModelSeed: "5f930404",
        partSizeSeed: "a784b217",
        aestheticDetailSeed: "44c43249",
      }),
    ).toEqual({
      category: "AssaultRifle",
      dataModelSeed: "5f930404",
      partSizeSeed: "a784b217",
      aestheticDetailSeed: "44c43249",
    });
  });

  it("fills omitted values with randomized defaults", () => {
    const seeds = resolveRenderSeeds({ category: "AssaultRifle" });

    expect(seeds.category).toBe("AssaultRifle");
    expect(seeds.dataModelSeed).toMatch(/^[0-9a-f]{8}$/u);
    expect(seeds.partSizeSeed).toMatch(/^[0-9a-f]{8}$/u);
    expect(seeds.aestheticDetailSeed).toMatch(/^[0-9a-f]{8}$/u);
  });

  it("rejects unknown categories", () => {
    expect(() => resolveRenderSeeds({ category: "Shotgun" })).toThrow(
      'Invalid category "Shotgun". Expected one of: Pistol, SMG, Carbine, AssaultRifle, BattleRifle, DMR, Sniper.',
    );
  });
});

describe("renderSvgCanvas", () => {
  it("returns only SVG markup for explicit inputs", () => {
    const svg = renderSvgCanvas({
      category: "AssaultRifle",
      dataModelSeed: "5f930404",
      partSizeSeed: "a784b217",
      aestheticDetailSeed: "44c43249",
    });

    expect(svg.startsWith("<svg ")).toBe(true);
    expect(svg.endsWith("</svg>")).toBe(true);
    expect(svg).not.toContain("<html");
    expect(svg).toContain('viewBox="-');
    expect(svg).toContain('aria-label="Generated firearm illustration"');
  });

  it("is deterministic for the same inputs", () => {
    const input = {
      category: "AssaultRifle",
      dataModelSeed: "5f930404",
      partSizeSeed: "a784b217",
      aestheticDetailSeed: "44c43249",
    } as const;

    expect(renderSvgCanvas(input)).toBe(renderSvgCanvas(input));
  });
});
