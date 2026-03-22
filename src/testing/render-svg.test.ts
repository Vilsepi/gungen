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
  it("svg element sizes match bom part axes within centimeter precision", () => {
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
      const expectedSizeX = Number(bomPart!.dimensionsMm.sizeX);
      const expectedSizeY = Number(bomPart!.dimensionsMm.sizeY);

      expect(layoutPart.sizeX, `${layoutPart.kind} layout sizeX`).toBeCloseTo(
        expectedSizeX,
        1,
      );
      expect(layoutPart.sizeY, `${layoutPart.kind} layout sizeY`).toBeCloseTo(
        expectedSizeY,
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

        const sizeXAttrMatch = /\bwidth="([\d.eE+-]+)"/.exec(shellElement);
        const sizeYAttrMatch = /\bheight="([\d.eE+-]+)"/.exec(shellElement);

        if (sizeXAttrMatch?.[1] && sizeYAttrMatch?.[1]) {
          const svgSizeX = parseFloat(sizeXAttrMatch[1]);
          const svgSizeY = parseFloat(sizeYAttrMatch[1]);
          expect(
            Math.abs(svgSizeX - expectedSizeX),
            `${layoutPart.kind} svg shell rect sizeX vs bom sizeX`,
          ).toBeLessThan(CM_PRECISION_MM);
          expect(
            Math.abs(svgSizeY - expectedSizeY),
            `${layoutPart.kind} svg shell rect sizeY vs bom sizeY`,
          ).toBeLessThan(CM_PRECISION_MM);
        }
      }
    }
  });
});

describe("renderWeaponSvg styling", () => {
  it("uses a global part fill opacity variable that debug mode lowers", () => {
    const seedBundle = {
      category: "AssaultRifle",
      dataModelSeed: "5f930404",
      partSizeSeed: "a784b217",
      aestheticDetailSeed: "44c43249",
    } as const;
    const weapon = generateWeapon(seedBundle);
    const normalSvg = renderWeaponSvg(weapon, { debug: false });
    const debugSvg = renderWeaponSvg(weapon, { debug: true });

    expect(normalSvg).toContain("--part-fill-opacity: 1;");
    expect(debugSvg).toContain("--part-fill-opacity: 0.1;");
    expect(normalSvg).toContain(
      "--part-fill: rgba(var(--part-fill-rgb), var(--part-fill-opacity));",
    );
  });
});
