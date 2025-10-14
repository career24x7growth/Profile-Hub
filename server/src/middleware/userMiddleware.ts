import { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Access denied. Admin privileges required." });
  }

  next();
};

export const isSuperAdmin = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Access denied. Super admin privileges required." });
  }

  next();
};
