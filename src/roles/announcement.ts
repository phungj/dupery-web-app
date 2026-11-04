import {Character, GameContext} from "@/src/types";

export function getAnnouncement(
    context: GameContext,
    character: Character
): string {
    const roleId = character.revealed
        ? character.actualRole
        : character.apparentRole;

    const role = context.roles[roleId];

    const isTainted = character.revealed
        ? character.tainted
        : character.apparentRoleState?.tainted ?? character.tainted;

    if (character.lying || isTainted) {
        return role.getDeceptiveInformation(context, character);
    }

    return role.getInformation(context, character);
}