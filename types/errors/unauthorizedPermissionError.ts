import { ConvexError } from "convex/values"

export type UnauthorizedPermissionErrorData = {
  code: "UNAUTHORIZED_PERMISSION"
  message?: string;
  resource?: string;
  action?: string;
  profileId?: string;
  requiredPermission: string;
  profilePermissions?: string[];
}

const DEFAULT_MESSAGE = "Access denied: insufficient permissions"

export class UnauthorizedPermissionConvexError extends ConvexError<UnauthorizedPermissionErrorData> {
  constructor(data: Omit<UnauthorizedPermissionErrorData, "code">) {
    super({ code: "UNAUTHORIZED_PERMISSION", message: DEFAULT_MESSAGE, ...data })
  }
}

export function isUnauthorizedPermissionConvexError(
  error: unknown,
): error is ConvexError<UnauthorizedPermissionErrorData> {
  return (
    error instanceof ConvexError &&
    (error.data as UnauthorizedPermissionErrorData)?.code === "UNAUTHORIZED_PERMISSION"
  )
}