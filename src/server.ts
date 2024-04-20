import express from "express";
import colors from "colors";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import swaggerSpec, { swaggerUIOptions } from "./config/swagger";
import router from "./router";
import db from "./config/db";

//conectar a db

export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    // console.log(colors.magenta("Conexion exitosa a la base datos"));
  } catch (error) {
    console.log(error);
    console.log(
      colors.red.bold("Hubo un error al conectar a la base de datos")
    );
  }
}
connectDB();

//Instancia de express
const server = express();

//Permitir conexiones
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error("Error de cors"));
    }
  },
};

server.use(cors(corsOptions));

//Leer datos de formularios
server.use(express.json());

server.use(morgan("dev"));
server.use("/api/products", router);

//Docts
server.use(
  "/docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec, swaggerUIOptions)
);

export default server;
