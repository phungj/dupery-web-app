import type {
    Board,
    Character,
    Classification,
    RoleId,
} from "@/src/types";
import { createEmptyBoard } from "@/src/board";
import { roles } from "@/src/roles";

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

function getPretendedRole(
    roleId: RoleId,
    inPlay: RoleId[],
    excludedRoles: ReadonlySet<RoleId> = new Set()
): RoleId {
    // Wannabe always pretends to be an Underling in play.
    if (roleId === "wannabe") {
        const underlingsInPlay = inPlay.filter(
            (candidate) =>
                candidate !== "wannabe" &&
                !excludedRoles.has(candidate) &&
                roles[candidate].classification === "underling"
        );

        return chooseOne(underlingsInPlay);
    }

    const generation = roles[roleId].generation;

    if (!generation?.mustPretend) {
        return roleId;
    }

    let candidates = Object.keys(roles) as RoleId[];

    if (generation.mustPretendInPlay) {
        candidates = inPlay;
    } else if (generation.mustPretendNotInPlay) {
        candidates = candidates.filter(
            (candidate) => !inPlay.includes(candidate)
        );
    }

    candidates = candidates.filter(
        (candidate) =>
            candidate !== roleId &&
            !excludedRoles.has(candidate)
    );

    if (generation.mustPretendDefaultAlignment) {
        candidates = candidates.filter(
            (candidate) =>
                getDefaultAlignment(candidate) ===
                generation.mustPretendDefaultAlignment
        );
    }

    if (candidates.length === 0) {
        throw new Error(
            `No non-cyclic pretending role available for ${roleId}.`
        );
    }

    return chooseOne(candidates);
}

function applyWannabeEffects(
    character: Character,
    characters: Character[]
): void {
    character.apparentRoleState = {
        tainted: true,
        revealed: true,
    };

    const otherUnderlings = characters.filter(
        (other) =>
            roles[other.actualRole].classification === "underling" &&
            other.id !== character.id
    );

    const target = chooseOne(otherUnderlings);
    target.revealed = true;

    character.wannabeData = {
        revealedUnderlingId: target.id,
    };
}

function assignApparentRole(
    character: Character,
    inPlay: RoleId[],
    characters: Character[],
    forcedApparentRole?: RoleId
): void {
    // Actual Wannabe gets its special apparent identity.
    if (character.actualRole === "wannabe") {
        character.apparentRole = getPretendedRole(
            "wannabe",
            inPlay
        );

        character.announcementRole = character.apparentRole;

        applyWannabeEffects(character, characters);

        return;
    }

    const generation = roles[character.actualRole].generation;

    if (!generation?.mustPretend) {
        character.apparentRole = character.actualRole;
        character.announcementRole = character.actualRole;
        return;
    }

    // Determine the role being claimed.
    character.apparentRole = forcedApparentRole ??
        getPretendedRole(character.actualRole, inPlay);

    // Resolve additional pretending rules.
    let announcementRole = character.apparentRole;
    const visited = new Set<RoleId>();

    while (true) {
        if (announcementRole === "wannabe") {
            applyWannabeEffects(character, characters);
            announcementRole = getPretendedRole("wannabe", inPlay);
            break;
        }

        if (!roles[announcementRole].generation?.mustPretend) {
            break;
        }

        if (visited.has(announcementRole)) {
            throw new Error(
                `Pretending cycle detected at ${announcementRole}.`
            );
        }

        visited.add(announcementRole);

        announcementRole = getPretendedRole(
            announcementRole,
            inPlay,
            visited
        );
    }

    character.announcementRole = announcementRole;
}

export function generateBoard(
    selectedRoles?: RoleId[]
): Board {
    const rolesInPlay = selectedRoles ?? [
        ...selectRoles("innocent", 4),
        ...selectRoles("meddler", 2),
        ...selectRoles("underling", 2),
    ];

    const inPlay = rolesInPlay;

    const characters: Character[] = rolesInPlay.map(
        (roleId, index) => ({
            id: index + 1,
            address: 0,
            actualRole: roleId,
            apparentRole: roleId,
            announcementRole: roleId,
            alignment: getDefaultAlignment(roleId),
            lying: roles[roleId].generation?.mustLie ?? false,
            tainted: false,
            revealed: false,
            alive: true,
            arrested: false,
        })
    );

    for (const character of characters) {
        assignApparentRole(character, inPlay, characters);
    }

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

export function generateTestBoard(): Board {
    const rolesInPlay: RoleId[] = [
        "reporter",
        "therapist",
        "priest",
        "mathematician",
        "wannabe",
        "copycat",
        "mobster",
        "scoundrel",
    ];

    const characters: Character[] = rolesInPlay.map(
        (roleId, index) => ({
            id: index + 1,
            address: 0,
            actualRole: roleId,
            apparentRole: roleId,
            announcementRole: roleId,
            alignment: getDefaultAlignment(roleId),
            lying: roles[roleId].generation?.mustLie ?? false,
            tainted: false,
            revealed: false,
            alive: true,
            arrested: false,
        })
    );

    const inPlay = rolesInPlay;

    for (const character of characters) {
        assignApparentRole(
            character,
            inPlay,
            characters,
            character.actualRole === "copycat"
                ? "wannabe"
                : undefined
        );
    }

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