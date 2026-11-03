import type { RichText as RichTextContent } from "@/src/types";
import { glossary } from "@/src/roles/glossary";
import {parseRichText} from "@/src/roles/richText";
import Tooltip from "@/components/Tooltip";

type Props = {
    content: RichTextContent;
    interactive?: boolean
};

export default function RichText({ content, interactive = true }: Props) {
    return (
        <>
            {content.map((part, index) => {
                switch (part.type) {
                    case "text":
                        return <span key={index}>{part.value}</span>;

                    case "bold":
                        return <strong key={index}>{part.value}</strong>;

                    case "term": {
                        const term = glossary[part.id];

                        const label = (
                            <span
                                className={`glossary-term glossary-term--${term.style ?? "default"}`}
                            >
            {part.label ?? term.name}
        </span>
                        );

                        if (!interactive) {
                            return <span key={index}>{label}</span>;
                        }

                        return (
                            <Tooltip
                                key={index}
                                content={
                                    <RichText
                                        content={parseRichText(term.tooltip)}
                                        interactive={false}
                                    />
                                }
                            >
                                {label}
                            </Tooltip>
                        );
                    }
                }
            })}
        </>
    );
}