import express from "express";
import cors from "cors";
import connect from "./database/db.js"
import routerTareas from "./routes/tareas.routes.js";
import routerUsers from "./routes/users.routes.js";
import dotenv from "dotenv";

dotenv.config()

const app = express();
const prefix = "/api"

app.use(express.json());
app.use(cors());

app.use(prefix, routerTareas)
app.use(prefix, routerUsers)

connect()
 app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));