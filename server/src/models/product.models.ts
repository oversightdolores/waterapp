import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";

class Producto extends Model {
  public id!: string;
  public nombre!: string;
  public descripcion!: string;
  public precio!: number;
  public stock!: number;
}

Producto.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Producto",
  }
);

export default Producto;
