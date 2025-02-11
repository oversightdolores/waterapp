import app from './app';
import { sequelize } from './config/db';

const PORT = process.env.PORT || 4000;

// Sincronizar la base de datos antes de iniciar el servidor
(async () => {
    try {
        await sequelize.sync({ force: false }); // ⚠ Esto eliminará y recreará todas las tablas
        console.log('✅ Base de datos sincronizada correctamente');

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
        });

    } catch (error) {
        console.error('❌ Error al sincronizar la base de datos:', error);
        process.exit(1);
    }
})();
