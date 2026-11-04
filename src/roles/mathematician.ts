import type { GameContext, Character } from "../types";
import { getEvilCharacters } from "../board";

function getEvilAddressSum(context: GameContext): number {
    return getEvilCharacters(context.board).reduce(
        (sum, character) => sum + character.address,
        0
    );
}

function getMaximumError(trueSum: number): number {
    if (trueSum <= 11) {
        return 4;
    }

    if (trueSum < 29) {
        return Math.floor(trueSum * 0.35);
    }

    return 10;
}

export function getMathematicianInformation(
    context: GameContext,
    _character: Character
): string {
    const sum = getEvilAddressSum(context);

    return `I have calculated the number ${sum}.`;
}

export function getMathematicianDeceptiveInformation(
    context: GameContext,
    _character: Character
): string {
    const trueSum = getEvilAddressSum(context);
    const maximumError = getMaximumError(trueSum);

    // Choose whether to overestimate or underestimate.
    const increase = trueSum === 0 || Math.random() < 0.5;

    // Don't allow the announced sum to become negative.
    const maximumOffset = increase
        ? maximumError
        : Math.min(maximumError, trueSum);

    const offset = Math.floor(Math.random() * maximumOffset) + 1;

    const announcedSum = increase
        ? trueSum + offset
        : trueSum - offset;

    return `I have calculated the number ${announcedSum}.`;
}