# GunGen Implementation Plan

This plan turns the product brief in [metaplan.md](gungen/metaplan.md) into an implementable sequence for a Vite + TypeScript web app that deterministically generates 2D SVG firearm line art from separate seeds.

## 1. End State

Build a browser app that:

- lets the user choose a weapon category
- exposes three rerollable seeds: Data Model, Part Size, Aesthetic Detail
- deterministically generates a valid firearm bill of materials from those inputs
- computes part dimensions and derived masses in millimeters
- renders a side-view SVG of the weapon pointing left
- keeps domain logic, randomization, composition, and rendering clearly separated under `src/`

## 2. Core Engineering Principles

- Determinism first: identical Category + three seed values must always produce the exact same output.
- Strong typing first: weapon category, part kinds, attachment points, constraints, and generation results should all be explicit TypeScript types.
- Domain before rendering: generate a valid weapon data model before any SVG details are produced.
- Rendering is pure: renderers receive immutable domain data plus detail seed context and return SVG geometry only.
- Separation of concerns: BOM generation, sizing, composition, UI, and SVG rendering should not depend on each other in ad hoc ways.

## 3. Proposed Directory Structure

Put all application code under `src/`.

```text
src/
  index.html
  style.css
  main.ts

  ui/
    app.ts
    state.ts
    controls.ts
    dom.ts
    view-model.ts

  core/
    types.ts
    constants.ts
    errors.ts

  random/
    seed.ts
    prng.ts
    pick.ts
    hash.ts

  domain/
    categories/
      weapon-category.ts
      category-rules.ts
    parts/
      part.ts
      attachment-point.ts
      receiver.ts
      barrel.ts
      handguard.ts
      magwell.ts
      magazine.ts
      pistol-grip.ts
      stock.ts
      optic.ts
      laser.ts
      flashlight.ts
      muzzle-device.ts
      front-grip.ts
    bom/
      weapon.ts
      weapon-node.ts
      weapon-bom.ts
    geometry/
      dimensions.ts
      bounds.ts
      anchors.ts
    physics/
      density.ts
      mass.ts

  generation/
    generate-weapon.ts
    generate-bom.ts
    select-attachments.ts
    size-parts.ts
    validate-weapon.ts
    defaults.ts

  composition/
    layout-weapon.ts
    join-parts.ts
    placement-rules.ts
    normalize-layout.ts

  render/
    svg/
      svg-document.ts
      path-builder.ts
      transforms.ts
    parts/
      render-receiver.ts
      render-barrel.ts
      render-handguard.ts
      render-magwell.ts
      render-magazine.ts
      render-pistol-grip.ts
      render-stock.ts
      render-optic.ts
      render-laser.ts
      render-flashlight.ts
      render-muzzle-device.ts
      render-front-grip.ts
    weapon/
      render-weapon.ts
      render-layering.ts
      render-debug.ts

  presets/
    category-dimension-rules.ts
    category-attachment-rules.ts
    category-probabilities.ts

  test-data/
    seed-scenarios.ts
```

Notes:

- `main.ts` bootstraps the UI only.
- `domain/parts/` contains one class per part type, as requested.
- `render/parts/` contains separate rendering logic for each part type.
- `generation/` creates a valid weapon model.
- `composition/` turns the graph/BOM into positioned 2D part placements.

## 4. Data Model Design

### 4.1 Enumerations and shared types

Define these first:

- `WeaponCategory`: `Pistol | SMG | Carbine | AssaultRifle | BattleRifle | DMR | Sniper`
- `PartKind`: receiver, barrel, magwell, magazine, pistolGrip, handguard, stock, optic, laser, flashlight, muzzleDevice, frontGrip
- `AttachmentPointKind`: top, bottom, front, back, barrelStart, barrelEnd, magIn, magOut, side, rear
- `SeedBundle`: category, dataModelSeed, partSizeSeed, aestheticDetailSeed
- `Millimeters`, `SquareMillimeters`, `Grams` as branded numeric aliases or strongly documented numeric types

### 4.2 Base part model

Create an abstract `Part` base class with:

- stable `id`
- `kind`
- `displayName`
- outer `dimensionsMm` with min/max bounds and resolved actual size
- `density`
- computed `area`
- computed `mass`
- list of `attachmentPoints`

