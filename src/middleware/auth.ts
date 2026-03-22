// src/middleware/auth.ts

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

const auth =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token as string, config.jwtSecret);
      if (typeof decoded !== "object" || decoded === null) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }

      const payload = decoded as jwt.JwtPayload;
      const { userId, name, email, role } = payload;
      if (!userId || !name || !email || !role) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }

      if (roles.length > 0 && !roles.includes(role)) {
        return res
          .status(403)
          .json({ success: false, message: "Forbidden Access" });
      }

      req.user = decoded as jwt.JwtPayload;

      // Additional check for customer role to ensure they can only access their own data
      if (roles.includes("customer") && role === "customer") {

        // Pass the customer using own token to access their own data
        if (!req.body) {
          return next();
        }
        const requestedUserId = parseInt(req.params.userId || req.body.customer_id);

        if ((req.body.customer_id || req.params.userId) && requestedUserId !== userId) {
          return res
            .status(403)
            .json({ success: false, message: "Forbidden Access" });
        }
      }
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  };

export default auth;
