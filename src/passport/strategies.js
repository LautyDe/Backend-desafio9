import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import { usersModel } from "../db/models/users.model.js";
import { hashData, compareData } from "../utils.js";

//local
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      const user = await usersModel.findOne({ email });
      if (!user) {
        return done(null, false);
      }
      const passwordOk = await compareData(password, user.password);
      if (!passwordOk) {
        return done(null, false);
      }
      done(null, user);
    }
  )
);

//register
passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const userDB = await usersModel.findOne({ email });
      if (userDB) {
        return done(null, false);
      }
      const hashPassword = await hashData(password);
      const newUser = { ...req.body, password: hashPassword };
      const newUserDB = await usersModel.create(newUser);
      done(null, newUserDB);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await usersModel.findById(id);
  done(null, user);
});

//github
passport.use(
  "github",
  new GitHubStrategy(
    {
      clientID: "Iv1.e13e8e11be099aaa",
      clientSecret: "ac5baaf2220cecf4d954b7cad32f435b85356033",
      callbackURL: "http://localhost:8080/users/github",
    },
    async (accesToken, refresToken, profile, done) => {
      const email = profile._json.email;
      const userDB = await usersModel.findOne({ email });
      if (userDB) {
        return done(null, userDB);
      }
      const newUser = {
        first_name: profile._json.name.split(" ")[0],
        last_name: profile._json.name.split(" ")[1] || "",
        email,
        password: "",
      };
      const newUserDB = await usersModel.create(newUser);
      console.log(newUser);
      done(null, newUserDB);
    }
  )
);
