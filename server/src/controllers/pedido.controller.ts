import { Request, Response, RequestHandler } from 'express';
import { Pedido } from '../models/pedido.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



export const crearPedido: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { usuarioId, productos, total } = req.body;
    if (!usuarioId || !productos || !total) {
      res.status(400).json({ message: 'Todos los campos son obligatorios' });
      return;
    }
    
    const pedido = await Pedido.create({ usuarioId, productos, total });
    res.status(201).json({ message: 'Pedido creado con éxito', pedido });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el pedido', error });
  }
};

export const obtenerPedidos: RequestHandler = async (req, res): Promise<void> => {
  try {
    const pedidos = await Pedido.findAll();
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos', error });
  }
};
