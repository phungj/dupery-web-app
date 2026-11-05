
import type { TermId } from "../types";

export type GlossaryTerm = {
    name: string;
    aliases: string[];
    tooltip: string;
    style?: "default" | "evil" | "lying" | "tainted" | "traitor"
        | "innocent" | "good" | "meddler";
};

export const glossary: Record<TermId, GlossaryTerm> = {
    investigate: {
        name: "Investigate",
        aliases: ["investigate", "investigated"],
        tooltip: "Opening a door to see who is behind it.",
    },

    announce: {
        name: "Announce",
        aliases: ["announce", "announced", "announcement"],
        tooltip: "The act of giving information. What a role has announced is displayed below their name when investigated.",
    },

    steps: {
        name: "Steps",
        aliases: ["step", "steps"],
        tooltip: "A step is a movement from one tile to an adjacent tile.",
    },

    evil: {
        name: "Evil",
        aliases: ["evil"],
        tooltip: "Roles that should be arrested! You win when all evil roles are arrested or dead. Underling and Traitor roles are evil.",
        style: "evil",
    },

    role: {
        name: "Role",
        aliases: ["role", "roles"],
        tooltip: "A role is a character that can appear on the board and in the suspect list.",
    },

    adjacent: {
        name: "Adjacent",
        aliases: ["adjacent"],
        tooltip: "Something which is adjacent is directly north, east, south, or west.",
    },

    "adjacent neighbors": {
        name: "Adjacent Neighbors",
        aliases: ["adjacent neighbor", "adjacent neighbors"],
        tooltip: "An adjacent neighbor is a role that is adjacent to another role.  In other words, it is directly north, east, south, or west. ",
    },

    lie: {
        name: "Lie",
        aliases: ["lie", "lies", "lying", "lied"],
        tooltip: "When a role is lying, the information they give will be wrong.  Abilities used will function incorrectly.",
        style: "lying",
    },

    taint: {
        name: "Taint",
        aliases: ["taint", "tainted"],
        tooltip: "When a role is tainted, they are being forced to lie and will give wrong information.",
        style: "tainted",
    },

    address: {
        name: "Address",
        aliases: ["address", "addresses"],
        tooltip: "Each in play role has an address.  This is shown on their door or beside their icon.",
    },
    "in play": {
        name: "In Play",
        aliases: ["in play"],
        tooltip: "A role that is on the board.",
    },
    board: {
        name: "Board",
        aliases: ["board"],
        tooltip: "The board is the grid where all in play roles and locations are.",
    },
    location: {
        name: "Location",
        aliases: ["location", "locations"],
        tooltip: "Locations are found on the board and are used by certain roles.",
    },
    innocent: {
        name: "Innocent",
        aliases: ["innocent"],
        tooltip: "Helpful good roles that tend to give invaluable information to solve the case.",
        style: "innocent",
    },

    good: {
        name: "Good",
        aliases: ["good"],
        tooltip: "Roles that should not be arrested!  Innocent and meddler roles are good unless they have been made evil.",
        style: "good",
    },

    underling: {
        name: "Underling",
        aliases: ["underling", "underlings"],
        tooltip: "The simple evil roles that will often lie and pretend.",
        style: "evil",
    },

    pretend: {
        name: "Pretend",
        aliases: ["pretend", "pretends", "pretending"],
        tooltip: "When a role is pretending to be another role, it appears as that role when investigated and, unless they are lying, will do everything as that role would do."
    },

    reveal: {
        name: "Reveal",
        aliases: ["reveal", "reveals", "revealed", "revealing"],
        tooltip: "When a role is revealed, they stop pretending to be another role and show their true self."
    },

    arrest: {
        name: "Arrest",
        aliases: ["arrest", "arrested"],
        tooltip: "Your main way of stopping evil!  Putting a role behind bars also reveals them."
    },

    "self-confirm": {
        name: "Self-Confirm",
        aliases: ["self-confirming", "self-confirm", "self-confirmed"],
        tooltip: "A role that can prove its own innocence.  Multiple self-confirm roles cannot be in play at once."
    },

    "not in play": {
        name: "Not In Play",
        aliases: ["not in play"],
        tooltip: "A role that is not on the board."
    },

    alive: {
        name: "Alive",
        aliases: ["alive", "living"],
        tooltip: "A role that is not dead."
    },

    dead: {
        name: "Dead",
        aliases: ["dead", "die"],
        tooltip: "A role that has been killed.  Dead roles do not reveal and any information they may have announced is lost."
    },

    kill: {
        name: "Kill",
        aliases: ["kill", "kills", "killed"],
        tooltip: "Makes a role dead.  Dead roles do not reveal and any information they may have announced is lost."
    },

    unarrested: {
        name: "Unarrested",
        aliases: ["unarrested"],
        tooltip: "A role that has not been arrested yet."
    },

    "meddler": {
        name: "Meddler",
        aliases: ["meddler", "meddlers"],
        tooltip: "Unhelpful good roles that tend to muddy the waters and make solving the case trickier.",
        style: "meddler"
    },

    "traitor": {
        name: "Traitor",
        aliases: ["traitor", "traitors"],
        tooltip: "The worst of the worst.  These evil roles will make it much harder to solve the case.",
        style: "traitor"
    },

    surrounding: {
        name: "Surrounding",
        aliases: ["surrounding"],
        tooltip: "Something which is surrounding is anywhere within the 8 tiles around that position."
    }
};
