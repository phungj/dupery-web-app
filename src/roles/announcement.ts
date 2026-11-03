import type { Board, Character } from "../types";
import { roles } from "./index";

export function getAnnouncement(
    board: Board,
    character: Character
): string {
    const role = roles[character.apparentRole];

    if (character.lying || character.tainted) {
        return role.getDeceptiveInformation(board, character);
    }

    return role.getInformation(board, character);
}