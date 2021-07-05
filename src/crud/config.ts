import firebase from "firebase";
import { Task } from "./types";

export const firebaseConfig = {
  apiKey: "AIzaSyBVjXG_E5JKJJjb7cE7WcrrdaY2CdnUMC8",
  authDomain: "crubfirebase-2e276.firebaseapp.com",
  databaseURL: "https://crubfirebase-2e276-default-rtdb.firebaseio.com",
  projectId: "crubfirebase-2e276",
  storageBucket: "crubfirebase-2e276.appspot.com",
  messagingSenderId: "870116999462",
  appId: "1:870116999462:web:fdbfa744e19d7973b081e7",
  measurementId: "G-Q0KVV8XQDX",
};
firebase.initializeApp(firebaseConfig);

export interface ICrud {
  tasksID: Task["id"][];

  create(newTask: Task): Promise<Task[]>;

  read(id: Task["id"] | string): Promise<Task>;

  update(id: Task["id"] | string, updatedTask: Partial<Task>): Promise<Task>;

  delete(id: Task["id"] | string): Promise<void>;

  filterDate(filtredDate: Date): Promise<Task[]>;
  filterText(text: Task["description"]): Promise<Task[]>;
  filterStatus(status: Task["status"]): Promise<Task[]>;
  filterTag(tag: Task["tag"]): Promise<Task[]>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FireBaseCrud {
  export class CrudCalendar implements ICrud {
    public tasksID: string[] = [];

    public posting = "tasks";

    constructor(posting?: string) {
      this.posting = posting === undefined ? this.posting : posting;
    }

    public async create(newTask: Task): Promise<Task[]> {
      firebase.database().ref(this.posting).push(newTask);
      const storage: Task[] = (
        await firebase.database().ref(this.posting).once("value")
      ).val();
      this.tasksID = Object.keys(storage);
      const result: Task[] = Object.values(storage);
      return result;
    }

    public async read(id: Task["id"] | string): Promise<Task> {
      const task: Task = (
        await firebase.database().ref(`${this.posting}/${id}`).once("value")
      ).val();
      return task;
    }

    public async update(
      id: Task["id"] | string,
      updatedTask: Partial<Task>
    ): Promise<Task> {
      const newTask = await this.read(id);

      Object.keys(newTask).forEach((el) => {
        if (updatedTask[el]) {
          newTask[el] = updatedTask[el];
        }
      });
      await firebase.database().ref(`${this.posting}/${id}`).set(newTask);
      return newTask;
    }

    public async delete(id: string): Promise<void> {
      await firebase.database().ref(`${this.posting}/${id}`).remove();
      this.tasksID = this.tasksID.filter((el) => el !== id);
    }

    public async filterDate(filtredDate: Date): Promise<Task[]> {
      const storage: Task[] = Object.values(
        (await firebase.database().ref(this.posting).once("value")).val()
      );
      return storage.filter((el: Task) => el.date === filtredDate.toString());
    }

    public async filterText(text: Task["text"]): Promise<Task[]> {
      const storage: Task[] = Object.values(
        (await firebase.database().ref(this.posting).once("value")).val()
      );
      return storage.filter((el: Task) => el.text === text);
    }

    public async filterTag(tag: Task["tag"]): Promise<Task[]> {
      const storage: Task[] = Object.values(
        (await firebase.database().ref(this.posting).once("value")).val()
      );
      return storage.filter((el: Task) => el.tag === tag);
    }

    public async filterStatus(status: Task["status"]): Promise<Task[]> {
      const storage: Task[] = Object.values(
        (await firebase.database().ref(this.posting).once("value")).val()
      );
      return storage.filter((el: Task) => el.status === status);
    }
  }
}
