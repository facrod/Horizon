const API_URL = "http://localhost:3000/api";

export let tareas = []

function obtenerHeaders() {
    const token = localStorage.getItem("token_horizon");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}
export async function cargarTareas() {
    try {
        const response = await fetch(`${API_URL}/tareas/mis-tareas`, {
            method: "GET",
            headers: obtenerHeaders()
        });

        const res = await response.json();

        if (res.ok) {
            tareas = res.data;
            return { ok: true, data: tareas };
        } else {
            return { ok: false, error: res.error };
        }
    } catch (error) {
        return { ok: false, error: "Error de conexión" };
    }
}
export async function guardarDatos(nuevaTarea) {
    try {
        const response = await fetch(`${API_URL}/tareas`, {
            method: "POST",
            headers: obtenerHeaders(),
            body: JSON.stringify(nuevaTarea)
        });

        const res = await response.json();

        if (res.ok) {
            tareas.push(res.data);
            return { ok: true, data: res.data };
        } else {
            return { ok: false, error: res.error };
        }
    } catch (error) {
        return { ok: false, error: "Error de conexión" };
    }
}
export async function modificarTarea (tareaModificada) {
    try {
        const idTarea = tareaModificada._id;
        const response = await fetch(`${API_URL}/tareas/${idTarea}`, {
            method: "PUT",
            headers: obtenerHeaders(),
            body: JSON.stringify(tareaModificada)
        });
        const res = await response.json();
        if (res.ok) {
            tareas = tareas.map(t => t._id === idTarea ? res.data : t);
            return { ok: true, data: res.data };
        } else {
            return { ok: false, error: res.error };
        }     
    } catch (error) {
        return { ok: false, error: "Error de conexión" };
    } 
}
export async function eliminarTarea(tareaId) {
    try {
        const id = tareaId;
        const response = await fetch(`${API_URL}/tareas/${id}`, {
            method: "DELETE",
            headers: obtenerHeaders(),
        });
        const res = await response.json()
        if (res.ok) {
            tareas = tareas.filter(t => t._id !== id);
            return { ok: true, data: res.data };
        } else {
            return { ok: false, error: res.error };
        }
    } catch (error) {
        return { ok: false, error: "Error de conexión" };
    }
}

export async function cargarTareasEliminadas () {
    try {
        const response = await fetch (`${API_URL}/tareas/eliminadas`, {
            method: "GET",
            headers: obtenerHeaders()
        });
        const res = await response.json()
        if(res.ok) {
            return {ok: true, data: res.data}
        } else {
            return {ok: false, error: res.error}
        }
     } catch (error) {
        return {ok: false, error: "Error de conexión"}
    }   
}
export async function activarTarea(tareaId) {
    try {
        const response = await fetch(`${API_URL}/tareas/activate/${tareaId}`, {
            method: "PUT",
            headers: obtenerHeaders(),
        });
        const res = await response.json();
        if (res.ok) {
            return { ok: true, data: res.data };
        } else {
            return { ok: false, error: res.error };
        }
    } catch (error) {
        return { ok: false, error: "Error de conexión" };
    }
}