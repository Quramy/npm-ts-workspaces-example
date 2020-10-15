import assert from "assert";
import { main } from "./main";

async function test() {
  const actual = await main();
  assert(actual != null);
  console.log("ok");
}

test();
