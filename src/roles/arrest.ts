import type { GameContext, ArrestResult } from "../types";
import { getCharacterAt } from "../board";

export function arrest(
    context: GameContext,
    address: number
): ArrestResult {
    const character = getCharacterAt(context.board, address);

    if (!character) {
        return { type: "empty" };
    }

    const role = context.roles[character.actualRole];

    if (
        role.canBeArrested &&
        !role.canBeArrested(context, character)
    ) {
        return { type: "not-allowed" };
    }

    return {
        type: "resolved",
        success: character.alignment === "evil",
        character,
        revealRole: role.revealOnArrest ?? true,
    };
}