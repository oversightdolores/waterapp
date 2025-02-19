import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Usuario } from "../models"; // Asegúrate de que el modelo está bien importado
import dotenv from "dotenv";

dotenv.config();

// 🔥 Definir la interfaz extendida con el usuario autenticado
export interface AuthRequest extends Request {
  user?: {
    id: string;
    rol: string;
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
       res.status(401).json({ message: "Acceso denegado, token no proporcionado" });
       return
    }

    // 🔥 Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    // 🔥 Buscar el usuario en la base de datos
    const user = await Usuario.findByPk(decoded.id, {
      attributes: ["id", "rol"],
    });

    if (!user) {
       res.status(401).json({ message: "Usuario no encontrado" });
        return
    }

    // ✅ Asignamos el usuario autenticado a `req.user`
    req.user = { id: user.id, rol: user.rol };

    next(); // ✅ Continuar con la siguiente función en la cadena de middlewares
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};