Each concrete part class extends `Part` and defines:

- which attachment points it exposes
- which other part kinds can connect to each point
- min/max allowed dimensions for the part category
- any extra shape metadata needed by renderers later

### 4.3 Attachment model

Represent attachment rules explicitly:

- `AttachmentPoint` has `id`, `ownerPartId`, `kind`, `allowedPartKinds`, `maxConnections`
- `Connection` links `fromPartId/fromPointId` to `toPartId/toPointId`

This gives a graph model while still allowing a BOM-style tree view for display and debugging.

### 4.4 Weapon aggregate

Create `Weapon` as the main aggregate containing:

- selected `category`
- `seedBundle`
- flat part list indexed by id
- connection list
- derived root receiver id
- resolved layout result after composition
- metadata such as total mass and bounding box

## 5. Deterministic Randomization Strategy

Implement randomization in this strict order:

1. Normalize the three seeds into fixed numeric values.
2. Create three independent PRNG streams:
   - data PRNG for part selection
   - size PRNG for dimension choices
   - detail PRNG for SVG detail choices
3. Never mix concerns across streams.
4. Make all generation functions take a PRNG instance as an argument rather than using global randomness.

Recommended implementation:

- `seed.ts`: normalize string or number seeds to `uint32`
- `prng.ts`: implement a small deterministic PRNG such as Mulberry32 or SplitMix32
- `pick.ts`: weighted picks, booleans, ranged ints/floats, shuffle utilities

Rule:

- Aesthetic detail must not alter BOM or dimensions.
- Part size must not alter which attachments exist.
- Data model must not alter the visual micro-detail logic except through the part set it produces.

## 6. Category Rules and Constraints

Encode category rules as data, not `if` chains scattered across the codebase.

Each category preset should define:

- required core parts
- allowed optional parts
- probability weights for optional attachments
- min/max dimension overrides per part kind
- category-specific limits such as handguard length
- optional aesthetic tags that renderers can read later

Examples:

- `Pistol`: handguard 0-100 mm, stock usually disallowed, optic optional, muzzle device optional
- `SMG`: compact receiver, short barrel, stock allowed, optic/laser/flashlight allowed
- `AssaultRifle`: handguard 200-400 mm, stock expected, optics common
- `DMR`: longer barrel, optic strongly weighted, muzzle device optional
- `Sniper`: long barrel, optic highly weighted, larger stock bounds

## 7. Weapon Construction Pipeline

Implement generation as a pipeline with explicit stages.

### Stage 1: Build mandatory skeleton

Always create:

- receiver
- barrel
- magwell
- magazine
- pistol grip

Then create category-dependent mandatory additions if required, such as stock on long guns.

### Stage 2: Select optional attachments

Use the data model seed and category rules to select optional compatible parts:

- optic
- laser
- flashlight
- muzzle device
- handguard
- front grip or hand stop
- stock if optional in that category

Selection rules should prevent invalid combinations up front. Example:

- no front grip or hand stop without a handguard
- no muzzle device without barrel
- no optic unless top-of-receiver mount exists

### Stage 3: Instantiate part classes

Create concrete part objects for all selected parts and assign ids.

### Stage 4: Connect the graph

Create valid deterministic connections:

- receiver is the central hub
- pistol grip attaches to receiver
- magwell attaches to receiver or pistol grip according to category design rules
- magazine attaches to magwell
- handguard, if present, attaches to receiver and barrel start
- barrel start attaches to handguard if present, else to receiver
- muzzle device attaches to barrel end if selected
- optic attaches to receiver top
- accessories attach to handguard rails or underside
- stock attaches to receiver rear

### Stage 5: Resolve dimensions and mass

Use the part size seed to resolve actual dimensions within category-constrained ranges. Then compute:

- area from outer length and width
- mass from area times density
- total weapon mass

### Stage 6: Validate

Run a `validateWeapon()` pass that checks:

- all required parts exist
- all parts are connected
- all connections satisfy attachment constraints
- optional parts obey category rules
- dimensions fall inside both part-level and category-level ranges

Generation should fail fast with descriptive errors in development mode.

## 8. Layout and Composition Strategy

The domain graph is not enough for rendering; it needs 2D placement.

Implement composition in a separate `composition/` layer.

### 8.1 Coordinate system

