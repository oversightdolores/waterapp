import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { 
  crearPedido, 
  obtenerPedidos, 
  obtenerPedidoPorId, 
  actualizarEstadoPedido, 
  eliminarPedido 
} from "../controllers/pedido.controller";

const router = Router();

router.post("/", authMiddleware, crearPedido);
router.get("/", authMiddleware, obtenerPedidos);
router.get("/:id", authMiddleware, obtenerPedidoPorId);
router.put("/:id", authMiddleware, actualizarEstadoPedido);
router.delete("/:id", authMiddleware, adminMiddleware, eliminarPedido);

export default router;
