import type {Board as BoardType, RoleId} from "@/src/types";
import { roles } from "@/src/roles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandcuffs } from "@fortawesome/free-solid-svg-icons";

type Props = {
    board: BoardType;
    announcements: Record<number, string>;
    selectedAddress: number | null;
    onInvestigate: (address: number) => void;
    onArrest: (address: number) => void;
    revealedRoles: Record<number, RoleId>;
    arrestedAddresses: Record<number, boolean>;
};

export default function Board({
                                  board,
                                  announcements,
                                  selectedAddress,
                                  onInvestigate,
    onArrest,
    revealedRoles,
    arrestedAddresses
                              }: Props) {
    return (
        <div className="grid grid-cols-3 gap-2">
            {board.map((character, index) => {
                const address = index + 1;
                const selected = selectedAddress === address;

                if (!character) {
                    return (
                        <div
                            key={address}
                            className="aspect-square w-full min-h-0 rounded-lg border-2 border-dotted border-gray-300 flex items-start justify-start p-3"
                        >
                        </div>
                    );
                }

                const revealedRoleId = revealedRoles[address];
                const role = roles[revealedRoleId ?? character.apparentRole];
                const announcement = announcements[address];

                return (
                    <button
                        key={address}
                        onClick={() => onInvestigate(address)}
                        onContextMenu={event => {
                            event.preventDefault();
                            onArrest(address);
                        }}
                        aria-pressed={selected}
                        className={`
    aspect-square w-full min-h-0 rounded-lg border p-4 overflow-hidden
    flex flex-col items-center justify-start gap-2
    text-center
    hover:bg-gray-100
    ${selected
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-300"
                        }
`}
                    >
                        <span className="text-sm text-gray-500">
                            {address}
                        </span>

                        <span className={`role-name role-name--${role.classification}`}>
                                                        {arrestedAddresses[address] && (
                                                            <FontAwesomeIcon
                                                                icon={faHandcuffs}
                                                                className="mr-2 text-gray-500"
                                                            />
                                                        )}
    {role.name}

</span>

                        {announcement && (
                            <div className="mt-1 w-full pt-2 text-sm">
                                {announcement}
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}