- Use millimeters as the layout unit.
- Place the receiver at origin.
- Positive `x` extends toward the muzzle internally if convenient, then mirror once in final render if needed.
- Keep a single consistent rule so the final weapon points left on screen.

### 8.2 Placement rules

For each part kind, define anchor relationships:

- receiver is the reference frame
- barrel attaches to receiver or handguard front axis
- handguard spans from receiver front toward barrel
- magwell and magazine angle downward from the receiver area
- pistol grip angles down/back from the receiver
- stock extends from receiver rear
- optics sit above receiver
- accessories mount below or beside handguard

### 8.3 Layout output

`layout-weapon.ts` should produce:

- each part’s positioned bounding box
- anchor points for renderer use
- global weapon bounds for SVG viewBox

This makes renderers simple and testable.

## 9. Rendering Strategy

Split rendering into two layers.

### 9.1 Part renderers

Each part renderer takes:

- concrete part instance
- positioned layout data
- aesthetic detail PRNG or detail context

It returns SVG path/shape descriptors only.

Responsibilities of part renderers:

- preserve the outer dimensions decided by the size stage
- vary internal lines, cutouts, serrations, rails, knob placement, window shapes, etc.
- remain visually plausible for the part category

### 9.2 Weapon renderer

`render-weapon.ts` should:

- call every part renderer
- apply a fixed layer order so overlapping parts look correct
- calculate the final `viewBox`
- emit a full SVG document string or SVG DOM tree

Suggested layer order:

1. stock
2. receiver
3. handguard
4. barrel
5. muzzle device
6. magwell
7. magazine
8. pistol grip
9. optic
10. accessory devices
11. debug overlays if enabled

## 10. UI Plan

Build a simple but clear single-page tool first.

### First UI version

- category selector
- three seed inputs with reroll buttons
- generate button if generation is not fully reactive
- SVG preview pane
- summary panel for:
  - total mass
  - part list
  - resolved dimensions
  - selected attachments

### Useful secondary controls

- copy/share seed bundle
- reroll only one seed at a time
- toggle debug overlays for anchors, bounds, and attachment points
- export SVG

Keep UI state in a plain typed state module, not inside rendering logic.

## 11. Step-by-Step Execution Plan

### Phase 1: Project setup

1. Create the initial `src/` structure from the proposed layout.
2. Add TypeScript support to the Vite project if it is not already configured.
3. Update `package.json` scripts so format targets include TypeScript files.
4. Add a strict `tsconfig.json` and enable strong checks.
5. Create `src/index.html`, `src/style.css`, and `src/main.ts` bootstrap files.

Deliverable:

- app runs in Vite with a placeholder UI and no generation yet.

### Phase 2: Core types and seed engine

1. Implement `core/types.ts` for enums and shared interfaces.
2. Implement deterministic seed normalization and PRNG utilities.
3. Add tests or fixed seed fixtures in `test-data/seed-scenarios.ts`.
4. Verify identical inputs produce identical random sequences.

Deliverable:

- stable deterministic random utilities ready for the rest of the app.

### Phase 3: Domain model

1. Implement the abstract `Part` class.
2. Implement `AttachmentPoint` and connection types.
3. Create one concrete class per part type.
4. Implement density and mass helpers.
5. Encode default min/max dimension data per part kind.

Deliverable:

- strongly typed part classes with calculable physical properties.

### Phase 4: Category presets

1. Create category-specific required/allowed part rules.
2. Add category-specific dimension overrides.
3. Add attachment probability weights.
4. Validate presets against the domain model.

Deliverable:

- all weapon categories represented as structured configuration.

### Phase 5: BOM generation

1. Implement mandatory skeleton creation.
2. Implement optional attachment selection from the data seed.
3. Instantiate parts and connect them into a valid graph.
4. Add generation output debugging helpers.
5. Add validation for graph correctness.

Deliverable:

- a deterministic valid `Weapon` object before sizing or rendering.

### Phase 6: Part sizing

1. Resolve actual dimensions from the part size seed.
2. Apply category overrides to part limits.
3. Compute part area and mass.
4. Compute aggregate weapon metrics.
5. Add validation for dimension ranges.

Deliverable:

- a fully sized weapon model with total mass.

### Phase 7: Layout/composition

