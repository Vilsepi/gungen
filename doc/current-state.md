
# GunGen

GunGen currently works as a deterministic procedural pipeline where the bill of materials is the primary source of truth, sizing turns that BOM into plausible physical proportions, layout turns the sized BOM into a readable side-view composition, and SVG part renderers turn that layout into a left-facing firearm illustration with seeded visual variation.

The core idea: generate a plausible modern firearm as a deterministic SVG line drawing. The current implementation does that by first creating a bill of materials, then sizing the parts, then placing those parts into a 2D side-view layout, and finally rendering seeded SVG detail on top of that layout.

The generator currently produces one complete weapon at a time with:

- a weapon category
- a deterministic seed bundle
- a bill of materials made of typed parts
- a connection list between those parts
- resolved physical dimensions for every part
- derived metrics such as total mass, total price, total sizeX, and total sizeY
- a 2D layout for every part
- a final left-facing SVG illustration

Supported categories are:

- Pistol
- SMG
- Carbine
- AssaultRifle
- BattleRifle
- DMR
- Sniper

Supported part kinds are:

- receiver
- barrel
- magwell
- magazine
- pistolGrip
- handguard
- stock
- optic
- laser
- flashlight
- muzzleDevice
- frontGrip

Every generated weapon always contains exactly one core receiver, barrel, magwell, magazine, and pistol grip. Optional parts are selected per category.

## Current Design Principles

The most important design principles in the current code are:

## 1. Determinism Is The First Constraint

The whole pipeline is driven by a seed bundle:

- category
- dataModelSeed
- partSizeSeed
- aestheticDetailSeed

These seeds are normalized into numeric values and then used in separate stages. The implementation protects the main separation of concerns:

- the data model seed controls which parts exist and what part levels they receive
- the part size seed controls dimensions, area, mass, and downstream overall metrics
- the aesthetic detail seed controls the visual detail drawn by the SVG renderers

This means aesthetic rerolls do not change the BOM, and size rerolls do not change which attachments were selected.

## 2. BOM First, Rendering Second

The renderer does not invent parts on its own. It renders the outcome of the BOM pipeline.

The current flow is:

1. Choose parts from category rules and probabilities.
2. Instantiate typed part objects.
3. Resolve dimensions and mass.
4. Validate the result.
5. Convert parts into positioned layout objects.
6. Render SVG from that layout.

That is the main architectural boundary in the project.

## 3. Category Rules Live In Data Presets

Category-specific behavior is centralized in preset files rather than spread across the codebase. Each category defines:

- required parts
- optional parts
- per-part attachment odds
- per-part dimension overrides
- simple tags describing the category

This keeps most variation data-driven even though the layout and connection logic are still fairly explicit and hand-authored.

## 4. The Generator Prefers A Curated Weapon Grammar

The current implementation is not a general-purpose firearm graph solver. It uses a smaller, more controlled grammar:

- one instance per part kind
- a fixed set of known part types
- a fixed connection pattern for those types
- direct placement rules by part kind during layout

This is a deliberate simplification. The project still models attachments and connections, but composition is currently driven by a reliable recipe rather than by solving a fully generic graph.

## Current Generation Pipeline

## 1. Seed Bundle And Random Streams

Each generation run starts from a `SeedBundle` containing the category and three seed strings.

Seed handling has a few important properties:

- numeric strings remain numeric
- arbitrary strings are hashed into a 32-bit seed
- the generator uses a Mulberry32-based PRNG
- PRNGs can be forked with salts to produce deterministic sub-streams

In practice:

- `dataModelSeed` creates the BOM and selects part levels
- `partSizeSeed` sizes parts
- `aestheticDetailSeed` is reused during rendering, with each part receiving its own deterministic sub-seed derived from the part id

This per-part detail seeding is important because it gives stable visual variety even when multiple parts share the same renderer.

## 2. Category Presets Define The Weapon Family

Each weapon category starts from the same core part set:

- receiver
- barrel
- magwell
- magazine
- pistolGrip

Optional parts are category-dependent. Long guns generally allow:

- stock
- handguard
- optic
- laser
- flashlight
- muzzleDevice
- frontGrip

The presets also narrow each part's min and max outer dimensions. For example:

- pistols are short and compact
- assault rifles receive longer handguards and barrels
- DMRs and sniper rifles push barrel, optic, and stock ranges further toward precision-oriented proportions

The category tags are descriptive metadata such as `compact`, `modular`, or `precision`. They exist in the model today, although the main generation and rendering logic does not yet make heavy use of them.

