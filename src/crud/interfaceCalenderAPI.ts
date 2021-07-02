import {Task} from "./types";

export interface ICrud {
    tasksID: Task["id"][] | string[];

    create(newTask: Task): Promise<Task[]>;
    read(id: Task["id"] | string): Promise<Task>;
    update(id: Task["id"] | string, updatedTask: Partial<Task>): Promise<Task>;
    delete(id: Task["id"] | string): Promise<void>;
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



        public async create(newTask: Task): Promise<Task[]> {
            this.tasks.push(await this.createIdTask(newTask));
            this.tasksID.push(this.tasks[this.tasks.length - 1].id);
            localStorage.setItem("taskCalendar", JSON.stringify(this.tasks));
            return this.tasks;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        public async read(id: Task["id"]): Promise<Task > {
            return this.tasks.filter((el: Task) => el.id === id)[0];
        }

        public async update(
            id: Task["id"],
            updateTask: Partial<Task>
        ): Promise<Task> {
            const newTask = await this.read(id);
            // eslint-disable-next-line no-restricted-syntax
            for (const key in newTask) {
                if (updateTask[key]) {
                    newTask[key] = updateTask[key];
                }
            }

            const storage = JSON.parse(
                localStorage.getItem("taskCalendar") as string
            );
            const newStorage = storage.map((item: Task) =>
                item.id === id ? newTask : item
            );
            localStorage.setItem("taskCalendar", JSON.stringify(newStorage));
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

        public async filterDate(filteredDate: Date): Promise<Task[]> {
            return this.tasks.filter(
                (item: Task) =>
                    JSON.stringify(item.date) === JSON.stringify(filteredDate.toString())
            );
        }

        public async filterText(text: Task["text"]): Promise<Task[]> {
            return this.tasks.filter((item: Task) => item.text === text);
        }

        public async filterStatus(status: Task["status"]): Promise<Task[]> {
            return this.tasks.filter((item: Task) => item.status === status);
        }

        public async filterTag(tag: Task["tag"]): Promise<Task[]> {
            return this.tasks.filter((item: Task) => item.tag === tag);
        }

    }
}
