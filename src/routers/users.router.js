import { Router } from "express";
import UsersManager from "../db/dao/mongo/usersManagerMongo.js";
import { hasData, compareData } from "../utils.js";

const router = Router();
const usersManager = new UsersManager();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userOk = await usersManager.loginUser(email, password);
  console.log(userOk);
  if (userOk) {
    req.session["email"] = userOk.email;
    req.session["password"] = userOk.password;
    req.session["logged"] = true;
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session["rol"] = "admin";
    } else {
      req.session["rol"] = "user";
    }
    console.log(req.session);
    res.redirect("/products");
  } else {
    res.redirect("/loginError");
  }
});

router.post("/register", async (req, res) => {
  const user = req.body;
  const hashPassword = await hasData(user.password);
  const newUser = { ...user, password: hashPassword };
  const userValidator = await usersManager.createUser(newUser);
  if (userValidator) {
    res.redirect("/");
  } else {
    res.redirect("/registerError");
  }
});

router.get("/test", (req, res) => {
  console.log("session", req.session);
  res.send("Probando");
});

router.get("/logout", (req, res) => {
  req.session.destroy(error => {
    if (error) {
      console.log(error.message);
      res.json({ message: error });
    } else {
      res.redirect("/");
    }
  });
});

export default router;