## 3. BOM Selection Chooses Which Parts Exist

The BOM stage starts from the required core parts and then runs optional part selection using the category's attachment odds.

This stage contains a few notable gameplay-style rules:

- if `frontGrip`, `laser`, or `flashlight` is selected, `handguard` is automatically added
- all non-pistol categories automatically receive a `stock`
- `DMR` and `Sniper` always receive an `optic` even if the probability roll misses

So the optional part system is probabilistic, but it is also corrected into valid or stylistically expected combinations.

The current implementation uses a single selected instance per part kind. There is no support yet for multiple optics, multiple magazines, alternate rail positions, or multiple muzzle accessories.

## 4. Part Instantiation Adds Part Identity And Quality Tier

Once the final set of part kinds is known, the generator constructs concrete part objects from the part factory.

Each part object currently contains:

- an id such as `receiver-1`
- a `kind`
- a display name
- a `partLevel`
- density
- base dimension range
- attachment point specs turned into attachment point objects
- resolved dimensions, area, and mass

Part levels are also randomized during BOM generation. The current quality tiers are:

- Normal
- Improved
- Rare
- Exotic

These levels do not change geometry, but they do affect price and final rendering colors.

## 5. Attachment Points And Connections Model Weapon Structure

Each part type declares its own attachment points. Examples:

- receiver exposes top, bottom, front, and rear mounts
- barrel exposes start and end
- handguard exposes rear, front, bottom, and side mounts
- magwell exposes host and magazine mount
- optic, stock, laser, flashlight, muzzle device, and front grip each expose a single mount point

After parts are created, the generator builds a connection list using a fixed topology:

- pistol grip mounts to receiver bottom
- magwell mounts to receiver bottom
- magazine mounts to magwell
- barrel mounts to receiver front, or to the handguard front if a handguard exists
- handguard mounts back into the receiver front
- stock mounts to receiver rear
- optic mounts to receiver top
- laser mounts to handguard side
- flashlight mounts to handguard bottom
- front grip mounts to handguard bottom
- muzzle device mounts to barrel end

This structure captures the semantic relationships between parts even though later layout does not numerically solve positions from the connection graph itself.

## 6. Size Resolution Happens After BOM Selection

Once the BOM is fixed, the generator resolves actual dimensions for each part.

The current sizing model works like this:

1. Start from base min and max dimensions for the part kind.
2. Apply category-specific overrides.
3. Sample sizeX and sizeY from the resulting range.
4. Compute area as `sizeX * sizeY`.
5. Compute mass from area and part density.

An important detail is that size sampling is forked per part using the part id, so the size stream stays deterministic even as the exact set of parts changes.

The dimensions are still simplified outer dimensions, not full engineering geometry. The project intentionally uses tuned densities rather than real material densities, because the dimensions are approximate and the goal is believable weapon metrics rather than real-world physics.

## 7. Derived Metrics Are Part Of The Weapon Model

The current weapon model tracks more than geometry.

After layout, the project computes:

- total mass
- total price
- total sizeX
- total sizeY

Price is derived from:

- per-kind price-per-gram values
- the part's mass
- a multiplier based on part level

This means the BOM is already useful for UI and gameplay-facing stats, not just for rendering.

## 8. Validation Enforces The Current Weapon Grammar

Before the BOM result is accepted, validation checks that:

- all required parts exist
- no unsupported part appears for the chosen category
- receiver and barrel are always present
- every connection points at real part ids
- rail accessories require a handguard
- pistols cannot receive a stock

This validation is not a full graph-theory validation of every attachment point's cardinality, but it is strong enough to guard the current curated generation rules.

## From BOM To Layout

## 1. Layout Uses The BOM But Is Not Graph-Solved

The layout stage takes the list of parts and constructs positioned `LayoutPart` objects.

This is a crucial current-state detail: layout does not walk the connection graph to solve arbitrary spatial relationships. Instead, it uses direct placement rules keyed by known part kinds.

That makes the current system reliable and easy to tune, but also means extensibility is currently tied to adding explicit placement logic for new parts.

## 2. Receiver-Centered Composition

The receiver acts as the coordinate anchor for the whole weapon. It is placed at the origin, and most other parts are positioned relative to it.

Current placement logic includes:

- receiver centered at `(0, 0)`
- handguard placed slightly forward and slightly lower than the receiver centerline
- barrel placed forward of the receiver, offset further if a handguard exists
- magwell placed below the receiver at a forward-leaning angle
- magazine placed below the magwell at a slightly different angle
- pistol grip placed below and behind the receiver
- stock placed behind the receiver
- optic placed directly above the receiver
- rail accessories placed along the handguard using fixed relative ratios
- muzzle device placed at the barrel tip

