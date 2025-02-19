import { Request, Response, RequestHandler, NextFunction } from 'express';
import { Usuario, Pedido, Producto } from '../models';
import { AuthRequest } from '../middlewares/authMiddleware';

interface User {
  id: string;
  rol: string;
  
}



// ✅ 1️⃣ Crear Pedido
export const crearPedido: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { usuarioId, productos, total } = req.body;
    if (!usuarioId || !productos || !total) {
      res.status(400).json({ message: 'Todos los campos son obligatorios' });
      return;
    }

    const pedido = await Pedido.create({ usuarioId, productos, total, estado: "pendiente" });
    res.status(201).json({ message: 'Pedido creado con éxito', pedido });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el pedido', error });
  }
};

// ✅ 2️⃣ Obtener Pedidos
export const obtenerPedidos: RequestHandler = async (req: AuthRequest, res): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: "No autorizado" });
      return;
    }

    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    let pedidos;
    if (usuario.rol === "admin") {
      pedidos = await Pedido.findAll({
        include: [{ model: Usuario, attributes: ["nombre", "direccion", "telefono"] }],
      });
    } else {
      pedidos = await Pedido.findAll({
        where: { usuarioId: req.user.id },
        include: [{ model: Usuario, attributes: ["nombre", "direccion", "telefono"] }, { model: Producto, attributes: ["nombre", "precio"] }],
      });
    }

    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos', error });
  }
};


// ✅ 3️⃣ Obtener un Pedido por ID
export const obtenerPedidoPorId: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findByPk(id);

    if (!pedido) {
      res.status(404).json({ message: 'Pedido no encontrado' });
      return;
    }

    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el pedido', error });
  }
};

// ✅ 4️⃣ Actualizar Estado de un Pedido
export const actualizarEstadoPedido: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!["pendiente", "en proceso", "completado", "cancelado"].includes(estado)) {
      res.status(400).json({ message: 'Estado inválido' });
      return;
    }

    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      res.status(404).json({ message: 'Pedido no encontrado' });
      return;
    }

    pedido.estado = estado;
    await pedido.save();

    res.status(200).json({ message: 'Estado del pedido actualizado', pedido });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el estado del pedido', error });
  }
};

// ✅ 5️⃣ Eliminar un Pedido
export const eliminarPedido = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // 🔥 Verificar si el pedido existe
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      res.status(404).json({ message: "Pedido no encontrado" });
      return;
    }

    await pedido.destroy();
    res.status(200).json({ message: "Pedido eliminado con éxito" });
  } catch (error) {
    console.error("❌ Error al eliminar pedido:", error);
    res.status(500).json({ message: "Error en el servidor", error: (error as any).message });
  }
};
