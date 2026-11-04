import type { GameContext, Character } from "../types";

export function getAnnouncement(
    context: GameContext,
    character: Character
): string {
    const role = context.roles[character.apparentRole];

    if (character.lying || character.tainted) {
        return role.getDeceptiveInformation(context, character);
    }

    return role.getInformation(context, character);
}