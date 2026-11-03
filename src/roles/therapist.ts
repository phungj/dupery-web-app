import type { Board, Character } from "../types";
import { getAdjacentCharacters } from "../board";

export function getTherapistInformation(
    board: Board,
    character: Character
): string {
    const count = getAdjacentCharacters(board, character)
        .filter(other => other.alignment === "evil")
        .length;

    const clientLabel = count === 1 ? "client" : "clients";

    return `I have ${count} evil ${clientLabel}.`;
}

export function getTherapistDeceptiveInformation(
    board: Board,
    character: Character
): string {
    const actualCount = getAdjacentCharacters(board, character)
        .filter(other => other.alignment === "evil")
        .length;

    const possibleCounts = [0, 1, 2, 3, 4].filter(
        count => count !== actualCount
    );

    const count = possibleCounts[
        Math.floor(Math.random() * possibleCounts.length)
        ];

    const clientLabel = count === 1 ? "client" : "clients";

    return `I have ${count} evil ${clientLabel}.`;
}