The layout also records named anchors for each part, which are useful for debug rendering and for asserting mount contact in tests.

## 3. Certain Parts Use A Vertical Major Axis

Most parts are treated as primarily horizontal, but some are intentionally treated as vertically oriented during bounds calculation:

- magwell
- magazine
- pistolGrip
- frontGrip

This matters because the project computes layout bounds using rotated half-extents, so vertical parts with rotation are measured correctly in the final view box.

## 4. Metrics And Bounds Come Out Of Layout

Layout is also the point where the generator produces whole-weapon metrics and final bounds.

The bounds calculation:

- accounts for part rotation
- includes padding around the weapon
- drives the SVG `viewBox`

The final SVG is therefore framed from the actual composed weapon rather than from category-specific hardcoded canvas sizes.

## From Layout To SVG Rendering

## 1. Rendering Is Split By Part Kind

Every supported part kind has its own renderer. These renderers consume the layout output, not the raw BOM objects.

That means each renderer gets:

- position
- rotation
- resolved outer sizeX and sizeY
- part kind
- part level

The renderer is free to vary surface detail, profiles, panels, slots, cuts, and shading, but it should stay inside the outer dimensions already decided earlier in the pipeline.

## 2. Part Renderers Use Seeded Variation Inside Fixed Envelopes

The aesthetic seed is not used once at the whole-weapon level and shared blindly. Instead, the renderer derives a unique PRNG per part from:

- the weapon's `aestheticDetailSeed`
- the hashed part id

This gives deterministic local variation such as:

- receiver profile choice between slab, carbine, and precision bodies
- different numbers of receiver cuts and rail notches
- handguard profile choice between railed, tapered, and tube styles
- different counts of handguard slots and rail teeth
- optic profile choice between holo, red-dot, LPVO, and tube scope bodies depending on dimensions

This is one of the strongest current design decisions in the codebase: geometry is chosen first, then the renderers decorate that geometry with stable visual variation.

## 3. Rendering Includes Quality-Tier Styling

Each rendered part gets CSS classes based on part level:

- `level-normal`
- `level-improved`
- `level-rare`
- `level-exotic`

These classes change fill and stroke colors. So the quality tier selected during BOM generation becomes visible in the final SVG.

## 4. Rendering Uses A Fixed Layer Order

The whole-weapon renderer draws parts in a curated order rather than by automatic depth solving.

The current order is roughly:

- barrel and muzzle device
- under-barrel accessories
- magazine, magwell, and pistol grip
- stock and handguard
- laser and receiver
- optic

This ordering is tuned so silhouettes and overlaps read clearly in side view.

## 5. The Final SVG Is Mirrored To Face Left

Internally, layout is built in a right-facing coordinate system because it is simpler to reason about positive forward movement.

The final SVG document then applies a transform that mirrors the drawing horizontally. This is how the project preserves the intended left-facing presentation without making layout math harder.

## Current User-Facing Features Built On Top Of The Pipeline

Although the project is fundamentally a generator and renderer, the current app already exposes several useful features on top of the pipeline:

- category selection
- rerolling all seeds at once
- rerolling each seed independently
- debug overlay toggle
- export of the generated SVG
- copying the current seed bundle
- copying a deterministic headless render command
- shareable state through URL parameters
- generated weapon name derived from the three seeds
- summary display of part list, dimensions, mass, total price, and overall size

There is also a headless SVG render path for tests and automation, which uses the same generation and rendering pipeline as the browser UI.

## What Is Most Important About The Current Architecture

If the codebase is understood as a sequence of responsibilities, the current structure is:

1. Presets define what categories tend to contain.
2. The BOM stage decides which parts exist.
3. The sizing stage decides how large those parts are.
4. Validation enforces the current weapon grammar.
5. Layout turns typed parts into positioned geometry.
6. Renderers add deterministic visual character without changing the resolved outer form.

That is the main current-state design principle of GunGen.

## Current Limits And Tradeoffs

The present implementation is strong in determinism and clarity, but it is still deliberately constrained.

Current tradeoffs include:

- only one instance of each part kind is supported
- the connection graph is modeled, but layout is not derived from solving that graph generically
- attachment validation is curated and practical rather than exhaustive
- dimensions and densities are tuned for believable output, not real engineering accuracy
- aesthetic detail is rich, but it remains bounded by hand-authored renderer families

These are not accidental weaknesses. They are part of why the current generator is stable and testable.
