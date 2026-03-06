import { SeedBundle } from "../core/types";
import { Weapon } from "../domain/bom/weapon";
import { createDefaultSeeds } from "../generation/defaults";
import { generateWeapon } from "../generation/generate-weapon";
import { randomSeedString } from "../random/seed";

export interface AppState {
  seeds: SeedBundle;
  debug: boolean;
  weapon: Weapon;
}

export type StateListener = (state: AppState) => void;

export function createInitialState(): AppState {
  const seeds = createDefaultSeeds();
  return {
    seeds,
    debug: false,
    weapon: generateWeapon(seeds),
  };
}

export function createStore(initialState = createInitialState()) {
  let state = initialState;
  const listeners = new Set<StateListener>();

  const emit = () => {
    for (const listener of listeners) {
      listener(state);
    }
  };

  const regenerate = (seeds: SeedBundle = state.seeds, debug = state.debug) => {
    state = {
      seeds,
      debug,
      weapon: generateWeapon(seeds),
    };
    emit();
  };

  return {
    getState(): AppState {
      return state;
    },
    subscribe(listener: StateListener): () => void {
      listeners.add(listener);
      listener(state);
      return () => listeners.delete(listener);
    },
    setCategory(category: SeedBundle["category"]): void {
      regenerate({ ...state.seeds, category });
    },
    setSeed(field: keyof Omit<SeedBundle, "category">, value: string): void {
      regenerate({ ...state.seeds, [field]: value });
    },
    reroll(field: keyof Omit<SeedBundle, "category">): void {
      regenerate({ ...state.seeds, [field]: randomSeedString() });
    },
    rerollAll(): void {
      regenerate({
        ...state.seeds,
        dataModelSeed: randomSeedString(),
        partSizeSeed: randomSeedString(),
        aestheticDetailSeed: randomSeedString(),
      });
    },
    toggleDebug(): void {
      regenerate(state.seeds, !state.debug);
    },
  };
}

export type Store = ReturnType<typeof createStore>;
