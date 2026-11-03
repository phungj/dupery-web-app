import type { Board, Character } from "@/src/types";
import { createEmptyBoard } from "@/src/board";

const characters: Character[] = [
    {
        id: 1,
        address: 1,
        actualRole: "reporter",
        apparentRole: "reporter",
        alignment: "good",
        lying: false,
        tainted: false,
    },
    {
        id: 2,
        address: 3,
        actualRole: "mobster",
        apparentRole: "therapist",
        alignment: "evil",
        lying: true,
        tainted: false,
    },
    {
        id: 3,
        address: 5,
        actualRole: "therapist",
        apparentRole: "therapist",
        alignment: "good",
        lying: false,
        tainted: false,
    },
    {
        id: 4,
        address: 7,
        actualRole: "mathematician",
        apparentRole: "mathematician",
        alignment: "good",
        lying: false,
        tainted: false,
    },
    {
        id: 5,
        address: 9,
        actualRole: "conman",
        apparentRole: "reporter",
        alignment: "evil",
        lying: false,
        tainted: false,
    },
];

export function createTestScenario(): Board {
    const board = createEmptyBoard();

    for (const character of characters) {
        board[character.address - 1] = character;
    }

    return board;
}