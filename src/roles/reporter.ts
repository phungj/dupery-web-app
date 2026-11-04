import type { GameContext, Character } from "../types";
import { getEvilCharacters, getDistance } from "../board";

function getClosestEvilDistance(
    context: GameContext,
    character: Character
): number | null {
    const evilCharacters = getEvilCharacters(context.board)
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
    context: GameContext,
    character: Character
): string {
    const distance = getClosestEvilDistance(context, character);

    if (distance === null) {
        return "I did not find any evil.";
    }

    const unit = distance === 1 ? "step" : "steps";
    return `I'm ${distance} ${unit} away from closest evil!`;
}

export function getReporterDeceptiveInformation(
    context: GameContext,
    character: Character
): string {
    const actualDistance = getClosestEvilDistance(context, character);

    const possibleDistances = [1, 2, 3, 4].filter(
        distance => distance !== actualDistance
    );

    const distance = possibleDistances[
        Math.floor(Math.random() * possibleDistances.length)
        ];

    const unit = distance === 1 ? "step" : "steps";
    return `I'm ${distance} ${unit} away from closest evil!`;
}