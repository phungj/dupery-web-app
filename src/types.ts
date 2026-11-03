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
    | "arrest";

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
    getInformation: (board: Board, character: Character) => string;
    getDeceptiveInformation: (board: Board, character: Character) => string;
    generation?: {
        mustPretend?: boolean;
        mustPretendInPlay?: boolean;
        mustPretendNotInPlay?: boolean;
        mustLie?: boolean;
    };

    canBeArrested?: (board: Board, character: Character) => boolean;
    revealOnArrest?: boolean;
};

export type ArrestResult =
    | { type: "empty" }
    | { type: "not-allowed" }
    | {
    type: "resolved";
    success: boolean;
    character: Character;
    revealRole: boolean;
};