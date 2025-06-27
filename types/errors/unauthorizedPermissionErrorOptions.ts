export type UnauthorizedPermissionErrorOptions = {
  message?: string;
  resource?: string;
  action?: string;
  profileId?: string;
  requiredPermission?: string;
  userPermissions?: string[];
}

export class UnauthorizedPermissionError extends Error {
  public readonly name = "UnauthorizedPermissionError"
  public readonly statusCode = 403
  public readonly resource?: string
  public readonly action?: string
  public readonly userId?: string
  public readonly requiredPermission?: string
  public readonly userPermissions?: string[]

  constructor(options: UnauthorizedPermissionErrorOptions = {}) {
    const defaultMessage = "Access denied: insufficient permissions"
    const message = options.message || defaultMessage

    super(message)

    this.resource = options.resource
    this.action = options.action
    this.userId = options.profileId
    this.requiredPermission = options.requiredPermission
    this.userPermissions = options.userPermissions

    // Maintains proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthorizedPermissionError)
    }
  }

  /**
   * Returns a detailed error message with context
   */
  getDetailedMessage(): string {
    let details: string[] = []

    if (this.userId) {
      details.push(`User: ${this.userId}`)
    }

    if (this.resource && this.action) {
      details.push(`Attempted: ${this.action} on ${this.resource}`)
    } else if (this.resource) {
      details.push(`Resource: ${this.resource}`)
    } else if (this.action) {
      details.push(`Action: ${this.action}`)
    }

    if (this.requiredPermission) {
      details.push(`Required: [${this.requiredPermission}]`)
    }

    if (this.userPermissions?.length) {
      details.push(`User has: [${this.userPermissions.join(", ")}]`)
    }

    return details.length > 0
      ? `${this.message} - ${details.join(" | ")}`
      : this.message
  }

  /**
   * Returns a JSON representation of the error
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      resource: this.resource,
      action: this.action,
      userId: this.userId,
      requiredPermission: this.requiredPermission,
      userPermissions: this.userPermissions,
      stack: this.stack,
    }
  }
}

export function isUnauthorizedPermissionError(
  error: unknown
): error is UnauthorizedPermissionError {
  return (
    error instanceof Error &&
    error.name === "UnauthorizedPermissionError"
  )
}