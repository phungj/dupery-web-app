import type {
    Board,
    Character,
    Classification,
    RoleId,
} from "@/src/types";
import { createEmptyBoard } from "@/src/board";
import { roles } from "@/src/roles"; // Adjust to your registry's path

function shuffle<T>(items: T[]): T[] {
    const result = [...items];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

function chooseOne<T>(items: T[]): T {
    if (items.length === 0) {
        throw new Error("Cannot choose from an empty array.");
    }

    return items[Math.floor(Math.random() * items.length)];
}

function selectRoles(
    classification: Classification,
    count: number
): RoleId[] {
    const candidates = Object.values(roles)
        .filter((role) => role.classification === classification)
        .map((role) => role.id);

    if (candidates.length < count) {
        throw new Error(
            `Not enough ${classification} roles to generate a board.`
        );
    }

    return shuffle(candidates).slice(0, count);
}

function getDefaultAlignment(roleId: RoleId): "good" | "evil" {
    return roles[roleId].classification === "underling"
        ? "evil"
        : "good";
}

function assignApparentRole(
    character: Character,
    inPlay: RoleId[]
): void {
    // Wannabe has a special apparent-role rule.
    if (character.actualRole === "wannabe") {
        const underlingsInPlay = inPlay.filter(
            (roleId) =>
                roles[roleId].classification === "underling" &&
                roleId !== character.actualRole
        );

        character.apparentRole = chooseOne(underlingsInPlay);
        character.apparentRoleState = {
            tainted: true,
            revealed: true,
        };

        return;
    }

    const generation = roles[character.actualRole].generation;

    if (!generation?.mustPretend) {
        character.apparentRole = character.actualRole;
        return;
    }

    let candidates = Object.keys(roles) as RoleId[];

    if (generation.mustPretendInPlay) {
        candidates = inPlay;
    } else if (generation.mustPretendNotInPlay) {
        candidates = candidates.filter(
            (roleId) => !inPlay.includes(roleId)
        );
    }

    candidates = candidates.filter(
        (roleId) => roleId !== character.actualRole
    );

    if (generation.mustPretendDefaultAlignment) {
        candidates = candidates.filter(
            (roleId) =>
                getDefaultAlignment(roleId) ===
                generation.mustPretendDefaultAlignment
        );
    }

    character.apparentRole = chooseOne(candidates);
}

export function generateBoard(): Board {
    const selectedRoles = [
        ...selectRoles("innocent", 4),
        ...selectRoles("meddler", 2),
        ...selectRoles("underling", 2),
    ];

    const inPlay = selectedRoles;

    const characters: Character[] = selectedRoles.map(
        (roleId, index) => ({
            id: index + 1,
            address: 0,
            actualRole: roleId,
            apparentRole: roleId,
            alignment: getDefaultAlignment(roleId),
            lying: roles[roleId].generation?.mustLie ?? false,
            tainted: false,
            revealed: false,
            alive: true,
            arrested: false,
        })
    );

    // Assign apparent roles.
    for (const character of characters) {
        assignApparentRole(character, inPlay);
    }

    // Resolve Wannabe's revealed Underling.
    const wannabe = characters.find(
        (character) => character.actualRole === "wannabe"
    );

    if (wannabe) {
        const otherUnderlings = characters.filter(
            (character) =>
                character.alignment === "evil" &&
                character.id !== wannabe.id
        );

        const target = chooseOne(otherUnderlings);
        target.revealed = true;

        wannabe.wannabeData = {
            revealedUnderlingId: target.id,
        };
    }

    // Assign random addresses, leaving one empty.
    const addresses = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    characters.forEach((character, index) => {
        character.address = addresses[index];
    });

    const board = createEmptyBoard();

    for (const character of characters) {
        board[character.address - 1] = character;
    }

    return board;
}