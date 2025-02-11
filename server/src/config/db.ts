import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL no está definida en el archivo .env");
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a PostgreSQL");
  } catch (error) {
    console.error("❌ Error al conectar a PostgreSQL:", error);
    process.exit(1);
  }
};

export { sequelize, connectDB };
