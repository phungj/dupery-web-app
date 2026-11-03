import type { Board } from "../types";
import { getCharacterAt } from "../board";
import { getAnnouncement } from "./announcement";

export function investigate(
    board: Board,
    address: number
): string | null {
    const character = getCharacterAt(board, address);

    if (!character) {
        return null;
    }

    return getAnnouncement(board, character);
}