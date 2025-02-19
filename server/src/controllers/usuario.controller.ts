import { Request, Response, RequestHandler } from 'express';
import Usuario from '../models/usuario.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middlewares/authMiddleware';

// ✅ 1️⃣ Registrar Usuario
export const registro: RequestHandler = async (req, res): Promise<void> => {
  console.log('data', req.body);
  try {
    const { nombre, email, telefono, direccion, password, rol } = req.body;
    if (!nombre || !email || !telefono || !direccion || !password || !rol) {
      res.status(400).json({ message: 'Todos los campos son obligatorios' });
      return;
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const usuario = await Usuario.create({
      nombre,
      email,
      telefono,
      direccion,
      password: hashedPassword,
      rol,
    });

    res.status(201).json({ message: 'Usuario registrado con éxito', usuario });
  } catch (error) {
    res.status(500).json({ message: "Error en el registro", error });
  }
};

// ✅ 2️⃣ Login de Usuario
export const login: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email y contraseña son obligatorios' });
      return;
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, usuario.password);
    if (!passwordMatch) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: 'Error en el servidor: JWT_SECRET no definido' });
      return;
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login exitoso', token, usuario });
  } catch (error) {
    res.status(500).json({ message: 'Error en el login', error });
  }
};

// ✅ 3️⃣ Obtener Perfil del Usuario Autenticado
export const getUserProfile: RequestHandler = async (req: AuthRequest, res): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: "No autorizado" });
      return;
    }

    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: ["id", "nombre", "email", "telefono", "direccion", "rol"],
    });

    if (!usuario) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// ✅ 4️⃣ Obtener Todos los Usuarios (Solo Admin)
export const obtenerUsuarios: RequestHandler = async (req, res): Promise<void> => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ["id", "nombre", "email", "telefono", "direccion", "rol"],
    });
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

// ✅ 5️⃣ Obtener un Usuario por ID
export const obtenerUsuarioPorId: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id, {
      attributes: ["id", "nombre", "email", "telefono", "direccion", "rol"],
    });

    if (!usuario) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// ✅ 6️⃣ Actualizar Usuario (Por ID)
export const actualizarUsuario: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono, direccion, rol } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    usuario.nombre = nombre || usuario.nombre;
    usuario.email = email || usuario.email;
    usuario.telefono = telefono || usuario.telefono;
    usuario.direccion = direccion || usuario.direccion;
    usuario.rol = rol || usuario.rol;

    await usuario.save();
    res.status(200).json({ message: "Usuario actualizado", usuario });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
};

// ✅ 7️⃣ Eliminar Usuario
export const eliminarUsuario: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    await usuario.destroy();
    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};

// ✅ 8️⃣ Logout (Eliminar Token)
export const logout: RequestHandler = async (req, res): Promise<void> => {
  try {
    res.status(200).json({ message: 'Logout exitoso' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el logout', error });
  }
};
