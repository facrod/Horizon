import express from "express"
import { getUsers, getUserId, deleteUser, editUser, addUser,login } from "../controllers/users.controller.js";
import { authenticate } from "../helpers/token.helper.js";
const router = express.Router()

router.get("/usuario", getUsers)

router.post("/usuario/login", login)

router.get("/usuario/:id", getUserId)

router.post("/usuario", addUser)

router.put ("/usuario/:id", authenticate, editUser)

router.delete("/usuario/:id", deleteUser)


export default router;