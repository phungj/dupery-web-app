import type { GameContext, Character } from "../types";

const deceptiveAnnouncements = [
    "I am the prest.",
    "I am the monk.",
    "I don't feel so good...",
    "Am I a good priest?",
    "Am I a holy priest?",
    "Have you come to pray?",
    "I was the priest.",
    "I'll be the priest.",
];

export function getPriestInformation(
    _context: GameContext,
    _character: Character
): string {
    return "I am the Priest.";
}

export function getPriestDeceptiveInformation(
    _context: GameContext,
    _character: Character
): string {
    const index = Math.floor(Math.random() * deceptiveAnnouncements.length);
    return deceptiveAnnouncements[index];
}