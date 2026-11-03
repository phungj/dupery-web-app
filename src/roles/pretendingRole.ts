import type { Board, Character } from "@/src/types";
import { roles } from "./index";

export function getPretendingInformation(
    board: Board,
    character: Character
): string {
    return roles[character.apparentRole].getInformation(board, character);
}

export function getPretendingDeceptiveInformation(
    board: Board,
    character: Character
): string {
    return roles[character.apparentRole].getDeceptiveInformation(board, character);
}