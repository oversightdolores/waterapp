import { Request, Response, RequestHandler } from 'express';
import Usuario from '../models/usuario.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registro: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { nombre, email, telefono, direccion, password } = req.body;
    console.log('Datos recibidos:', req.body);
    if (!nombre || !email || !telefono || !direccion || !password) {
      res.status(400).json({ message: 'Todos los campos son obligatorios' });
      return;
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Contraseña encriptada:', hashedPassword);
    
    const usuario = await Usuario.create({
      nombre,
      email,
      telefono,
      direccion,
      password: hashedPassword,

    });
      console.log('Usuario creado:', usuario);
    
    res.status(201).json({ message: 'Usuario registrado con éxito', usuario });
  }catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ message: "Error en el registro", error: (error as any).message });
  }
};


export const login: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log('📥 Datos recibidos:', req.body);

    if (!email || !password) {
      res.status(400).json({ message: 'Email y contraseña son obligatorios' });
      return;
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      console.warn('⚠️ Usuario no encontrado');
       res.status(401).json({ message: 'Credenciales inválidas' });
       return;
    }

    const passwordMatch = await bcrypt.compare(password, usuario.password);
    console.log('🔑 Contraseña válida:', passwordMatch);

    if (!passwordMatch) {
       res.status(401).json({ message: 'Credenciales inválidas' });
        return;
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET no está definido en .env');
       res.status(500).json({ message: 'Error en el servidor: JWT_SECRET no definido' });
        return;
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('✅ Token generado con éxito');

    res.status(200).json({ message: 'Login exitoso', token, usuario });
  } catch (error) {
    console.error('❌ Error en el login:', error);
    res.status(500).json({ message: 'Error en el login', error: (error as any).message });
  }
};
