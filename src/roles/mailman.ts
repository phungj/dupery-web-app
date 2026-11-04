import type {GameContext, Character, RoleId} from "../types";
import { getRolesInPlay, getRolesNotInPlay } from "../board";

export function getMailmanInformation(
    context: GameContext,
    _character: Character
): string {
    const inPlay = getRolesInPlay(context.board);
    const notInPlay = getRolesNotInPlay(
        context.board,
        Object.keys(context.roles) as RoleId[]
    );

    const inPlayRole = chooseRandom(inPlay);
    const notInPlayRole = chooseRandom(notInPlay);

    return formatAnnouncement(context, inPlayRole, notInPlayRole);
}

export function getMailmanDeceptiveInformation(
    context: GameContext,
    _character: Character
): string {
    const inPlay = getRolesInPlay(context.board);
    const notInPlay = getRolesNotInPlay(
        context.board,
        Object.keys(context.roles) as RoleId[]
    );

    // Both claims must be false.
    const falseInPlayRole = chooseRandom(notInPlay);
    const falseNotInPlayRole = chooseRandom(inPlay);

    return formatAnnouncement(
        context,
        falseInPlayRole,
        falseNotInPlayRole
    );
}

function chooseRandom<T>(items: T[]): T {
    if (items.length === 0) {
        throw new Error("Cannot choose randomly from an empty list.");
    }

    return items[Math.floor(Math.random() * items.length)];
}

function formatAnnouncement(
    context: GameContext,
    inPlayRole: RoleId,
    notInPlayRole: RoleId
): string {
    return `The ${context.roles[inPlayRole].name} lives in town, I've never heard of the ${context.roles[notInPlayRole].name}.`;
}