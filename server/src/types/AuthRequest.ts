import { Request } from "express";
import { User } from "./user";


export  interface AuthRequest {
    user?: User; // 🔥 Agregar la propiedad `user`

  }

