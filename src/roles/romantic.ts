import type { GameContext, Character } from "../types";

function getRomanticAnnouncement(context: GameContext): string {
    const relationship = context.romanticRelationship;

    if (!relationship || relationship.loverId === null) {
        return "I love myself!";
    }

    if (relationship.charmed) {
        return "My lover ran away with somebody else?!";
    }

    const lover = context.board.find(
        character => character?.id === relationship.loverId
    );

    if (!lover) {
        throw new Error("Romantic's lover was not found on the board.");
    }

    return `I love #${lover.address}!`;
}

export function getRomanticInformation(
    context: GameContext,
    _character: Character
): string {
    return getRomanticAnnouncement(context);
}

export function getRomanticDeceptiveInformation(
    context: GameContext,
    _character: Character
): string {
    return getRomanticAnnouncement(context);
}