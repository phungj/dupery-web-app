import {
    createEmptyBoard,
    getCharacterAt, getEvilCharacters,
} from "@/src/board";

function assert(condition: boolean, message: string) {
    if (!condition) {
        throw new Error(`Test failed: ${message}`);
    }
}

const board = createEmptyBoard();

// Test empty board
assert(board.length === 9, "board should have nine cells");
assert(board.every(cell => cell === null), "all cells should be empty");

// Test character lookup
const character = {
    id: 1,
    address: 5,
    actualRole: "reporter" as const,
    apparentRole: "reporter" as const,
    alignment: "good" as const,
    lying: false,
    tainted: false,
};

board[4] = character;

assert(
    getCharacterAt(board, 5) === character,
    "should retrieve character at address 5"
);

// Test invalid addresses
assert(getCharacterAt(board, 0) === null, "address 0 should return null");
assert(getCharacterAt(board, 10) === null, "address 10 should return null");

const evilCharacter = {
    id: 2,
    address: 3,
    actualRole: "poisoner" as const,
    apparentRole: "reporter" as const,
    alignment: "evil" as const,
    lying: false,
    tainted: false,
};

board[2] = evilCharacter;

assert(
    getEvilCharacters(board).length === 1,
    "should find evil characters"
);

console.log("All board tests passed.");
