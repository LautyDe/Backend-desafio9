import { Router } from "express";
import ProductManager from "../../db/dao/mongo/productManagerMongo.js";
import ChatManager from "../../db/dao/mongo/chatManagerMongo.js";
import CartManager from "../../db/dao/mongo/cartManagerMongo.js";

const router = Router();
const productManager = new ProductManager();
const chatManager = new ChatManager();
const cartManager = new CartManager();

//login
router.get("/", (req, res) => {
  res.render("login");
});

router.get("/loginError", (req, res) => {
  res.render("loginError");
});

//register
router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/registerOk", (req, res) => {
  res.render("registerOk");
});

router.get("/registerError", (req, res) => {
  res.render("registerError");
});

//logout
router.get("/logout", (req, res) => {
  res.render("logout");
});

/* home */
router.get("/products", async (req, res) => {
  const products = await productManager.getAll();
  const userData = await req.session;
  res.render("products", {
    style: "products.css",
    title: "Products",
    products: products,
    userData: userData,
  });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getAll();
  res.render("realTimeProducts", {
    style: "realTimeProducts.css",
    title: "Real Time Products",
    products: products,
  });
});

router.get("/chat", async (req, res) => {
  const messages = await chatManager.getAllMessages();
  res.render("chat", {
    style: "chat.css",
    title: "Chat",
    messages: messages,
  });
});

router.get("/carts", async (req, res) => {
  res.render("carts", {
    style: "carts.css",
    title: "Carts",
  });
});

router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.getById(cid);
  const cartsProducts = cart.products;
  res.render("cartsId", {
    style: "cartsId.css",
    title: "CartsId",
    cartsProducts: cartsProducts,
  });
});

export default router;
