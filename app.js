//libraries
import express from "express";
import session from "express-session";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
//locals
import routers from "./src/routers/index.routers.js";
import { __dirname } from "./src/utils.js";
import ProductManager from "./src/db/dao/mongo/productManagerMongo.js";
import ChatManager from "./src/db/dao/mongo/chatManagerMongo.js";
import CartManager from "./src/db/dao/mongo/cartManagerMongo.js";
//db
import "./src/db/dbConfig.js";
import mongoStore from "connect-mongo";
import { URI } from "./src/utils.js";
//passport
import passport from "passport";
import "./src/passport/strategies.js";

const app = express();
const PORT = 8080;

//instances
const productManager = new ProductManager();
const chatManager = new ChatManager();
const cartManager = new CartManager();

/* middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

/* cookies */
app.use(cookieParser());

//mongo session
app.use(
  session({
    secret: "SessionKey",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 10000 },
    store: new mongoStore({
      mongoUrl: URI,
    }),
  })
);

//passport config
app.use(passport.initialize());
app.use(passport.session());

/* handlebars */
app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    defaultLayout: "main.hbs",
    layoutsDir: __dirname + "/views/layouts",
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

/* routers */
app.use("/", routers);
app.use("/api", routers);

/* server */
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${httpServer.address().port}`);
  console.log(`http://localhost:${PORT}`);
});
httpServer.on("error", error =>
  console.log(`Error en servidor: ${error.message}`)
);

/* webSocket */
const socketServer = new Server(httpServer);
socketServer.on("connection", async socket => {
  const products = await productManager.getAll();
  const messages = await chatManager.getAllMessages();

  socket.emit("products", products);

  socket.on("newProduct", async data => {
    await productManager.addProduct(data);
    const products = await productManager.getAll();
    socket.emit("products", products);
  });

  socket.on("deleteProduct", async id => {
    await productManager.deleteById(id);
    const products = await productManager.getAll();
    socket.emit("products", products);
  });

  socket.emit("messages", messages);

  socket.on("newMessage", async data => {
    await chatManager.addMessage(data);
    socket.emit("messages", messages);
  });

  socket.on("cart", async id => {
    const cart = await cartManager.getById(id);
    socket.emit("cart", cart);
  });
});
