import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types";

export interface AuthenticatedRequest extends Request {
  userRole?: UserRole;
  userId?: string;
  userName?: string;
}

export function requireAuth(allowedRoles?: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const roleHeader = (req.headers["x-user-role"] as string)?.toUpperCase() as UserRole;
    const userIdHeader = (req.headers["x-user-id"] as string) || "user-anon";
    const userNameHeader = (req.headers["x-user-name"] as string) || "User";

    const role: UserRole = roleHeader || "CONSUMER";

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      res.status(403).json({
        success: false,
        error: `Forbidden: Role '${role}' is not authorized to perform this operation.`,
      });
      return;
    }

    req.userRole = role;
    req.userId = userIdHeader;
    req.userName = userNameHeader;
    next();
  };
}
