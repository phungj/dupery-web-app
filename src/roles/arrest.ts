import type { Board, ArrestResult } from "../types";
import { roles } from "./index";

export function arrest(board: Board, address: number): ArrestResult {
    const character = board[address - 1];

    if (!character) {
        return { type: "empty" };
    }

    const role = roles[character.actualRole];

    if (role.canBeArrested && !role.canBeArrested(board, character)) {
        return { type: "not-allowed" };
    }

    return {
        type: "resolved",
        success: character.alignment === "evil",
        character,
        revealRole: role.revealOnArrest ?? true,
    };
}