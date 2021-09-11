import firebase from "firebase";
import { Task } from "../model/Task";
import { ITaskCalendar } from "../interFace/interFaceApi";

export namespace TaskCalendar {
  export class TaskService implements ITaskCalendar {
    public tasksKey: string[] = [];

    public COLLECTION = "Tasks";

    constructor(COLLECTION: string) {
      this.COLLECTION = COLLECTION === undefined ? this.COLLECTION : COLLECTION;
    }

    public async create(task: Partial<Task>): Promise<string | null> {
      const ref = await firebase.database().ref(this.COLLECTION).push(task);
      ref.key && this.tasksKey.push(ref.key);
      return ref.key;
    }

    public async get(key: string | null): Promise<Task> {
      return (
        await firebase.database().ref(`${this.COLLECTION}/${key}`).get()
      ).val();
    }

    public async update(task: Task, changes: Partial<Task>): Promise<Task> {
      const newTask = { ...task, ...changes };
      await firebase
        .database()
        .ref(`${this.COLLECTION}/${task.key}`)
        .set(newTask);
      return newTask;
    }

    public async delete(key: string | null): Promise<void> {
      await firebase.database().ref(`${this.COLLECTION}/${key}`).remove();
      this.tasksKey = this.tasksKey.filter((el) => el !== key);
    }

    public async filterByDate(createdDate: Date): Promise<Task[]> {
      return Object.values(
        (
          await firebase
            .database()
            .ref(`${this.COLLECTION}`)
            .orderByChild("createdDate")
            .equalTo(createdDate.toString())
            .once("value")
        ).val()
      );
    }

    public async filterByDescription(
      description: Task["description"]
    ): Promise<Task[]> {
      const storage: Task[] = Object.values(
        (
          await firebase.database().ref(`${this.COLLECTION}`).once("value")
        ).val()
      );
      return storage.filter((el: Task) => el.description === description);
    }

    public async filterByTag(tag: Task["tag"]): Promise<Task[]> {
      const storage: Task[] = Object.values(
        (
          await firebase.database().ref(`${this.COLLECTION}`).once("value")
        ).val()
      );
      return storage.filter((el: Task) => el.tag === tag);
    }

    public async filterByStatus(status: Task["status"]): Promise<Task[]> {
      const storage: Task[] = Object.values(
        (
          await firebase.database().ref(`${this.COLLECTION}`).once("value")
        ).val()
      );
      return storage.filter((el: Task) => el.status === status);
    }
  }
}
