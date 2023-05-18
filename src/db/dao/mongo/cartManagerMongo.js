import { cartsModel } from "../../models/carts.model.js";
import { productsModel } from "../../models/products.model.js";

export default class CartManager {
  async createCart() {
    try {
      const cart = await cartsModel.create({});
      return cart;
    } catch (error) {
      console.log(`Error creando carrito: ${error.message}`);
    }
  }

  async deleteCart(id) {
    try {
      const cart = await this.getById(id);
      if (!cart) {
        throw new Error(`No se encontro carrito con el id solicitado.`);
      } else {
        await cartsModel.findOneAndDelete({ _id: id }, { new: true });
        return "Carrito eliminado correctamente";
      }
    } catch (error) {
      console.log(`Error eliminando el carrito: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const cart = await cartsModel
        .findOne({ _id: id })
        .populate("products.product")
        .lean();
      if (!cart) {
        throw new Error(`No existe.`);
      } else {
        return cart;
      }
    } catch (error) {
      console.log(
        `Error buscando el carrito con el id solicitado: ${error.message}`
      );
    }
  }

  async addToCart(cid, pid) {
    try {
      const cart = await cartsModel.findOneAndUpdate(
        { _id: cid, "products.product": pid },
        { $inc: { "products.$.quantity": 1 } },
        { new: true }
      );
      if (!cart) {
        const cart = await cartsModel.findOneAndUpdate(
          { _id: cid },
          { $addToSet: { products: { product: pid, quantity: 1 } } },
          { new: true }
        );
        return cart;
      }
      return cart;
    } catch (error) {
      console.log(`Error agregando producto al carrito: ${error.message}`);
    }
  }

  async deleteProduct(cid, pid) {
    try {
      const cart = await this.getById(cid);
      const quantity = cart.products.find(item => item.product._id).quantity;
      if (quantity > 1) {
        const cart = await cartsModel.findOneAndUpdate(
          { _id: cid, "products.product": pid },
          { $set: { "products.$.quantity": quantity - 1 } },
          { new: true }
        );
        return cart;
      } else {
        const cart = await cartsModel.findOneAndUpdate(
          { _id: cid },
          { $pull: { "products": { "product": pid } } },
          { new: true }
        );
        return cart;
      }
    } catch (error) {
      console.log(`Error eliminando producto del carrito: ${error.message}`);
    }
  }

  async deleteAllProducts(id) {
    try {
      const cart = await cartsModel.findOneAndUpdate(
        { _id: id },
        { $set: { products: [] } }
      );
      return cart;
    } catch (error) {
      console.log(
        `Error eliminando todos los productos del carrito: ${error.message}`
      );
    }
  }
}
