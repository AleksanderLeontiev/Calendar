import { Task } from "../model/Task";

export interface ITaskCalendar {
  tasksKey: string[] | Task["key"][];

  create(task: Task): Promise<string | null>;

  get(key: string | null): Promise<Task>;
  update(task: Task, changes: Partial<Task>): Promise<Partial<Task>>;

  delete(key: string | null): Promise<void>;

  filterByDate(createdDate: Date): Promise<Task[]>;
  filterByDescription(description: Task["description"]): Promise<Task[]>;
  filterByStatus(status: Task["status"]): Promise<Task[]>;
  filterByTag(tag: Task["tag"]): Promise<Task[]>;
}
