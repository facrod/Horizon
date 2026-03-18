import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";

const usuariosSchema = new Schema ({
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    dni: {
        type: String,
        required: true,
    },
    fechaNacimiento: {
        type: String,
        required: true,
    },
    correo: {
        type: String,
        required: true,    
        unique: true,
    },
    tema: {
        type: String,
        default: "whiteMode"
    }
})

usuariosSchema.methods.generateAccesToken = function () {
    const token = jwt.sign({_id: this._id}, process.env.SECRETO, {expiresIn: "7d"})
    return token;
}

export default mongoose.model("usuarios", usuariosSchema);
