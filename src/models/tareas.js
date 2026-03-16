import mongoose, {Schema} from "mongoose";

const tareasSchema = new Schema ({
    tarea: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String
    },
    dia: {
        type: String,
        required: true,
    },
    hora: {
        type: String,
        required: true,
    },
    horaFinalizacion: {
        type: String,
        required: true,
    },
    estado: {
        type: Boolean,
        default: false,    
    },
    active: {
        type: Boolean,
        default: true
    },
        usuario_id: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true,
    }
})

export default mongoose.model("tareas", tareasSchema);
