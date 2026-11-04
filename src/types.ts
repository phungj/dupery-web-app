export type RoleId =
    | "therapist"
    | "mathematician"
    | "reporter"
    | "priest"
    | "mailman"
    | "copycat"
    | "drunkard"
    | "wannabe"
    | "mobster"
    | "scoundrel"
    | "conman";

export type Alignment = "good" | "evil";

export type Classification =
    | "innocent"
    | "meddler"
    | "underling";

export type TermId =
    | "investigate"
    | "announce"
    | "steps"
    | "evil"
    | "role"
    | "adjacent"
    | "adjacent neighbors"
    | "lie"
    | "taint"
    | "address"
    | "in play"
    | "board"
    | "location"
    | "innocent"
    | "good"
    | "underling"
    | "pretend"
    | "reveal"
    | "arrest"
    | "self-confirm"
    | "not in play"
    | "alive"
    | "dead"
    | "kill"
    | "unarrested";

export type RichText = Array<
    | { type: "text"; value: string }
    | { type: "bold"; value: string }
    | { type: "term"; id: TermId; label?: string }
>;

export type RoleDescription = {
    short: RichText;
    full: RichText;
};

export type Character = {
    id: number;
    address: number;
    actualRole: RoleId;
    apparentRole: RoleId;
    alignment: Alignment;
    lying: boolean;
    tainted: boolean;
    revealed: boolean;
    alive: boolean;
    arrested: boolean;
    apparentRoleState?: ApparentRoleState;
    wannabeData?: WannabeData;
};

export type ApparentRoleState = {
    tainted: boolean;
    revealed: boolean;
};

export type WannabeData = {
    revealedUnderlingId: number;
};

export type Board = [
        Character | null,
        Character | null,
        Character | null,
        Character | null,
        Character | null,
        Character | null,
        Character | null,
        Character | null,
        Character | null
];

export type RoleDefinition = {
    id: RoleId;
    name: string;
    classification: Classification;
    description: RoleDescription;
    getInformation: (
        context: GameContext,
        character: Character
    ) => string;
    getDeceptiveInformation: (
        context: GameContext,
        character: Character
    ) => string;
    generation?: {
        mustPretend?: boolean;
        mustPretendInPlay?: boolean;
        mustPretendNotInPlay?: boolean;
        mustPretendDefaultAlignment?: Alignment;
        mustLie?: boolean;
    };
    selfConfirm?: boolean;

    canBeArrested?: (
        context: GameContext,
        character: Character
    ) => boolean;
    revealOnArrest?: boolean;
};

export type ArrestResult =
    | { type: "empty" }
    | { type: "not-allowed" }
    | {
    type: "resolved";
    success: boolean;
    character: Character;
    board: Board;
    revealRole: boolean;
};

export type GameContext = {
    board: Board;
    roles: Record<RoleId, RoleDefinition>;
};