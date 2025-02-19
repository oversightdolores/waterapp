import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";

class Pedido extends Model {
  public id!: string;
  public usuarioId!: string;
  public productos!: string; // Guardaremos un array de productos en formato JSON
  public total!: number;
  public estado!: string;
  public fechaPedido!: Date;
}

Pedido.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Usuarios", // Asegúrate de que coincida con el nombre en la DB
        key: "id",
      },
    },
    productos: {
      type: DataTypes.TEXT, // Se guarda como JSON (array de productos)
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("productos");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value: any[]) {
        this.setDataValue("productos", JSON.stringify(value));
      },
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pendiente",
    },
    fechaPedido: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Pedido",
  }
);

export default Pedido;
