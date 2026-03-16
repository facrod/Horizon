import express from "express"
import { getTareas, getTareaId, addTarea, editTarea, logicalDeleteTarea, activateTarea } from "../controllers/tarea.controller.js";
import { authenticate } from "../helpers/token.helper.js";

const router = express.Router()

router.get("/tareas/mis-tareas", authenticate, getTareas);

router.get("/tareas/:id", authenticate, getTareaId)

router.post("/tareas", authenticate,  addTarea)

router.put("/tareas/activate/:id", authenticate, activateTarea)

router.put("/tareas/:id", authenticate, editTarea)

router.delete("/tareas/:id", authenticate, logicalDeleteTarea)


export default router;