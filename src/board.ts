
import type { Board, Character } from "./types";

export function createEmptyBoard(): Board {
    return [
        null, null, null,
        null, null, null,
        null, null, null,
    ];
}

export function getCharacterAt(
    board: Board,
    address: number
): Character | null {
    if (address < 1 || address > 9) return null;
    return board[address - 1];
}

export function getEvilCharacters(board: Board): Character[] {
    return board.filter(
        (character): character is Character =>
            character !== null && character.alignment === "evil"
    );
}

function getNeighboringCharacters(
    board: Board,
    character: Character,
    includeDiagonals: boolean
): Character[] {
    const row = Math.floor((character.address - 1) / 3);
    const col = (character.address - 1) % 3;

    return board.filter((other): other is Character => {
        if (other === null || other.id === character.id) {
            return false;
        }

        const otherRow = Math.floor((other.address - 1) / 3);
        const otherCol = (other.address - 1) % 3;

        const rowDiff = Math.abs(row - otherRow);
        const colDiff = Math.abs(col - otherCol);

        if (includeDiagonals) {
            return rowDiff <= 1 && colDiff <= 1;
        }

        return rowDiff + colDiff === 1;
    });
}

export function getAdjacentCharacters(
    board: Board,
    character: Character
): Character[] {
    return getNeighboringCharacters(board, character, false);
}

export function getSurroundingCharacters(
    board: Board,
    character: Character
): Character[] {
    return getNeighboringCharacters(board, character, true);
}

export function getDistance(addressA: number, addressB: number): number {
    const rowA = Math.floor((addressA - 1) / 3);
    const colA = (addressA - 1) % 3;

    const rowB = Math.floor((addressB - 1) / 3);
    const colB = (addressB - 1) % 3;

    return Math.abs(rowA - rowB) + Math.abs(colA - colB);
}