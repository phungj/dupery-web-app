
"use client";

import { useState } from "react";
import type { RoleId } from "@/src/types";
import { roles } from "@/src/roles";
import { parseRichText } from "@/src/roles/richText";
import RichText from "@/components/RichText";
import Tooltip from "@/components/Tooltip";

type Classification = "innocent" | "meddler" | "underling";

type Props = {
    suspectedRoleIds: RoleId[];
};

const classifications: Classification[] = [
    "innocent",
    "meddler",
    "underling",
];

const classificationNames: Record<Classification, string> = {
    innocent: "Innocent",
    meddler: "Meddler",
    underling: "Underling",
};

function getDefaultAlignment(classification: Classification): "good" | "evil" {
    return classification === "underling" ? "evil" : "good";
}

export default function SuspectedRoles({
                                           suspectedRoleIds
                                       }: Props) {
    const [selectedRoleId, setSelectedRoleId] = useState<RoleId | null>(null);

    const suspectedRoles = suspectedRoleIds
        .map(id => roles[id])
        .filter(role => role !== undefined);

    const selectedRole = selectedRoleId
        ? suspectedRoles.find(role => role.id === selectedRoleId)
        : null;

    return (
        <div className="grid grid-cols-[14rem_20rem] items-start gap-6">
            {/* Suspect List */}
            <section>
                <h2 className="mb-4 text-xl font-semibold">
                    Suspect List
                </h2>

                <div className="flex flex-col gap-2">
                    {classifications.map(classification => {
                        const classificationRoles = suspectedRoles
                            .filter(role => role.classification === classification);

                        if (classificationRoles.length === 0) return null;

                        return classificationRoles.map(role => (
                            <Tooltip
                                key={role.id}
                                content={
                                    <RichText
                                        content={role.description.short}
                                        interactive={false}
                                    />
                                }
                            >
                                <button
                                    type="button"
                                    onClick={() => setSelectedRoleId(role.id)}
                                    aria-pressed={selectedRoleId === role.id}
                                    className={`
                                        w-full rounded-lg border px-3 py-2
                                        text-left text-sm font-semibold
                                        hover:bg-gray-100
                                        ${selectedRoleId === role.id
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-300"
                                    }
                                        role-name--${classification}
                                    `}
                                >
                                    {role.name}
                                </button>
                            </Tooltip>
                        ));
                    })}
                </div>
            </section>

            {/* Role Details */}
            {selectedRole && (
                <section className="rounded-lg border p-4">
                    <h3 className={`mb-3 text-lg font-semibold role-name--${selectedRole.classification}`}>
                        {selectedRole.name}
                    </h3>

                    <div className="mb-3 text-sm">
                        <RichText
                            content={parseRichText(
                                `${classificationNames[selectedRole.classification]} | ${
                                    getDefaultAlignment(selectedRole.classification) === "good"
                                        ? "Good"
                                        : "Evil"
                                }`
                            )}
                        />
                    </div>

                    <div className="leading-relaxed whitespace-pre-line">
                        <RichText content={selectedRole.description.full} />
                    </div>
                </section>
            )}
        </div>
    );
}
