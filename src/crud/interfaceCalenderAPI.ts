export type Task = {
    date: string;
    text: string;
    status: "wait" | "process" | "done";
    tag: "low" | "middle" | "high";
    id?: number | string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};
export interface ICrud {
    tasksId: Task["id"][] | string[];
    create(newTask: Task): Promise<Task[]>;
    read(id: Task["id"]): Promise<Task>;
    update(id: Task["id"], updateTask: Task): Promise<Task>;
    delete(id: Task["id"]): Promise<void>;
}
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LocalStorage {
    export class TaskCalendar implements ICrud {
        tasksID: Task["id"][] = [];

        private tasks: Task[];

        constructor() {
            this.tasks = [];
            if (localStorage.getItem("taskCalendar")) {
                this.tasks = JSON.parse(
                    localStorage.getItem("taskCalendar") as string
                );
            } else {
                localStorage.setItem("taskCalendar", JSON.stringify(this.tasks));
            }
        }

        public async create(task: Task): Promise<Task[]> {
            const NewTasks = [...this.tasks];
            const newTasksID = [...this.tasksID];
            if (task.id === undefined) {
                const newTask = await this.createIdTask(task);
                NewTasks.push(newTask);
            } else {
                NewTasks.push(task);
            }
            newTasksID.push(NewTasks[NewTasks.length - 1].id);
            localStorage.setItem("taskCalendar", JSON.stringify(NewTasks));
            this.tasks = NewTasks;
            this.tasksID = newTasksID;
            return NewTasks;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        public async read(id: Task["id"]): Promise<Task | Task[]> {
            const result = id
                ? this.tasks.filter((el: Task) => el.id === id)[0]
                : this.tasks;
            return result;
        }

        public async update(
            id: Task["id"],
            updateTask: Partial<Task>
        ): Promise<Task> {
            const newTask = { ...((await this.read(id)) as Task) };
            const storage = [...this.tasks];
            Object.keys(newTask).forEach((el) => {
                if (updateTask[el]) {
                    newTask[el] = updateTask[el];
                }
            });
            const newStorage = storage.map((el: Task) =>
                el.id === id ? newTask : el
            );
            localStorage.setItem("taskCalendar", JSON.stringify(newStorage));
            this.tasks = newStorage;
            return newTask;
        }

        public async delete(id: Task["id"]): Promise<void> {
            const preNewStorage = this.tasks.filter((el: Task) => el.id !== id);
            const newStorage = preNewStorage === null ? [] : preNewStorage;
            this.tasks = newStorage;
            localStorage.setItem("taskCalendar", JSON.stringify(newStorage));
            const newTasksID = this.tasksID.filter((el: Task["id"]) => el !== id);
            this.tasksID = newTasksID === null ? [] : newTasksID;
        }

        private async createIdTask(task: Task): Promise<Task> {
            const randomID = Math.floor(Math.random());

            const id = this.tasks.filter((el: Task) => el.id === randomID).length === 0
                    ? randomID
                    : this.createIdTask(task);
            const newTask = { ...task };
            newTask.id = id as number;
            return newTask;
        }
    }
}