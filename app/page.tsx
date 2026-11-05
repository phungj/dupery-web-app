"use client";

import { useEffect, useState } from "react";

import type {Board as BoardType, GameContext, RoleId} from "@/src/types";
import {generateBoard, generateTestBoard} from "@/src/generateBoard";
import { investigate } from "@/src/roles/investigate";
import Board from "@/components/Board";
import SuspectedRoles from "@/components/SuspectedRoles";
import { arrest } from "@/src/roles/arrest";
import { roles } from "@/src/roles";

type GameStatus = "playing" | "won" | "lost";

type ClassificationCounts = {
  innocents: number;
  meddlers: number;
  underlings: number;
  traitors: number;
};

function getClassificationCounts(board: BoardType): ClassificationCounts {
  const counts: ClassificationCounts = {
    innocents: 0,
    meddlers: 0,
    underlings: 0,
    traitors: 0,
  };

  for (const character of board) {
    if (!character) continue;

    const classification = roles[character.actualRole].classification;

    switch (classification) {
      case "innocent":
        counts.innocents++;
        break;
      case "meddler":
        counts.meddlers++;
        break;
      case "underling":
        counts.underlings++;
        break;
    }
  }

  // Traitor classification has not been implemented yet.
  return counts;
}

export default function Home() {
  const [board, setBoard] = useState<BoardType | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [announcements, setAnnouncements] = useState<Record<number, string>>({});
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [classificationCounts, setClassificationCounts] =
      useState<ClassificationCounts | null>(null);
  const [suspectedRoleIds, setSuspectedRoleIds] = useState<RoleId[]>([]);

  useEffect(() => {
    startNewGame()
  }, []);

  if (!board) {
    return (
        <main className="container mx-auto max-w-6xl p-6">
          Generating case...
        </main>
    );
  }

  const currentBoard = board;

  const context: GameContext = {
    board,
    roles,
  };

  function startNewGame() {
    const newBoard = generateBoard();

    setBoard(newBoard.board);
    setSuspectedRoleIds(newBoard.suspectedRoleIds);
    setClassificationCounts(getClassificationCounts(newBoard.board));
    setSelectedAddress(null);
    setAnnouncements({});
    setGameStatus("playing");
  }

  function handleRevealAll() {
    const newAnnouncements: Record<number, string> = {};

    for (const character of currentBoard) {
      if (!character) continue;

      const address = character.address;

      // Preserve the original announcement if already investigated.
      const regularAnnouncement = Object.hasOwn(announcements, address)
          ? announcements[address]
          : investigate(context, address) ?? "";

      // Add a line identifying the role this character pretended to be.
      const pretendedLine =
          character.apparentRole !== character.actualRole
              ? `I pretended to be the ${roles[character.apparentRole].name}.\n`
              : "";

      // Avoid duplicating the line if Reveal All is pressed again.
      const announcement = pretendedLine &&
      !regularAnnouncement.startsWith(pretendedLine)
          ? `${pretendedLine}\n${regularAnnouncement}`
          : regularAnnouncement;

      if (announcement) {
        newAnnouncements[address] = announcement;
      }
    }

    setAnnouncements(previous => ({
      ...previous,
      ...newAnnouncements,
    }));

    setBoard(previous =>
        previous?.map(character =>
            character
                ? { ...character, revealed: true }
                : null
        ) as BoardType
    );
  }

  function handleInvestigate(address: number) {
    if (gameStatus !== "playing") return;

    // Preserve the original announcement if already investigated.
    if (Object.hasOwn(announcements, address)) {
      setSelectedAddress(address);
      return;
    }

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

    const allEvilArrested = result.board.every(
        (character) =>
            character === null ||
            character.alignment !== "evil" ||
            character.arrested
    );

    if (allEvilArrested) {
      setGameStatus("won");
    }
  }

  return (
      <main className="container mx-auto max-w-6xl p-6">
        <h1 className="mb-6 text-3xl font-bold text-center">
          Dupery
        </h1>

        {gameStatus !== "playing" && (
            <div className="mx-auto mb-6 max-w-xl rounded-lg border p-4">
              <h2 className="text-xl font-bold">
                {gameStatus === "won" ? "Case solved!" : "Case failed"}
              </h2>

              <p className="mb-4">
                {gameStatus === "won"
                    ? "You arrested all the evil characters."
                    : "You arrested a good character."}
              </p>

              <div className="flex gap-3">
                <button
                    onClick={handleRevealAll}
                    className="rounded border px-4 py-2 hover:bg-gray-100"
                >
                  Reveal All Characters
                </button>

                <button
                    onClick={startNewGame}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  New Game
                </button>
              </div>
            </div>
        )}

        <div className="grid grid-cols-[260px_700px_minmax(0,260px)] items-start justify-center gap-6 -translate-x-27">
          <section className="w-full">
            <h2 className="mb-3 text-xl font-semibold text-center">
              Classifications
            </h2>

            <div className="rounded-lg border p-5">
              {classificationCounts && (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                <span className="glossary-term--innocent">
                    Innocents:
                </span>
                      <span className="font-semibold">
                    {classificationCounts.innocents}
                </span>
                    </div>

                    <div className="flex justify-between">
                <span className="glossary-term--meddler">
                    Meddlers:
                </span>
                      <span className="font-semibold">
                    {classificationCounts.meddlers}
                </span>
                    </div>

                    <div className="flex justify-between">
                <span className="glossary-term--underling">
                    Underlings:
                </span>
                      <span className="font-semibold">
                    {classificationCounts.underlings}
                </span>
                    </div>

                    <div className="flex justify-between">
                <span className="glossary-term--traitor">
                    Traitors:
                </span>
                      <span className="font-semibold">
                    {classificationCounts.traitors}
                </span>
                    </div>
                  </div>
              )}
            </div>

            <div className="mt-4 rounded-lg border p-5">
              <h3 className="mb-3 text-lg font-semibold text-center">
                Instructions
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between gap-3">
                  <span>Goal:</span>
                  <span className="font-semibold text-right">
                  Arrest all evil
                </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span>L-Click:</span>
                  <span className="font-semibold text-right">
                  Investigate
                </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span>R-Click:</span>
                  <span className="font-semibold text-right">
                  Arrest
                </span>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full">
            <h2 className="mb-3 text-xl font-semibold text-center">Board</h2>

            <Board
                board={board}
                announcements={announcements}
                selectedAddress={selectedAddress}
                onInvestigate={handleInvestigate}
                onArrest={handleArrest}
            />
          </section>

          <section className="min-w-0">
            <SuspectedRoles suspectedRoleIds={suspectedRoleIds} />
          </section>
        </div>
      </main>
  );
}