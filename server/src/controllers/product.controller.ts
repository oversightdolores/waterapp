import { Request, Response, RequestHandler } from "express";
import { Producto } from "../models";

// ✅ Crear Producto
export const crearProducto: RequestHandler = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;
    if (!nombre || !descripcion || !precio || stock === undefined) {
      res.status(400).json({ message: "Todos los campos son obligatorios" });
      return;
    }

    const producto = await Producto.create({ nombre, descripcion, precio, stock });
    res.status(201).json({ message: "Producto creado con éxito", producto });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el producto", error });
  }
};

// ✅ Obtener todos los productos
export const obtenerProductos: RequestHandler = async (_, res) => {
  try {
    const productos = await Producto.findAll();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
};

// ✅ Obtener un producto por ID
export const obtenerProductoPorId: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener producto", error });
  }
};

// ✅ Actualizar Producto
export const actualizarProducto: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    await producto.update({ nombre, descripcion, precio, stock });
    res.status(200).json({ message: "Producto actualizado con éxito", producto });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar producto", error });
  }
};

// ✅ Eliminar Producto
export const eliminarProducto: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    await producto.destroy();
    res.status(200).json({ message: "Producto eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto", error });
  }
};
