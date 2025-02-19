import { NextFunction, RequestHandler, Response } from "express";
import { AuthRequest } from "./authMiddleware"; // 👈 Importamos la interfaz


export const adminMiddleware: RequestHandler = (req: AuthRequest, res: Response, next: NextFunction): void => {
  console.log("user", req.user); // ✅ Debería mostrar { id: "...", rol: "admin" }

  if (!req.user || req.user.rol !== "admin") {
     res.status(403).json({ message: "Acceso denegado, solo administradores" });
     return
  }

  next();
};
