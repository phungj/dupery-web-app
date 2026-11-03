import type { RoleDefinition } from "../types";

import { getReporterInformation, getReporterDeceptiveInformation } from "./reporter";
import { getTherapistInformation, getTherapistDeceptiveInformation } from "./therapist";
import {
    getMathematicianInformation,
    getMathematicianDeceptiveInformation,
} from "./mathematician";
import {parseRichText} from "@/src/roles/richText";
import {getPretendingInformation} from "@/src/roles/pretendingRole";

export const roles: Record<string, RoleDefinition> = {
    reporter: {
        id: "reporter",
        name: "Reporter",
        classification: "innocent",
        description: {
            short: parseRichText(
                "When investigated, I announce how many steps I'd need to take to reach the closest evil role."
            ),
            full: parseRichText(
                "When investigated, I announce how many steps I'd need to take to reach the closest evil role.\n\nI cannot report myself.\n\nWhen I am lying or tainted, I announce a random number of steps between 1 and 4 that is incorrect."
            ),
        },
        getInformation: getReporterInformation,
        getDeceptiveInformation: getReporterDeceptiveInformation,
    },

    therapist: {
        id: "therapist",
        name: "Therapist",
        classification: "innocent",
        description: {
            short: parseRichText(
                "When investigated, I announce how many of my adjacent neighbours are evil."
            ),
            full: parseRichText(
                "When investigated, I announce how many of my adjacent neighbours are evil.\n\nWhen I am lying or tainted, I announce a number between 0 and 4 that is incorrect."
            ),
        },
        getInformation: getTherapistInformation,
        getDeceptiveInformation: getTherapistDeceptiveInformation,
    },
    mathematician: {
        id: "mathematician",
        name: "Mathematician",
        classification: "innocent",
        description: {
            short: parseRichText(
                "When investigated, I announce the sum of all evil role addresses."
            ),
            full: parseRichText(
                "When investigated, I announce the sum of all evil role addresses.\n\nWhen I am lying or tainted, I announce a sum that is either slightly higher or slightly lower than the true sum."
            ),
        },
        getInformation: getMathematicianInformation,
        getDeceptiveInformation: getMathematicianDeceptiveInformation,
    },

    mobster: {
        id: "mobster",
        name: "Mobster",
        classification: "underling",
        description: {
            short: parseRichText(
                "I lie and pretend to be an in-play role."
            ),
            full: parseRichText(
                "I lie and pretend to be an in-play role."
            ),
        },
        getInformation: getPretendingInformation,
        getDeceptiveInformation: getPretendingInformation,
        generation: {
            mustPretend: true,
            mustPretendInPlay: true,
            mustLie: true,
        },
        revealOnArrest: true,
    },

    conman: {
        id: "conman",
        name: "Conman",
        classification: "underling",
        description: {
            short: parseRichText(
                "I pretend to be an in-play role. When arrested, I am not revealed."
            ),
            full: parseRichText(
                "I pretend to be an in-play role. When arrested, I am not revealed.\n\nUnlike most other Underling roles, I do not lie."
            ),
        },
        getInformation: getPretendingInformation,
        getDeceptiveInformation: getPretendingInformation,
        generation: {
            mustPretend: true,
            mustPretendInPlay: true,
            mustLie: false,
        },
        revealOnArrest: false,
    },
};