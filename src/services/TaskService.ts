import firebase from "firebase";
import { Task } from "../model/Task";

export class TaskService {
  public tasksID: string[] = [];

  public static COLLECTION = "Tasks";

  public  async create(task: Task) {
    const ref = await firebase
      .database()
      .ref(TaskService.COLLECTION)
      .push(task);
    return ref.key;
  }

  public async get(key: string): Promise<Task> {
    return await (
      await firebase.database().ref(`${TaskService.COLLECTION}/${key}`).get()
    ).val();
  }

  public  async update(
    key: string,
    updateTask: Partial<Task>
  ): Promise<Partial<Task>> {
    let newTask: Partial<Task> = await this.get(key);
    await firebase
      .database()
      .ref(`${TaskService.COLLECTION}/${key}`)
      .set(newTask);
    if (updateTask) {
      newTask = updateTask;
    }
    await firebase
      .database()
      .ref(`${TaskService.COLLECTION}/${key}`)
      .set(newTask);
    return newTask;
  }

  public async delete(key: string | undefined): Promise<void> {
    await firebase.database().ref(`${TaskService.COLLECTION}/${key}`).remove();
    this.tasksID = this.tasksID.filter((el)=> el !== key)
  }

  public async filterByDate(createdDate: Date): Promise<Task[]> {
    return Object.values(
      (
        await firebase
          .database()
          .ref(`${TaskService.COLLECTION}`)
          .orderByChild("createdDate")
          .equalTo(createdDate.toString())
          .once("value")
      ).val()
    );
  }

  public async filterText(text: Task["description"]): Promise<Task[]> {
    const storage: Task[] = Object.values(
      (
        await firebase.database().ref(`${TaskService.COLLECTION}`).once("value")
      ).val()
    );
    return storage.filter((el: Task) => el.description === text);
  }

  public async filterTag(tag: Task["tag"]): Promise<Task[]> {
    const storage: Task[] = Object.values(
      (
        await firebase.database().ref(`${TaskService.COLLECTION}`).once("value")
      ).val()
    );
    return storage.filter((el: Task) => el.tag === tag);
  }

  public async filterStatus(status: Task["status"]): Promise<Task[]> {
    const storage: Task[] = Object.values(
      (
        await firebase.database().ref(`${TaskService.COLLECTION}`).once("value")
      ).val()
    );
    return storage.filter((el: Task) => el.status === status);
  }
}
