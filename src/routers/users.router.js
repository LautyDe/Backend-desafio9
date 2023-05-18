import { Router } from "express";
import passport from "passport";

const router = Router();

/* router.post("/login", async (req, res) => {
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
}); */

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/loginError",
    successRedirect: "/products",
  })
);

/* router.post("/register", async (req, res) => {
  const user = req.body;
  const hashPassword = await hashData(user.password);
  const newUser = { ...user, password: hashPassword };
  const userValidator = await usersManager.createUser(newUser);
  if (userValidator) {
    res.redirect("/");
  } else {
    res.redirect("/registerError");
  }
}); */

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/registerError",
    successRedirect: "/registerOk",
  })
);

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

router.get(
  "/registerGitHub",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/github", passport.authenticate("github"), (req, res) => {
  res.redirect("/products");
});

export default router;
