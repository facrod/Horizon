import usuariosSchema from "../models/users.js"
import tareasSchema from "../models/tareas.js";
import { compare, encrypt } from "../helpers/password.helper.js";


async function getUsers(req, res) {
    try {
        const result = await usuariosSchema.find()
        return res.json({
            ok:true,
            data: result
        })    
    } catch (error) {
      return res.json({
        ok: false,
        error
      })  
    }
}
async function getUserId(req, res) {
    try {
        const id = req.payload._id;
        const result = await usuariosSchema.findById(id)
        const tareas = await tareasSchema.find({ usuario_id: id, active: true });

        return res.json({
            ok:true,
            data: {result, tareas}
        })    
    } catch (error) {
      return res.json({
        ok: false,
        error
      })  
    }
}
async function addUser(req, res) {
    try {
        const {nombre, apellido, dni, correo, fechaNacimiento, password} = req.body
        const pw = await encrypt(password);
        const result = await usuariosSchema.create({
            nombre,
            apellido,
            dni,
            correo,
            fechaNacimiento,
            password: pw
        })
        return res.json({
            ok:true,
            data: result
        })    
    } catch (error) {
        let mensajeUsuario = "Error al crear la cuenta";

        //dato duplicado
        if (error.code === 11000) {
            mensajeUsuario = "El correo electrónico o el DNI ya están registrados";
        }

        return res.json({ 
            ok: false, 
            error: mensajeUsuario
        });
    }
}
async function deleteUser(req, res) {
    try {
        const id = req.payload._id;
        const result = await usuariosSchema.findByIdAndDelete(id)
        return res.json({
            ok:true,
            data: result
        })    
    } catch (error) {
        return res.json({
            ok: false,
            error
        })  
    }
}
async function editUser (req, res) {
    try {
        const id = req.payload._id;
        const {nombre, apellido, dni, correo, fechaNacimiento, tema} = req.body 
        const result = await usuariosSchema.findByIdAndUpdate(id, {nombre, apellido, dni, correo, fechaNacimiento, tema}, { returnDocument: 'after' })
        
        return res.json({
            ok:true,
            data: result
        })    
    } catch (error) {
        return res.json({
            ok: false,
            error
        })  
    }
}

async function login (req, res) {
    const {correo, password} = req.body;

    const userLogged = await usuariosSchema.findOne({correo})
    
    if(!userLogged){
        return res.json({
            ok:false,
            error:"Usuario o contraseña incorrectos"
        })
    }
    const passwordCheck = await compare(password, userLogged.password)
    
    if(!passwordCheck) {
        return res.json({ 
            ok: false,
            error:"Usuario o contraseña incorrectos",
        })
    }
    const token = userLogged.generateAccesToken();

    return res.json({
        ok: true,
        data:token,
    })
}

export {
    getUsers,
    getUserId,
    addUser,
    deleteUser,
    editUser,
    login,
}