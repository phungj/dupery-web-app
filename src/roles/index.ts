import type {RoleDefinition, RoleId} from "../types";

import { getReporterInformation, getReporterDeceptiveInformation } from "./reporter";
import { getTherapistInformation, getTherapistDeceptiveInformation } from "./therapist";
import {
    getMathematicianInformation,
    getMathematicianDeceptiveInformation,
} from "./mathematician";
import {
    getPriestInformation,
    getPriestDeceptiveInformation,
} from "./priest";
import {parseRichText} from "@/src/roles/richText";

import {
    getMailmanInformation,
    getMailmanDeceptiveInformation,
} from "./mailman";
import {
    getRomanticInformation,
    getRomanticDeceptiveInformation,
} from "./romantic";
import {getEmptyAnnouncement} from "@/src/roles/nonAnnouncingRole";
import {canScoundrelBeArrested} from "@/src/roles/scoundrel";
import {getWeathermanDeceptiveInformation, getWeathermanInformation} from "@/src/roles/weatherman";

const getRoles = () => roles;

export const roles: Record<RoleId, RoleDefinition> = {
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
        getInformation: getEmptyAnnouncement,
        getDeceptiveInformation: getEmptyAnnouncement,
        generation: {
            mustPretend: true,
            mustPretendInPlay: true,
            mustPretendDefaultAlignment: "good",
            mustLie: true,
        },
        revealOnArrest: true,
    },

    weatherman: {
        id: "weatherman",
        name: "Weatherman",
        classification: "innocent",
        description: {
            short: parseRichText(
                "When investigated, I announce three addresses.  One address leads to an Innocent, one leads to a Meddler, and one leads to an Underling or Traitor."
            ),
            full: parseRichText(
                "When investigated, I announce three addresses.  One address leads to an Innocent, one leads to a Meddler, and one leads to an Underling or Traitor.\n\nWhen I am lying or tainted, I announce three addresses, all addresses are either Innocent or Meddler roles."
            ),
        },
        getInformation: getWeathermanInformation,
        getDeceptiveInformation: getWeathermanDeceptiveInformation,
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
        getInformation: getEmptyAnnouncement,
        getDeceptiveInformation: getEmptyAnnouncement,
        generation: {
            mustPretend: true,
            mustPretendInPlay: true,
            mustPretendDefaultAlignment: "good",
            mustLie: false,
        },
        revealOnArrest: false,
    },

    priest: {
        id: "priest",
        name: "Priest",
        classification: "innocent",
        selfConfirm: true,
        description: {
            short: parseRichText(
                "When investigated, I announce \"I am the Priest.\" When I am lying or tainted, I will announce something else."
            ),
            full: parseRichText(
                `When investigated, I announce "I am the Priest." When I am lying or tainted, I will announce something else.

I am considered a self-confirm role. 

When I am lying or tainted, I announce one of the following statements:
"I am the prest."
"I am the monk."
"I don't feel so \\good..."
"Am I a \\good priest?"
"Am I a holy priest?"
"Have you come to pray?"
"I was the priest."
"I'll be the priest."`
            ),
        },
        getInformation: getPriestInformation,
        getDeceptiveInformation: getPriestDeceptiveInformation,
    },

    mailman: {
        id: "mailman",
        name: "Mailman",
        classification: "innocent",
        description: {
            short: parseRichText("When investigated, I announce one in play role and one not in play role, specifying which is which."),
            full: parseRichText("When investigated, I announce one in play role and one not in play role, specifying which is which.\n\nWhen I am lying or tainted, both parts of my announcement will be false.")
        },
        getInformation: getMailmanInformation,
        getDeceptiveInformation: getMailmanDeceptiveInformation,
    },
    copycat: {
        id: "copycat",
        name: "Copycat",
        classification: "meddler",
        description: {
            short: parseRichText(
                "I pretend to be a good in-play role."
            ),
            full: parseRichText(
                "I pretend to be a good in-play role."
            ),
        },
        getInformation: getEmptyAnnouncement,
        getDeceptiveInformation: getEmptyAnnouncement,
        generation: {
            mustPretend: true,
            mustPretendInPlay: true,
            mustPretendDefaultAlignment: "good",
        },
    },

    drunkard: {
        id: "drunkard",
        name: "Drunkard",
        classification: "meddler",
        description: {
            short: parseRichText(
                "I lie and pretend to be a good not in play role."
            ),
            full: parseRichText(
                "I always lie and pretend to be a good not in play role.\n\nWhen I am tainted, I do not change my behavior."
            ),
        },
        getInformation: getEmptyAnnouncement,
        getDeceptiveInformation: getEmptyAnnouncement,
        generation: {
            mustPretend: true,
            mustPretendNotInPlay: true,
            mustPretendDefaultAlignment: "good",
            mustLie: true,
        },
    },

    wannabe: {
        id: "wannabe",
        name: "Wannabe",
        classification: "meddler",
        description: {
            short: parseRichText(
                "I reveal a random Underling role.  I pretend to be a tainted in play revealed Underling."
            ),
            full: parseRichText(
                "I reveal a random Underling role.  I pretend to be a tainted in play revealed Underling.\n\nI may reveal a role that is not pretending.\n\nWhen I am tainted I do not reveal another Underling role."
            ),
        },
        getInformation: getEmptyAnnouncement,
        getDeceptiveInformation: getEmptyAnnouncement,
    },

    scoundrel: {
        id: "scoundrel",
        name: "Scoundrel",
        classification: "underling",
        description: {
            short: parseRichText(
                "I cannot be arrested unless I am the only unarrested and alive evil."
            ),
            full: parseRichText(
                "I cannot be killed or arrested unless I am the only unarrested and alive evil.\n\nAttempting to arrest me still passes time.\n\nI ignore all good roles that appear to be evil. I can always be arrested or killed if I am the only true unarrested and alive evil.\n\nWhen I am tainted, I can die or be arrested even when I am not the last evil role."
            ),
        },
        getInformation: getEmptyAnnouncement,
        getDeceptiveInformation: getEmptyAnnouncement,
        canBeArrested: canScoundrelBeArrested,
    },

    romantic: {
        id: "romantic",
        name: "Romantic",
        classification: "innocent",
        description: {
            short: parseRichText(
                "I pick an adjacent Innocent role to be my lover. When investigated, I announce their address."
            ),
            full: parseRichText(
                "I pick an adjacent Innocent role to be my lover. When investigated, I announce their address.\n\nWhen I am lying or tainted, my lover is an Underling and may or may not be adjacent to me.\n\nWhen the Casanova is in play and I am not lying or tainted, I announce \"My lover ran away with somebody else?!\".\n\nIf I find no valid roles that satisfy these rules, I will announce \"I love myself!\"."
            ),
        },
        getInformation: getRomanticInformation,
        getDeceptiveInformation: getRomanticDeceptiveInformation,
    },

    casanova: {
        id: "casanova",
        name: "Casanova",
        classification: "underling",
        description: {
            short: parseRichText(
                "I am surrounding the Romantic's lover unless the Romantic is lying or tainted.\nI charm the Romantic's lover and run away with them.\nI lie and pretend to be a suspected role."
            ),
            full: parseRichText(
                "I am surrounding the Romantic's lover unless the Romantic is lying or tainted.\nI charm the Romantic's lover and run away with them.\nI lie and pretend to be a suspected role.\n\nWhen I am tainted, I do not charm the Romantic's lover."
            ),
        },
        getInformation: getEmptyAnnouncement,
        getDeceptiveInformation: getEmptyAnnouncement,
        generation: {
            mustPretend: true,
            mustPretendSuspected: true,
            mustPretendDefaultAlignment: "good",
            mustLie: true,
        },
    },
};