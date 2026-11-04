import type { GameContext } from "../types";
import { getCharacterAt } from "../board";
import { getAnnouncement } from "./announcement";

export function investigate(
    context: GameContext,
    address: number
): string | null {
    const character = getCharacterAt(context.board, address);

    if (!character) {
        return null;
    }

    return getAnnouncement(context, character);
}