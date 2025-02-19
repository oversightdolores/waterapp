import {Router} from 'express';
import {
  registro,
  login,
  getUserProfile,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  logout,
} from '../controllers/usuario.controller';
import { authMiddleware } from '../middlewares/authMiddleware'; // Middleware para autenticación

const router = Router();

router.post('/registro', registro); // ✅ Registrar usuario
router.post('/login', login); // ✅ Login de usuario
router.get('/profile', authMiddleware, getUserProfile); // ✅ Obtener perfil autenticado
router.get('', authMiddleware, obtenerUsuarios); // ✅ Obtener todos los usuarios
router.get('/:id', authMiddleware, obtenerUsuarioPorId); // ✅ Obtener usuario por ID
router.put('/:id', authMiddleware, actualizarUsuario); // ✅ Actualizar usuario
router.delete('/:id', authMiddleware, eliminarUsuario); // ✅ Eliminar usuario
router.post('/logout', logout); // ✅ Logout (Opcional)

export default router;
