import firebase from "firebase";
import "firebase/database";
import { firebaseConfig } from "../config/database";
import { TaskService } from "./TaskService";
import { Task } from "../model/Task";

firebase.initializeApp(firebaseConfig);
const taskService = new TaskService();
afterAll(async () => {
  await firebase.database().ref(TaskService.COLLECTION).remove();
});
it("create a task for the calendar", async () => {
  const task: Task = {
    createdDate: new Date().toString(),
    description: "read book",
    status: "DONE",
    tag: "LOW",
  };
  const result = await taskService.create(task);
  expect(result).not.toBeNull();
});
it("get a task for the calendar", async () => {
  const task: Task = {
    createdDate: new Date().toString(),
    description: "read book",
    status: "DONE",
    tag: "HIGH",
  };
  const taskKey = (await taskService.create(task)) as string;
  const result: Task = await taskService.get(taskKey);
  expect(result).not.toBeNull();
  expect(result.tag).toEqual("HIGH");
});

it("update a task for the calendar", async () => {
  const task: Task = {
    createdDate: new Date().toString(),
    description: "read book",
    status: "DONE",
    tag: "HIGH",
  };
  const taskKey = (await taskService.create(task)) as string;
  await taskService.update(taskKey, { status: "PROCESS" });
  const result = await taskService.get(taskKey);
  expect(result).not.toBeNull();
  expect(result.status).toBe("PROCESS");
});

it("Must filter tasks by data", async () => {
  const date = new Date();
  const task: Task = {
    createdDate: date.toString(),
    description: "read book",
    status: "DONE",
    tag: "HIGH",
  };
  await taskService.create(task);
  const result: Task[] = await taskService.filterByDate(date);
  expect(result[0].createdDate).toEqual(date.toString());
});

it("Must filter tasks by text", async () => {
  const task: Task = {
    createdDate: new Date().toString(),
    description: "read book",
    status: "PROCESS",
    tag: "LOW",
  };
  await taskService.create(task);
  const result: Task[] = await taskService.filterText("read book");
  expect(result[0].description).toEqual("read book");
});

it("Must filter tasks by status", async () => {
  const task: Task = {
    createdDate: new Date().toString(),
    description: "read book",
    status: "PROCESS",
    tag: "LOW",
  };
  await taskService.create(task);
  const result: Task[] = await taskService.filterStatus("PROCESS");
  expect(result[0].status).toEqual("PROCESS");
});

it("Must filter tasks by tag", async () => {
  const task: Task = {
    createdDate: new Date().toString(),
    description: "read book",
    status: "PROCESS",
    tag: "LOW",
  };
  await taskService.create(task);
  const result: Task[] = await taskService.filterTag("LOW");
  expect(result[0].tag).toEqual("LOW");
});
it("delete a task for the calendar", async () => {
  const storageFirstElem = await taskService.get(taskService.tasksID[0]);
  expect(storageFirstElem).not.toBe([]);
  await taskService.delete(taskService.tasksID[0]);
  expect(taskService.tasksID).toEqual([]);
});
