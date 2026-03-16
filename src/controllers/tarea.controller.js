import tareasSchema from "../models/tareas.js"
//import { createUser } from "./users.controller.js";

async function getTareas (req, res) {
    try {
        const usuario_id = req.payload._id;
        const results = await tareasSchema.find({
            active: true,
            usuario_id: usuario_id 
        });
        return res.json({ ok: true, data: results })
    } catch (error) {
        return res.json({ ok: false, error })
    }
}
async function getTareaId (req, res) {
    try {
        const {id} = req.params;
        const usuario_id = req.payload._id;
        const results = await tareasSchema.findOne({
            _id: id,
            usuario_id: usuario_id 
        });
        if(!results){
            return res.json({
                ok:false,
                error:"Tarea no encontrada o no autorizada"
            })
        }
        return res.json({
            ok: true,
            data: results
    });
    } catch (error) {
        return res.json({
            ok: false,
            error: error,
        })
    }
}
async function addTarea (req, res) {
    try {
        const { tarea, descripcion, hora, horaFinalizacion, dia} = req.body
        const usuario_id = req.payload._id  // viene del token
        const tareaNueva = await tareasSchema.create({
            tarea,
            descripcion,
            dia,
            hora,
            horaFinalizacion,
            usuario_id,
        })
        
        return res.json({ ok: true, data: tareaNueva })
    } catch (error) {
        return res.json({ ok: false, error })
    }
}
async function editTarea (req, res) {
    try {
        const {id} = req.params;
        const usuario_id = req.payload._id;
        const {tarea, descripcion, hora, horaFinalizacion, dia, estado} = req.body
        const results = await tareasSchema.findOneAndUpdate(
            { _id:id, usuario_id },
            {tarea, descripcion, hora, horaFinalizacion, dia, estado},
            { returnDocument:"after" }
        )
        if(!results){
            return res.json({
                ok:false,
                error:"Tarea no encontrada o no autorizada"
            })
        }
        return res.json({
            ok: true,
            data: results
        })
    } catch (error) {
        return res.json({
            ok:false,
            error,
        })
    } 
}

async function logicalDeleteTarea (req, res) {
    try {
        const { id } = req.params;
        const usuario_id = req.payload._id;

        const deletedTarea = await tareasSchema.findOneAndUpdate(
            { _id:id, usuario_id: usuario_id}, 
            {active: false},
            { returnDocument: "after" },
        )
        if(!deletedTarea){
            return res.json({
                ok:false,
                error:"Tarea no encontrada o no autorizada"
            })
        }
        return res.json({
            ok:true,
            data: deletedTarea,
        })
    } catch (error) {
        return res.json({
            ok: false,
            error,
        })
    }
}
async function activateTarea (req, res) {
     try {
        const { id } = req.params;
        const usuario_id = req.payload._id;
        const updatedTarea = await tareasSchema.findOneAndUpdate(
            { _id:id, usuario_id: usuario_id}, 
            {active: true},
            { returnDocument: "after" },
        )
        if(!updatedTarea){
            return res.json({
                ok:false,
                error:"Tarea no encontrada o no autorizada"
            })
        }
        return res.json({
            ok:true,
            data: updatedTarea,
        })
    } catch (error) {
        return res.json({
            ok: false,
            error,
        })
    }   
}

export {
    getTareas,
    getTareaId,
    addTarea,
    editTarea,
    logicalDeleteTarea,
    activateTarea
}