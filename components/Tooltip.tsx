import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
    content: ReactNode;
};

export default function Tooltip({ children, content }: Props) {
    return (
        <span className="tooltip-container">
            {children}

            <span className="tooltip-content" role="tooltip">
                {content}
            </span>
        </span>
    );
}