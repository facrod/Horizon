import express from "express"
import { getUsers, getUserId, deleteUser, editUser, addUser,login } from "../controllers/users.controller.js";
import { authenticate } from "../helpers/token.helper.js";
const router = express.Router()

router.get("/usuario", getUsers)

router.post("/usuario/login", login)

router.post("/usuario", addUser)

router.get("/perfil", authenticate, getUserId)

router.put ("/perfil", authenticate, editUser)

router.delete("/perfil", authenticate, deleteUser)


export default router;