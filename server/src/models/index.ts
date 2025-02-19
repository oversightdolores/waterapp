import Usuario from "./usuario.model";
import Pedido from "./pedido.model";
import Producto from "./product.models";

// 📌 Un usuario tiene muchos pedidos
Usuario.hasMany(Pedido, { foreignKey: "usuarioId", onDelete: "CASCADE" });
Pedido.belongsTo(Usuario, { foreignKey: "usuarioId" });

// 📌 Un pedido puede tener muchos productos y un producto puede estar en varios pedidos
Pedido.belongsToMany(Producto, { through: Producto, foreignKey: "pedidoId" });
Producto.belongsToMany(Pedido, { through: Producto, foreignKey: "productoId" });

export { Usuario, Pedido, Producto };