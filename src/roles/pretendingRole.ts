import type { GameContext, Character } from "../types";

export function getPretendingInformation(
    context: GameContext,
    character: Character
): string {
    return context.roles[character.apparentRole]
        .getInformation(context, character);
}

export function getPretendingDeceptiveInformation(
    context: GameContext,
    character: Character
): string {
    return context.roles[character.apparentRole]
        .getDeceptiveInformation(context, character);
}