import { createTestScenario } from "./testScenario";
import { investigate } from "@/src/roles/investigate";

const board = createTestScenario();

for (let address = 1; address <= 9; address++) {
    const announcement = investigate(board, address);

    console.log(
        `Address ${address}:`,
        announcement ?? "(empty)"
    );
}