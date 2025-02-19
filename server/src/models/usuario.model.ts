import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { v4 as uuidv4 } from "uuid";

class Usuario extends Model {
  public id!: string;
  public nombre!: string;
  public email!: string;
  public password!: string;
  public telefono!: string;
  public direccion!: string;
  public rol!: string;
}

Usuario.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // ✅ Corrección aquí
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "cliente",
    },
  },
  {
    sequelize,
    modelName: "Usuario",
  }
);

export default Usuario;
