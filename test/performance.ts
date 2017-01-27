import {Program} from "../src/runtime/dsl";
import {verify, createChanges, time} from "./util";
import * as test from "tape";
import * as index from "../src/runtime/indexes";

test("test single block performance with 10000 transactions", (assert) => {

  // -----------------------------------------------------
  // program
  // -----------------------------------------------------

  let prog = new Program("test");
  prog.block("simple block", (find:any, record:any, lib:any) => {
    let person = find("person");
    let text = `name: ${person.name}`;
    return [
      record("html/div", {person, text})
    ]
  });

  // -----------------------------------------------------
  // verification
  // -----------------------------------------------------

  let foos = [];
  for(let ix = 0; ix < 10; ix++) {
    prog.index = new index.BitIndex();
  let size = 10000;
  let changes = [];
  for(let i = 0; i < size; i++) {
    changes.push(createChanges(i, [[i - 1, "name", i - 1], [i, "tag", "person"]]))
  }

  let start = time();
  for(let change of changes) {
    prog.input(change);
  }
  let end = time(start);
  assert.test("updates finished in " + end, (assert) => {
    assert.true(end < 800, "Took too long");
    assert.end();
  })
  foos.push(changes);
  }

  console.log(foos.length);
  assert.pass();
  assert.end();
});


