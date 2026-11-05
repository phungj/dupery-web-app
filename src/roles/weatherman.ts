import type { GameContext, Character } from "../types";

function getRandomCharacter(
    characters: Character[]
): Character {
    return characters[Math.floor(Math.random() * characters.length)];
}

function getRandomCharacters(
    characters: Character[],
    count: number
): Character[] {
    const selected = [...characters];

    for (let i = selected.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selected[i], selected[j]] = [selected[j], selected[i]];
    }

    return selected.slice(0, count);
}

function formatForecast(characters: Character[]): string {
    const addresses = characters
        .map(character => character.address)
        .sort((a, b) => a - b);

    return `The forecast today! ${addresses.map(address => `#${address}`).join(", ")}.`;
}

export function getWeathermanInformation(
    context: GameContext,
    _character: Character
): string {
    const characters = context.board.filter(
        (candidate): candidate is Character => candidate !== null
    );

    const innocent = characters.filter(
        candidate =>
            context.roles[candidate.actualRole].classification === "innocent"
    );

    const meddler = characters.filter(
        candidate =>
            context.roles[candidate.actualRole].classification === "meddler"
    );

    const underling = characters.filter(
        candidate =>
            context.roles[candidate.actualRole].classification === "underling"
    );

    return formatForecast([
        getRandomCharacter(innocent),
        getRandomCharacter(meddler),
        getRandomCharacter(underling),
    ]);
}

export function getWeathermanDeceptiveInformation(
    context: GameContext,
    _character: Character
): string {
    const characters = context.board.filter(
        (candidate): candidate is Character => candidate !== null
    );

    const eligible = characters.filter(candidate => {
        const classification =
            context.roles[candidate.actualRole].classification;

        return classification === "innocent" ||
            classification === "meddler";
    });

    return formatForecast(getRandomCharacters(eligible, 3));
}