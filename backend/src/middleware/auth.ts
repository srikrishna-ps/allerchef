import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const auth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    const token = authHeader.split(" ")[1];
    console.log("[DEBUG] Token received:", token);
    console.log("[DEBUG] JWT_SECRET:", process.env.JWT_SECRET);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = (decoded as any);
        next();
    } catch (err) {
        console.log("[DEBUG] JWT verification error:", err);
        res.status(401).json({ message: "Token is not valid" });
    }
};

export default auth; 