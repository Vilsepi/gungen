import { describe, expect, it } from "vitest";

import { generateWeapon } from "../generation/generate-weapon";
import { renderWeaponSvg } from "../render/weapon/render-weapon";
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
    expect(svg).toMatch(
      /class="part [^"]*level-(normal|improved|rare|exotic)"/u,
    );
    expect(svg).toContain(".part.level-exotic");
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

describe("renderWeaponSvg dimensions", () => {
  it("svg element sizes match bom part dimensions within centimeter precision", () => {
    const CM_PRECISION_MM = 10;
    const seedBundle = {
      category: "AssaultRifle",
      dataModelSeed: "5f930404",
      partSizeSeed: "a784b217",
      aestheticDetailSeed: "44c43249",
    } as const;
    const weapon = generateWeapon(seedBundle);
    const svg = renderWeaponSvg(weapon, { debug: false });

    for (const layoutPart of weapon.layout) {
      const bomPart = weapon.parts.find((p) => p.id === layoutPart.partId);
      expect(bomPart, `bom part for ${layoutPart.kind}`).toBeDefined();
      const expectedLength = Number(bomPart!.dimensionsMm.length);
      const expectedWidth = Number(bomPart!.dimensionsMm.width);

      expect(layoutPart.length, `${layoutPart.kind} layout length`).toBeCloseTo(
        expectedLength,
        1,
      );
      expect(layoutPart.width, `${layoutPart.kind} layout width`).toBeCloseTo(
        expectedWidth,
        1,
      );

      // Convert camelCase kind (e.g. "muzzleDevice") to kebab-case (e.g. "muzzle-device")
      // to match the CSS class name used in the rendered SVG part group.
      const kebabKind = layoutPart.kind.replace(
        /([A-Z])/gu,
        (c) => `-${c.toLowerCase()}`,
      );

      // Match the part group opening tag and the first shell element inside it.
      // The group is identified by either the camelCase or kebab-case class name.
      const partGroupPattern = new RegExp(
        `class="part [^"]*(?:${layoutPart.kind}|${kebabKind})[^"]*"[^>]*transform="[^"]*"[\\s\\S]*?<(?:rect|path|ellipse)[^>]*class="shell"[^>]*>`,
        "u",
      );
      const groupMatch = partGroupPattern.exec(svg);

      if (groupMatch) {
        const shellElement = groupMatch[0];

        const widthMatch = /\bwidth="([\d.eE+-]+)"/.exec(shellElement);
        const heightMatch = /\bheight="([\d.eE+-]+)"/.exec(shellElement);

        if (widthMatch?.[1] && heightMatch?.[1]) {
          const svgWidth = parseFloat(widthMatch[1]);
          const svgHeight = parseFloat(heightMatch[1]);
          expect(
            Math.abs(svgWidth - expectedLength),
            `${layoutPart.kind} svg shell rect width vs bom length`,
          ).toBeLessThan(CM_PRECISION_MM);
          expect(
            Math.abs(svgHeight - expectedWidth),
            `${layoutPart.kind} svg shell rect height vs bom width`,
          ).toBeLessThan(CM_PRECISION_MM);
        }
      }
    }
  });
});
