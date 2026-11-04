import type { Character, GameContext } from "../types";

export function canScoundrelBeArrested(
    context: GameContext,
    character: Character
): boolean {
    if (character.tainted) {
        return true;
    }

    return !context.board.some(
        (other) =>
            other !== null &&
            other.id !== character.id &&
            other.alignment === "evil" &&
            other.alive &&
            !other.arrested
    );
}