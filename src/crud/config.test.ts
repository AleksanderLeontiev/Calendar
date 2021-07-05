import firebase from "firebase";
import { FireBaseCrud } from "./config";
import { Task } from "./types";

const taskCalendar = new FireBaseCrud.CrudCalendar("TestTasks");

afterAll(async () => {
  await firebase.database().ref(taskCalendar.posting).remove();
});
describe("firebase crud functions is work", () => {
  const taskOne: Task = {
    date: new Date(2021, 6, 28).toString(),
    text: "read book",
    status: "wait",
    tag: "low",
  };

  const taskTwo: Task = {
    date: new Date(2021, 7, 2).toString(),
    text: "watch tv",
    status: "process",
    tag: "middle",
  };
  it("Must create task", async () => {
    const result = await taskCalendar.create(taskOne);
    expect(result).toEqual([taskOne]);
  });

  it("Must read task", async () => {
    await taskCalendar.create(taskOne);
    const result = await taskCalendar.read(taskCalendar.tasksID[0]);

    expect(result).toEqual(taskOne);
  });

  it("Must update task", async () => {
    await taskCalendar.create(taskOne);
    await taskCalendar.update(taskCalendar.tasksID[0], { status: "done" });

    const resultTask = await taskCalendar.read(taskCalendar.tasksID[0]);

    expect(resultTask.status).toBe("done");
  });

  it("Must delete task", async () => {
    await taskCalendar.delete(taskCalendar.tasksID[0] as string);
    expect(taskCalendar.tasksID).not.toBeNull();
  });

  it("Must filter tasks by data", async () => {
    await taskCalendar.create(taskOne);
    const result = await taskCalendar.filterDate(new Date(2021, 5, 11));

    expect(result[0]).toEqual(taskOne[0]);
  });

  it("Must filter tasks by text", async () => {
    await taskCalendar.create(taskOne);
    const result = await taskCalendar.filterText("js");

    expect(result[0]).toEqual(taskOne[0]);
  });

  it("Must filter tasks by status", async () => {
    await taskCalendar.create(taskTwo);
    const result = await taskCalendar.filterStatus("process");
    expect(result[1]).toEqual(taskTwo[1]);
  });

  it("Must filter tasks by tag", async () => {
    await taskCalendar.create(taskTwo);
    const result = await taskCalendar.filterTag("middle");
    expect(result[0]).toEqual(taskTwo);
  });
});
