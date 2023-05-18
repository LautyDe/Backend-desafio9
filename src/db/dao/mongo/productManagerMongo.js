import { productsModel } from "../../models/products.model.js";

export default class ProductManager {
  async addProduct(product) {
    try {
      /* verifico que el producto tenga todos los parametros */
      if (this.#paramsValidator(product)) {
        product = {
          code: this.#codeGenerator(),
          status: true,
          ...product,
        };
        const newProduct = await productsModel.create(product);
        return newProduct;
      }
    } catch (error) {
      console.log(`Error agregando producto: ${error.message}`);
    }
  }

  async getAll() {
    try {
      const allProducts = await productsModel.find().lean(); //leer lean()
      return allProducts;
    } catch (error) {
      console.log(`Error obteniendo todos los productos: ${error.message}`);
    }
  }

  async getAllPaginated(limit, page, sort, query) {
    try {
      const search = query
        ? {
            stock: { $gte: 0 },
            $or: [
              { category: { $regex: query, $options: "i" } },
              { title: { $regex: query, $options: "i" } },
            ],
          }
        : {
            stock: { $gte: 0 },
          };

      if (sort === "asc") {
        sort = { price: 1 };
      } else if (sort === "desc") {
        sort = { price: -1 };
      }

      const options = {
        page: page || 1,
        limit: limit || 10,
        sort: sort,
        lean: true,
      };

      const allProducts = await productsModel.paginate(search, options);
      return allProducts;
    } catch (error) {
      console.log(`Error obteniendo todos los productos: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const product = await productsModel.find({ _id: id }).lean();
      if (product) {
        return product;
      } else {
        throw new Error(`Producto con id ${id} no encontrado`);
      }
    } catch (error) {
      console.log(
        `Error al buscar producto con el id solicitado: ${error.message}`
      );
    }
  }

  async updateProduct(id, product) {
    try {
      const productFinded = await this.getById(id);
      if (productFinded) {
        await productsModel.findOneAndUpdate({ _id: id }, product);
        const updatedProduct = await this.getById(id);
        return updatedProduct;
      } else {
        throw new Error(`No se encontro el producto con el id solicitado`);
      }
    } catch (error) {
      console.log(
        `Error al modificar producto con el id ${id}: ${error.message}`
      );
    }
  }

  async deleteById(id) {
    try {
      const deletedProduct = await this.getById(id);
      if (deletedProduct) {
        await productsModel.deleteOne({ _id: id });
        return "Producto eliminado";
      } else {
        throw new Error(`Producto con id ${id} no encontrado`);
      }
    } catch (error) {
      console.log(
        `Error al eliminar el producto con el id solicitado: ${error.message}`
      );
    }
  }

  async aggregationFunc(limit = null, page = null, sort = null, query = null) {
    try {
      const response = await productsModel.aggregate([{ $match: { query } }]);
      return response;
    } catch (error) {
      console.log(`Error haciendo la funcion aggregation: ${error.message}`);
    }
  }

  async deleteAll() {
    try {
      await productsModel.deleteMany();
      return "Productos eliminados";
    } catch (error) {
      console.log(`Ocurrio un error eliminando los datos: ${error.message}`);
    }
  }

  #codeGenerator(codeLength = 15) {
    const numeros = "0123456789";
    const letras = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numYLetras = numeros + letras;
    let code = "";
    for (let i = 0; i < codeLength; i++) {
      const random = Math.floor(Math.random() * numYLetras.length);
      code += numYLetras.charAt(random);
    }
    return code;
  }

  #paramsValidator(product) {
    if (
      product.title &&
      product.description &&
      product.price &&
      product.stock &&
      product.category &&
      !product.id &&
      !product.code
    ) {
      return true;
    } else {
      if (!product.title) {
        throw new Error(`Falta el title del producto.`);
      } else if (!product.description) {
        throw new Error(`Falta la descripcion del producto.`);
      } else if (!product.price) {
        throw new Error(`Falta el precio del producto.`);
      } else if (!product.stock) {
        throw new Error(`Falta el stock del producto.`);
      } else if (!product.category) {
        throw new Error(`Falta la categoria del producto.`);
      } else if (product.id) {
        throw new Error(`El producto no se debe cargar con el id`);
      } else if (product.code) {
        throw new Error(`El producto no se debe cargar con el code`);
      }
    }
  }
}
