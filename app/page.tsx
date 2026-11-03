
"use client";

import { useState } from "react";

import type {Board as BoardType, RoleId} from "@/src/types";
import { createTestScenario } from "@/test/testScenario";
import { investigate } from "@/src/roles/investigate";
import Board from "@/components/Board";
import SuspectedRoles from "@/components/SuspectedRoles";
import {arrest} from "@/src/roles/arrest";

export default function Home() {
  const [board] = useState<BoardType>(() => createTestScenario());

  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [announcements, setAnnouncements] = useState<Record<number, string>>({});

  const [revealedRoles, setRevealedRoles] = useState<Record<number, RoleId>>({});
  const [arrestedAddresses, setArrestedAddresses] = useState<Record<number, boolean>>({});
  function handleInvestigate(address: number) {
    const result = investigate(board, address);

    if (result !== null) {
      setSelectedAddress(address);

      setAnnouncements(previous => ({
        ...previous,
        [address]: result,
      }));
    }
  }

  return (
      <main className="container mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-3xl font-bold">Investigation</h1>

        <div className="grid grid-cols-[minmax(0,600px)_minmax(0,1fr)] gap-8 items-start">
          {/* Board */}
          <section className="w-full">
            <h2 className="mb-3 text-xl font-semibold">
              Board
            </h2>

            <Board
                board={board}
                announcements={announcements}
                selectedAddress={selectedAddress}
                onInvestigate={handleInvestigate}
                onArrest={handleArrest}
                revealedRoles={revealedRoles}
                arrestedAddresses={arrestedAddresses}
            />
          </section>

          {/* Suspected Roles */}
          <section className="min-w-0">
            <SuspectedRoles />
          </section>
        </div>
      </main>
  );

  function handleArrest(address: number) {
    const result = arrest(board, address);

    if (result.type !== "resolved") return;

    setArrestedAddresses(previous => ({
      ...previous,
      [address]: true,
    }));

    if (result.revealRole) {
      setRevealedRoles(previous => ({
        ...previous,
        [address]: result.character.actualRole,
      }));
    }
  }
}

