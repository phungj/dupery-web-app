
import { glossary } from "./glossary";
import type { RichText, TermId } from "../types";

export function parseRichText(input: string): RichText {
    const parts: RichText = [];

    // Build alias lookup and regex alternatives.
    const aliases = Object.entries(glossary)
        .flatMap(([id, term]) =>
            term.aliases.map(alias => ({
                id: id as TermId,
                alias,
            }))
        )
        .sort((a, b) => b.alias.length - a.alias.length);

    const termLookup = new Map(
        aliases.map(({ id, alias }) => [alias.toLowerCase(), id])
    );

    // Escape regex special characters in aliases.
    const escapedAliases = aliases.map(({ alias }) =>
        alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );

    const pattern = new RegExp(
        String.raw`\*([^*]+)\*|\b(${escapedAliases.join("|")})\b`,
        "gi"
    );

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(input)) !== null) {
        // Preserve text preceding the match.
        if (match.index > lastIndex) {
            parts.push({
                type: "text",
                value: input.slice(lastIndex, match.index),
            });
        }

        const value = match[1] ?? match[2];
        const termId = termLookup.get(value.toLowerCase());

        if (termId) {
            parts.push({
                type: "term",
                id: termId,
                label: value,
            });
        } else {
            parts.push({
                type: "bold",
                value,
            });
        }

        lastIndex = pattern.lastIndex;
    }

    // Preserve remaining text.
    if (lastIndex < input.length) {
        parts.push({
            type: "text",
            value: input.slice(lastIndex),
        });
    }

    return parts;
}
