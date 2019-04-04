import * as t from "assert";
import { toTime, exec } from "./util";

describe("exec", () => {
  it("should exec shell command", () => {
    t.equal(exec("echo 'foo'"), "foo");
  });

  it("should trim result", () => {
    t.equal(exec("echo '  foo  '"), "foo");
  });
});

describe("toTime", () => {
  it("should convert timestamp to unix time", () => {
    t.equal(toTime("2019-04-03T20:23:08+00:00"), 1554322988000);
  });
});
