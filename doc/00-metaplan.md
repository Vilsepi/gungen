
# GunGen

Write a plan `plan.md` for a well-structured web app that procedurally random-generates 2D game art assets of imaginary but realistic firearms.

## What it does

It procedurally generates random weapon 2d models as svg line drawings. This is used in a game as user interface graphics for weapon selection and customization.

The weapon is viewed from the side, pointing to the left.

It should be able to generate different categories of modern weapons such as pistols, SMGs, assault rifles, battle rifles and DMRs.

A weapon consists of minimum core essential parts:

- receiver which is the central part
- barrel
- magwell
- magazine
- pistol grip

A weapon might also include a random number of different attachments, such as:

- optical sight, both red dots and mounted scopes
- laser device
- flashlight
- muzzle devices, such as silencers or muzzle brakes
- stock
- handguard
- hand stop or front grip

## Data model

Before a weapon is rendered, we model it as a bill of materials. Every weapon type have a list of must have core parts, and then every weapon type have an additional list of allowed components.

Each part should be modeled as its own class, and we may add more parts later. Every part category also has minimum and maximum outer dimensions (length and width) in millimeters. From the outer dimension we can calculate area, and each part category has a constant density, which allows us to calculate a weight for the part.

When the randomization has chosen a bunch of attachments, we have a hierarchical bill of materials of all the parts the weapons consists of.

Every Part type has one or more Attachment Points. Every part much be attached to other parts. A weapon forms a graph of parts.

Examples of parts and their attachment points and their constrains:

- Receiver is the central part, and has connection points above, below, front and back
- Pistol grip has one attachment point and can only connect to receiver
- Magwell has two endpoints: one can attach to either pistol grip or receiver, and the other can only attach to a magazine
- Magazine can only attach to a magwell
- Barrel has two endpoints: Begin must attach to a handguard if there is a handguard. Otherwise it must attach to a receiver. The End of a barrel may attach to a device
- If there is a handguard, it must connect to receiver and barrel
- there can be zero or one muzzle device and it can only connect to barrel
- optical sights connect to top of receiver
- laser devices, flashlights, hand stop or other front grips connect to handguard
- stock connects to end of receiver

Every part has minimum and maximum possible dimensions, and every weapon category narrows these down further.

For example:

- A pistol handguard can be 0-100 mm long
- A rifle handguard can be 200-400 mm long

## Technologies to use

- Npm
- Vite 7.3.1 and hotreloading
- typescript using strong typing
- prettier or any other linter or autoformatter or style checker

## Randomization

For every weapon, we pick a category and then several random different `seeds`.

- Category is either Pistol, SMG, Carbine, AssaultRifle, BattleRifle, DMR, Sniper
- **Data Model Seed** affects the bill of materials: which attachments we pick
- **Part Size Seed** affects the rough outer millimeter dimension of every part and thus weight
- **Aesthetic Detail Seed** affects the exact SVG rendering details within the given outer dimensions

With these separate seeds, the user can reroll each seed separately. Once the user has settled with the category, they can continue to reroll each seed.

A given Category - Data Model Seed - Part Size Seed - Aesthetic Detail Seed -combination should always produce the exact same end result.

## Software architecture

Strongly separate the following into directories and files:

- index.html and style.css
- user interface javascript
- randomization and seeding logic
- potential weapon part domain classes
- constructing a whole viable weapon as a combination of parts
- rendering each part with details
- rendering the composition of parts where parts are joined together
- every weapon part should have its own domain class as well as separate rendering logic

Make a suggestion of a expandable directory structure. Put all code under `src/` directory.

## Reference graphics

See [Reference screenshot](reference.jpg) for what we are aiming at.
