//@ts-nocheck
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const SecretKey =
  process.env.SECRET_KEY ||
  "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxNjE4ODc5NiwiaWF0IjoxNzE2MTg4Nzk2fQ.UO5TLvO9v4Tr_X7p51oCKEWqpjtix30BWrR4LFxP66M";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  jwt.verify(token, SecretKey, (err, decoded) => {
    if (err || typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded as JwtPayload & { agentId: string };
    next();
  });
};
