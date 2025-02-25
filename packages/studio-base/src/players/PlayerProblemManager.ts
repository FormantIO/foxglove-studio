// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { PlayerProblem } from "@foxglove/studio-base/players/types";

/**
 * Manages a set of PlayerProblems keyed by ID. Calls to problems() will return the same object as
 * long as problems have not been added/removed; this helps the player pipeline to know when it
 * needs to re-process player problems.
 */
export default class PlayerProblemManager {
  private _problemsById = new Map<string, PlayerProblem>();
  private _problems?: PlayerProblem[];

  /**
   * Returns the current set of problems. Subsequent calls will return the same object as long as
   * problems have not been added/removed.
   */
  problems(): PlayerProblem[] {
    return (this._problems ??= Array.from(this._problemsById.values()));
  }

  addProblem(id: string, problem: PlayerProblem): void {
    console[problem.severity].call(console, "Player problem", id, problem);
    this._problemsById.set(id, problem);
    this._problems = undefined;
  }

  hasProblem(id: string): boolean {
    return this._problemsById.has(id);
  }

  removeProblem(id: string): boolean {
    const changed = this._problemsById.delete(id);
    if (changed) {
      this._problems = undefined;
    }
    return changed;
  }

  removeProblems(predicate: (id: string, problem: PlayerProblem) => boolean): boolean {
    let changed = false;
    for (const [id, problem] of this._problemsById) {
      if (predicate(id, problem)) {
        if (this._problemsById.delete(id)) {
          changed = true;
        }
      }
    }
    if (changed) {
      this._problems = undefined;
    }
    return changed;
  }

  clear(): void {
    this._problemsById.clear();
    this._problems = undefined;
  }
}
