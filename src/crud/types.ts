export type Task = {
    date: string;
    text: string;
    status: "wait" | "process" | "done";
    tag: "low" | "middle" | "high";
    id?: number | string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};
