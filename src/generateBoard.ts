import type {Board, Character, Classification, GeneratedGame, RoleId,} from "@/src/types";
import {createEmptyBoard,    getAdjacentCharacters,
    getSurroundingCharacters,} from "@/src/board";
import {roles} from "@/src/roles";


import type {
    RomanticRelationship,
} from "./types";

type ClassificationCounts = Record<Classification, number>;

export type GenerationOptions = {
    suspectedRoleCounts?: ClassificationCounts;
    inPlayRoleCounts?: ClassificationCounts;
};

const DEFAULT_SUSPECTED_COUNTS: ClassificationCounts = {
    innocent: 5,
    meddler: 3,
    underling: 3,
};

const DEFAULT_IN_PLAY_COUNTS: ClassificationCounts = {
    innocent: 4,
    meddler: 2,
    underling: 2,
};

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
    const availableRoles = Object.values(roles)
        .filter(role => role.classification === classification)
        .map(role => role.id);

    if (count > availableRoles.length) {
        throw new Error(
            `Cannot select ${count} ${classification} roles: only ${availableRoles.length} available.`
        );
    }

    return shuffle(availableRoles).slice(0, count);
}

function getDefaultAlignment(roleId: RoleId): "good" | "evil" {
    return roles[roleId].classification === "underling"
        ? "evil"
        : "good";
}

