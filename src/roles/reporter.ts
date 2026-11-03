import type { Board, Character } from "../types";
import { getEvilCharacters, getDistance } from "../board";

function getClosestEvilDistance(
    board: Board,
    character: Character
): number | null {
    const evilCharacters = getEvilCharacters(board)
        .filter(evil => evil.id !== character.id);

    if (evilCharacters.length === 0) {
        return null;
    }

    return Math.min(
        ...evilCharacters.map(evil =>
            getDistance(character.address, evil.address)
        )
    );
}

export function getReporterInformation(
    board: Board,
    character: Character
): string {
    const distance = getClosestEvilDistance(board, character);

    if (distance === null) {
        return "I did not find any evil.";
    }

    const unit = distance === 1 ? "step" : "steps";
    return `I'm ${distance} ${unit} away from closest evil!`;
}

export function getReporterDeceptiveInformation(
    board: Board,
    character: Character
): string {
    const actualDistance = getClosestEvilDistance(board, character);

    const possibleDistances = [1, 2, 3, 4].filter(
        distance => distance !== actualDistance
    );

    const distance = possibleDistances[
        Math.floor(Math.random() * possibleDistances.length)
        ];

    const unit = distance === 1 ? "step" : "steps";
    return `I'm ${distance} ${unit} away from closest evil!`;
}