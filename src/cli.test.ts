import * as t from "assert";
import { parseArgs } from "./cli";

describe("cli", () => {
  it("should parse help", () => {
    let parsed = parseArgs(["--help"]);
    t.equal(parsed.help, true);

    parsed = parseArgs(["-h"]);
    t.equal(parsed.help, true);
  });

  it("should parse version", () => {
    let parsed = parseArgs(["--version"]);
    t.equal(parsed.version, true);

    parsed = parseArgs(["-v"]);
    t.equal(parsed.version, true);
  });

  it("should throw on missing token", () => {
    t.throws(() => parseArgs(["--token"]));
    t.throws(() => parseArgs(["-t"]));
  });
});
