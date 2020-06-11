const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");

/**
 * INITIALIZATIONS
 */
const app = express();

require("./config/passport");

/**
 * SETTINGS
 */
//Connection port
app.set("port", process.env.PORT || 4000);

/**
 * MIDLEWARES
 */
app.use(cors());
//app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    // limit: "50mb",
    extended: true,
    // parameterLimit: 1000000,
  })
);

// parse application/json
app.use(bodyParser.json({ limit: "50mb", extended: true }));

//Para almacenar los datos del usuario temporalmente y además autentificar
app.use(
  session({
    secret: "mySecretApp",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(morgan("dev"));
app.use(fileUpload());
app.use(passport.initialize());
app.use(passport.session());

/**
 * GLOBAL VARIABLES
 */

/**
 * ROUTES
 */
app.use(require("./routes/index"));
app.use(require("./routes/UrlShortener"));

module.exports = app;
