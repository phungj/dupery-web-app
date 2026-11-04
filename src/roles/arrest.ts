import type {GameContext, ArrestResult, Board, Character} from "../types";
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

    const revealRole = role.revealOnArrest ?? true;

    const updatedCharacter: Character = {
        ...character,
        arrested: true,
        revealed: character.revealed || revealRole,
    };

    const updatedBoard = context.board.map((current) =>
        current?.id === character.id ? updatedCharacter : current
    ) as Board;

    return {
        type: "resolved",
        success: character.alignment === "evil",
        character: updatedCharacter,
        board: updatedBoard,
        revealRole,
    };
}