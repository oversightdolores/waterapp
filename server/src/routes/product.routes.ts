import { Router } from "express";
import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/authMiddleware"; // 🔥 Middleware para validar token
import { adminMiddleware } from "../middlewares/adminMiddleware"; // 🔥 Middleware para validar rol de admin

const router = Router();

router.post("/",authMiddleware, adminMiddleware, crearProducto); // Crear producto
router.get("/", authMiddleware,  obtenerProductos); // Obtener todos los productos
router.get("/:id", authMiddleware, adminMiddleware, obtenerProductoPorId); // Obtener producto por ID
router.put("/:id", adminMiddleware, actualizarProducto); // Actualizar producto
router.delete("/:id", adminMiddleware, eliminarProducto); // Eliminar producto

export default router;
