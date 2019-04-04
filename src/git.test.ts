import * as t from "assert";
import { parseCommit } from "./git";

describe("git", () => {
  describe("parseCommit", () => {
    it("should parse git commit log", () => {
      const raw = `b166426ce3ab6f62260532542af447b9975ee1aa 1553973965 pr fixes
      `;
      t.deepEqual(parseCommit(raw), {
        number: null,
        message: "pr fixes",
        time: 1553973965,
        hash: "b166426ce3ab6f62260532542af447b9975ee1aa"
      });
    });

    it("should parse mentioned GitHub number", () => {
      const raw = `abcde 1321 Chore/dx use cb use memo (#1499)`;
      t.deepEqual(parseCommit(raw), {
        number: 1499,
        message: "Chore/dx use cb use memo (#1499)",
        time: "1321",
        hash: "abcde"
      });
    });
  });
});
