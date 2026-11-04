"use client";

import { useEffect, useState } from "react";

import type { Board as BoardType, GameContext } from "@/src/types";
import { generateBoard } from "@/src/generateBoard";
import { investigate } from "@/src/roles/investigate";
import Board from "@/components/Board";
import SuspectedRoles from "@/components/SuspectedRoles";
import { arrest } from "@/src/roles/arrest";
import { roles } from "@/src/roles";

type GameStatus = "playing" | "won" | "lost";

export default function Home() {
  const [board, setBoard] = useState<BoardType | null>(null);

  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [announcements, setAnnouncements] = useState<Record<number, string>>({});
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");

  useEffect(() => {
    setBoard(generateBoard());
  }, []);

  if (!board) {
    return (
        <main className="container mx-auto max-w-4xl p-6">
          Generating case...
        </main>
    );
  }

  const context: GameContext = {
    board,
    roles,
  };

  function handleInvestigate(address: number) {
    if (gameStatus !== "playing") return;

    const result = investigate(context, address);

    if (result !== null) {
      setSelectedAddress(address);

      setAnnouncements((previous) => ({
        ...previous,
        [address]: result,
      }));
    }
  }

  function handleArrest(address: number) {
    if (gameStatus !== "playing") return;

    const result = arrest(context, address);

    if (result.type !== "resolved") return;

    setBoard(result.board);

    if (!result.success) {
      setGameStatus("lost");
      return;
    }

    const allEvilArrested = result.board
        .filter(
            (character) =>
                character !== null && character.alignment === "evil"
        )
        .every((character) => character.arrested);

    if (allEvilArrested) {
      setGameStatus("won");
    }
  }

  return (
      <main className="container mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-3xl font-bold">Investigation</h1>

        {gameStatus !== "playing" && (
            <div className="mb-6 rounded border p-4">
              <h2 className="text-xl font-bold">
                {gameStatus === "won" ? "Case solved!" : "Case failed"}
              </h2>
              <p>
                {gameStatus === "won"
                    ? "You arrested all the evil characters without arresting an innocent."
                    : "You arrested an innocent. The investigation is over."}
              </p>
            </div>
        )}

        <div className="grid grid-cols-[minmax(0,600px)_minmax(0,1fr)] items-start gap-8">
          <section className="w-full">
            <h2 className="mb-3 text-xl font-semibold">Board</h2>

            <Board
                board={board}
                announcements={announcements}
                selectedAddress={selectedAddress}
                onInvestigate={handleInvestigate}
                onArrest={handleArrest}
            />
          </section>

          <section className="min-w-0">
            <SuspectedRoles />
          </section>
        </div>
      </main>
  );
}