import { Router } from "express";
import products from "./products.router.js";
import carts from "./carts.router.js";
import views from "./viewsRouter/views.router.js";
import users from "./users.router.js";

const router = Router();

router.use("/", views);
router.use("/users", users);
router.use("/api/products", products);
router.use("/api/carts", carts);

export default router;
