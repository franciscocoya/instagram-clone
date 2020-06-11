const mongoose = require("mongoose");

//Comprobar que la direccion de la base de datos exista
const URI = process.env.MONGODB_URI
  ? process.env.MONGODB_URI
  : "mongodb://localhost/databasetest";

mongoose.connect(URI, {
  //Para que mongoose se puede conectar y no muestre mensajes
  //de error por consola
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("DB is Connected");
});
