import firebase from "firebase";
import "firebase/database";
import { firebaseConfig } from "../config/database";
import { TaskCalendar } from "./TaskService";
import { Task } from "../model/Task";

firebase.initializeApp(firebaseConfig);

const taskService = new TaskCalendar.TaskService("Task");
afterAll(async () => {
  await firebase.database().ref(taskService.COLLECTION).remove();
});
it("create a task for the calendar", async () => {
  const task: Partial<Task> = {
    createdDate: new Date().toString(),
    description: "read book",
    status: "DONE",
    tag: "LOW",
  };
  const key = await taskService.create(task);
  expect(key).not.toBeNull();
  expect(key).toEqual(taskService.tasksKey.find((el) => el === key));
});

it("get a task for the calendar", async () => {
  const task: Partial<Task> = {
    createdDate: new Date().toString(),
    description: "read book",
    status: "DONE",
    tag: "HIGH",
  };
  const key = await taskService.create(task);
  const result: Task = await taskService.get(key);
  expect(result).not.toBeNull();
  expect(result.tag).toEqual("HIGH");
});

it("update a task for the calendar", async () => {
  const taskData: Partial<Task> = {
    createdDate: new Date().toString(),
    description: "read book",
    status: "DONE",
    tag: "HIGH",
  };
  const taskKey = await taskService.create(taskData);
  const createdTask = { ...taskData, key: taskKey } as Task;
  await taskService.update(createdTask, { status: "PROCESS" });

  const result = await taskService.get(taskKey);
  expect(result).not.toBeNull();
  expect(result.status).toBe("PROCESS");
});

it("Must filter tasks by data", async () => {
  const date = new Date();
  const task: Partial<Task> = {
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
  const task: Partial<Task> = {
    createdDate: new Date().toString(),
    description: "read book",
    status: "PROCESS",
    tag: "LOW",
  };
  await taskService.create(task);
  const result: Task[] = await taskService.filterByDescription("read book");
  expect(result[0].description).toEqual("read book");
});

it("Must filter tasks by status", async () => {
  const task: Partial<Task> = {
    createdDate: new Date().toString(),
    description: "read book",
    status: "PROCESS",
    tag: "LOW",
  };
  await taskService.create(task);
  const result: Task[] = await taskService.filterByStatus("PROCESS");
  expect(result[0].status).toEqual("PROCESS");
});

it("Must filter tasks by tag", async () => {
  const task: Partial<Task> = {
    createdDate: new Date().toString(),
    description: "read book",
    status: "PROCESS",
    tag: "LOW",
  };
  await taskService.create(task);
  const result: Task[] = await taskService.filterByTag("LOW");
  expect(result[0].tag).toEqual("LOW");
});

it("delete a task for the calendar", async () => {
  const task: Partial<Task> = {
    createdDate: new Date().toString(),
    description: "read book",
    status: "DONE",
    tag: "HIGH",
  };

  const key = await taskService.create(task);
  expect(key).not.toBe(null);
  await taskService.delete(key);
  const result: Task = await taskService.get(key);
  expect(result).toEqual(null);
});
