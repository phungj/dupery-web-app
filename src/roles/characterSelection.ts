import type {
    Character,
    Classification,
    GameContext,
} from "../types";

export function getCharactersByClassification(
    context: GameContext,
    classification: Classification
): Character[] {
    return context.board.filter(
        (character): character is Character =>
            character !== null &&
            context.roles[character.actualRole].classification === classification
    );
}

export function chooseRandomCharacter(
    characters: Character[]
): Character | null {
    if (characters.length === 0) return null;

    return characters[Math.floor(Math.random() * characters.length)];
}