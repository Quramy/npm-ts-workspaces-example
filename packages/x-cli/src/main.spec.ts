import test from "ava";
import { main } from "./main";

test("test", async t => {
  const actual = await main();
  t.true(actual);
});

