import {Id} from "@/convex/_generated/dataModel";

export type Task = {
  _id: Id<"tasks">;
  text: string;
  isCompleted: boolean;
}

export type TaskRegistrationRequest = {
  text: string;
  isCompleted: boolean;
}