function getPretendedRole(
    roleId: RoleId,
    inPlay: RoleId[],
    suspectedRoleIds: RoleId[],
    excludedRoles: ReadonlySet<RoleId> = new Set()
): RoleId {
    // Wannabe always pretends to be an Underling in play.
    if (roleId === "wannabe") {
        const underlingsInPlay = inPlay.filter(
            candidate =>
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

    let candidates: RoleId[];

    if (generation.mustPretendInPlay) {
        candidates = inPlay;
    } else if (generation.mustPretendNotInPlay) {
        candidates = suspectedRoleIds.filter(
            candidate => !inPlay.includes(candidate)
        );
    } else if (generation.mustPretendSuspected) {
        candidates = suspectedRoleIds;
    } else {
        candidates = Object.keys(roles) as RoleId[];
    }

    candidates = candidates.filter(
        candidate =>
            candidate !== roleId &&
            !excludedRoles.has(candidate)
    );

    if (generation.mustPretendDefaultAlignment) {
        candidates = candidates.filter(
            candidate =>
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
    suspectedRoleIds: RoleId[],
    characters: Character[],
    forcedApparentRole?: RoleId
): void {
    // Actual Wannabe gets its special apparent identity.
    if (character.actualRole === "wannabe") {
        character.apparentRole = getPretendedRole(
            "wannabe",
            inPlay,
            suspectedRoleIds
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
        getPretendedRole(character.actualRole, inPlay, suspectedRoleIds);

    // Resolve additional pretending rules.
    let announcementRole = character.apparentRole;
    const visited = new Set<RoleId>();

    while (true) {
        if (announcementRole === "wannabe") {
            applyWannabeEffects(character, characters);
            announcementRole = getPretendedRole("wannabe", inPlay, suspectedRoleIds);
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
            suspectedRoleIds,
            visited
        );
    }

    character.announcementRole = announcementRole;
}

function chooseRandom<T>(items: T[]): T | null {
    if (items.length === 0) return null;

    return items[Math.floor(Math.random() * items.length)];
}

function buildBoard(characters: Character[]): Board {
    const board = createEmptyBoard();

    for (const character of characters) {
        board[character.address - 1] = character;
    }

    return board;
}

function createRomanticRelationship(
    characters: Character[]
): RomanticRelationship | null {
    const romantic = characters.find(
        character => character.actualRole === "romantic"
    );

    if (!romantic) return null;

    const casanova = characters.find(
        character => character.actualRole === "casanova"
    );

    let board = buildBoard(characters);

    let possibleLovers: Character[];

    if (romantic.lying || romantic.tainted) {
        // A deceptive Romantic chooses an Underling.
        possibleLovers = characters.filter(
            character =>
                roles[character.actualRole].classification === "underling"
        );
    } else {
        // A truthful Romantic chooses an adjacent Innocent.
        possibleLovers = getAdjacentCharacters(
            board,
            romantic
        ).filter(
            character =>
                roles[character.actualRole].classification === "innocent"
        );
    }

    const lover = chooseRandom(possibleLovers);

    if (!lover) {
        return {
            romanticId: romantic.id,
            loverId: null,
            casanovaId: casanova?.id ?? null,
            charmed: false,
        };
    }

    // A truthful, untainted Romantic requires Casanova to surround the lover.
    if (
        casanova &&
        !romantic.lying &&
        !romantic.tainted
    ) {
        const surrounding = getSurroundingCharacters(board, lover);

        const alreadySurrounding = surrounding.some(
            character => character.id === casanova.id
        );

        if (!alreadySurrounding) {
            // Swap Casanova with another surrounding character.
            const swapTarget = surrounding.find(
                character =>
                    character.id !== romantic.id &&
                    character.id !== casanova.id
            );

            if (!swapTarget) {
                throw new Error(
                    "Unable to position Casanova around the Romantic's lover."
                );
            }

            const previousAddress = casanova.address;

            casanova.address = swapTarget.address;
            swapTarget.address = previousAddress;

            board = buildBoard(characters);
        }
    }

    const charmed =
        casanova !== undefined &&
        !romantic.lying &&
        !romantic.tainted &&
        !casanova.tainted &&
        getSurroundingCharacters(board, lover).some(
            character => character.id === casanova.id
        );

    return {
        romanticId: romantic.id,
        loverId: lover.id,
        casanovaId: casanova?.id ?? null,
        charmed,
    };
}

export function generateBoard(
    options: GenerationOptions = {}
): GeneratedGame {
    const suspectedCounts: ClassificationCounts = {
        ...DEFAULT_SUSPECTED_COUNTS,
        ...options.suspectedRoleCounts,
    };

    const inPlayCounts: ClassificationCounts = {
        ...DEFAULT_IN_PLAY_COUNTS,
        ...options.inPlayRoleCounts,
    };

    const classifications: Classification[] = [
        "innocent",
        "meddler",
        "underling",
    ];

    // Select the complete pool of suspected roles.
    const suspectedRoleIds = classifications.flatMap(
        classification =>
            selectRoles(
                classification,
                suspectedCounts[classification]
            )
    );

    // Select which suspected roles actually appear on the board.
    const rolesInPlay = classifications.flatMap(classification => {
        const suspectedForClassification = suspectedRoleIds.filter(
            roleId =>
                roles[roleId].classification === classification
        );

        const count = inPlayCounts[classification];

        if (count > suspectedForClassification.length) {
            throw new Error(
                `Cannot place ${count} ${classification} roles when only ${suspectedForClassification.length} are suspected.`
            );
        }

        return shuffle(suspectedForClassification).slice(0, count);
    });

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
        assignApparentRole(character, inPlay, suspectedRoleIds, characters);
    }

    const addresses = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    characters.forEach((character, index) => {
        character.address = addresses[index];
    });

    const romanticRelationship =
        createRomanticRelationship(characters);

    const board = buildBoard(characters);

    return {
        board,
        suspectedRoleIds,
        romanticRelationship,
    };
}

export function generateTestBoard(): Board {
    // const rolesInPlay: RoleId[] = [
    //     "reporter",
    //     "therapist",
    //     "priest",
    //     "mathematician",
    //     "drunkard",
    //     "copycat",
    //     "conman",
    //     "scoundrel",
    // ];
    //
    // const characters: Character[] = rolesInPlay.map(
    //     (roleId, index) => ({
    //         id: index + 1,
    //         address: 0,
    //         actualRole: roleId,
    //         apparentRole: roleId,
    //         announcementRole: roleId,
    //         alignment: getDefaultAlignment(roleId),
    //         lying: roles[roleId].generation?.mustLie ?? false,
    //         tainted: false,
    //         revealed: false,
    //         alive: true,
    //         arrested: false,
    //     })
    // );
    //
    // const inPlay = rolesInPlay;
    //
    // for (const character of characters) {
    //     let forcedApparentRole: RoleId | undefined;
    //
    //     if (character.actualRole === "copycat") {
    //         forcedApparentRole = "reporter";
    //     } else if (character.actualRole === "drunkard") {
    //         forcedApparentRole = "mailman";
    //     }
    //
    //     assignApparentRole(
    //         character,
    //         inPlay,
    //         characters,
    //         forcedApparentRole
    //     );
    // }
    //
    // console.table(
    //     characters.map((character) => ({
    //         id: character.id,
    //         actual: character.actualRole,
    //         apparent: character.apparentRole,
    //         announcement: character.announcementRole,
    //         lying: character.lying,
    //         revealed: character.revealed,
    //     }))
    // );
    //
    // const addresses = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    //
    // characters.forEach((character, index) => {
    //     character.address = addresses[index];
    // });
    //
    // const board = createEmptyBoard();
    //
    // for (const character of characters) {
    //     board[character.address - 1] = character;
    // }
    //
    // return board;

    return createEmptyBoard();
}