1. Define a coordinate system and anchor conventions.
2. Implement placement rules for mandatory parts.
3. Implement placement rules for optional attachments.
4. Normalize the overall bounds and padding.
5. Add debug overlay output for anchors and bounds.

Deliverable:

- a composed 2D layout for any valid weapon model.

### Phase 8: SVG part renderers

1. Implement receiver renderer first, because it anchors most visual identity.
2. Implement barrel, magwell, magazine, and pistol grip renderers.
3. Implement handguard and stock renderers.
4. Implement optics and accessory renderers.
5. Use the aesthetic seed to vary internal detail without changing outer dimensions.

Deliverable:

- all core and optional parts render individually as plausible line-art modules.

### Phase 9: Whole-weapon renderer

1. Implement layer ordering.
2. Combine all rendered parts into a single SVG document.
3. Flip or orient output so the weapon points left.
4. Tune line weights, fills, and spacing for readability.
5. Compare against the visual direction implied by `reference.jpg`.

Deliverable:

- complete generated SVG visible in the browser.

### Phase 10: UI integration

1. Build category and seed controls.
2. Wire UI state to the generation pipeline.
3. Add reroll buttons for each individual seed.
4. Display part list, dimensions, and total mass.
5. Add export SVG and copy-seed actions.

Deliverable:

- usable interactive generator with deterministic reroll behavior.

### Phase 11: Polish and guardrails

1. Add empty/error states for failed generation.
2. Add debug mode for development.
3. Run formatting and fix style issues.
4. Check responsive layout for desktop and mobile.
5. Confirm deterministic output with repeated test scenarios.

Deliverable:

- stable first release candidate.

## 12. Validation Checklist

Before considering the app complete, verify:

- the same full seed bundle always gives the same SVG and metrics
- rerolling only the data seed changes BOM but preserves deterministic behavior for that new seed
- rerolling only the size seed changes dimensions and mass but not selected parts
- rerolling only the aesthetic seed changes visual detail but not BOM or resolved outer dimensions
- every generated weapon category produces a valid connected graph
- no unsupported attachment combination appears
- the final weapon points left
- exported SVG matches the preview

## 13. Suggested Initial Milestone Scope

To keep the first implementation tractable, start with a narrower vertical slice:

- categories: `Pistol`, `SMG`, `AssaultRifle`, `DMR`
- mandatory parts only plus `handguard`, `stock`, `optic`, `muzzleDevice`
- line-art rendering with minimal fills
- debug overlay enabled in development

Then expand to:

- `Carbine`, `BattleRifle`, `Sniper`
- lasers, flashlights, front grips, hand stops
- more detailed aesthetic variants

## 14. Recommended Implementation Order For Individual Files

If building file-by-file, use this order:

1. `src/core/types.ts`
2. `src/random/seed.ts`
3. `src/random/prng.ts`
4. `src/domain/parts/attachment-point.ts`
5. `src/domain/parts/part.ts`
6. concrete part classes in `src/domain/parts/`
7. `src/presets/category-dimension-rules.ts`
8. `src/presets/category-attachment-rules.ts`
9. `src/generation/select-attachments.ts`
10. `src/generation/generate-bom.ts`
11. `src/generation/size-parts.ts`
12. `src/generation/validate-weapon.ts`
13. `src/composition/layout-weapon.ts`
14. `src/render/parts/render-receiver.ts`
15. remaining part renderers
16. `src/render/weapon/render-weapon.ts`
17. `src/ui/state.ts`
18. `src/ui/controls.ts`
19. `src/ui/app.ts`
20. `src/main.ts`

## 15. Risks To Manage Early

- Mixing BOM logic and rendering logic will make determinism and testing much harder.
- Allowing aesthetic detail code to influence geometry will break the seed separation requirement.
- Encoding attachment constraints only implicitly in render code will create invalid weapons.
- Skipping a validation pass will make debugging procedural failures expensive.
- Using category rules in many places instead of central presets will create drift.

## 16. Definition of Done

The first usable version is done when:

- a user can select a category and reroll each seed independently
- the app always generates a valid deterministic weapon model
- the weapon renders as a coherent left-facing SVG line drawing
- all generated parts have typed domain representations, constraints, dimensions, and mass
- code is separated into UI, randomization, domain, generation, composition, and rendering layers
- the project runs with Vite hot reload and formats cleanly
