import { Id } from "@/convex/_generated/dataModel"

export type Profile = {
  _id: Id<"profiles">;
  username: string;
  role?: Role;
}

export type ProfileWithPermissions = Profile & {
  permissions: Permission[];
};

export type Role = {
  _id: Id<"roles">
  name: string;
  slug: string;
}

export type Permission = {
  _id: Id<"permissions">;
  name: string;
  slug: string;
  description: string;
}