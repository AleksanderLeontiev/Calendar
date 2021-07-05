import { LocalStorage } from "./interfaceCalenderAPI";
import { Task } from "./types";

const crudCalendar = new LocalStorage.TaskCalendar();

describe("methods Crud", () => {
  const taskOne: Task = {
    date: new Date(2021, 6, 1).toString(),
    text: "read book",
    status: "wait",
    tag: "low",
  };

  it("check CrudCalendar is a class", () => {
    expect(LocalStorage.TaskCalendar).toBeInstanceOf(Function);
  });
  it("create copy of crudCalendar", () => {
    expect(crudCalendar.create).toBeInstanceOf(Function);
  });
  it("localStorage have CrudCalendar", async () => {
    expect(localStorage.getItem("taskCalendar")).toEqual(JSON.stringify([]));
  });
  it("task calendar must contain task with ID", async () => {
    await crudCalendar.create(taskOne);
    const storage = JSON.parse(localStorage.getItem("taskCalendar") as string);

    let idIsDuplicated = false;
    storage
      .map((el: Task) => el.id)
      .sort()
      .forEach((el: Task["id"], index: number) => {
        idIsDuplicated = el === storage[index + 1] ? true : idIsDuplicated;
      });

    expect(idIsDuplicated).toBe(false);
  });
  it("return task", async () => {
    const result = await crudCalendar.read(crudCalendar.tasksID[0]);

    expect(result).toEqual(
      JSON.parse(localStorage.getItem("taskCalendar") as string)[0]
    );
  });

  it("update task", async () => {
    await crudCalendar.update(crudCalendar.tasksID[0], { tag: "low" });
    const resultTask = await crudCalendar.read(crudCalendar.tasksID[0]);

    expect(resultTask.tag).toBe("low");
  });

  it("delete task", async () => {
    const IDdelete = crudCalendar.tasksID;
    expect(JSON.parse(localStorage.getItem("taskCalendar") as string)).not.toBe(
      []
    );
    // eslint-disable-next-line no-restricted-syntax
    for (const id of IDdelete) {
      // eslint-disable-next-line no-await-in-loop
      await crudCalendar.delete(id);
    }
    expect(localStorage.getItem("taskCalendar")).toEqual(JSON.stringify([]));
    expect(crudCalendar.tasksID).toEqual([]);
  });
});

describe("filters task", () => {
  const taskOne1: Task = {
    date: new Date(2021, 6, 1).toString(),
    text: "read book",
    status: "wait",
    tag: "low",
  };
  it("filter by date", async () => {
    const result = await crudCalendar.filterDate(new Date(2021, 6, 1));
    expect(result[0]).toEqual(
      JSON.parse(localStorage.getItem("taskCalendar") as string)[0]
    );
  });

  it("Must filter tasks by description", async () => {
    await crudCalendar.create(taskOne1);
    const result = await crudCalendar.filterText("read");
    expect(result[0]).toEqual(
      JSON.parse(localStorage.getItem("taskCalendar") as string)[1]
    );
  });

  it("Must filter tasks by status", async () => {
    await crudCalendar.create(taskOne1);
    const result = await crudCalendar.filterStatus("wait");
    expect(result[0]).toEqual(
      JSON.parse(localStorage.getItem("taskCalendar") as string)[0]
    );
  });

  it("Must filter tasks by tag", async () => {
    await crudCalendar.create(taskOne1);
    const result = await crudCalendar.filterTag("low");
    expect(result[0]).toEqual(
      JSON.parse(localStorage.getItem("taskCalendar") as string)[0]
    );
  });
});
