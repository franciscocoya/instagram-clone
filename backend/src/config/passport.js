const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User/User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        //error, usuario, mensaje
        return done(null, false, "El usuario no existe");
      } else {
        const match = await user.matchPassword(password);
        if (match) {
          return done(null, user);
        } else {
          //Contraseña incorrecta
          return done(null, false, "Contraseña incorrecta");
        } //fin if match
      } //fin if user
    } //fin async
  )
);

//El usuario se almacena en sesion
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//Toma un id y genera un usuario
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
