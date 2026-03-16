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



//GUARDAR TAREAS EN EL LOCAL 
export function guardarDatos() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}
export function eliminarTarea(id) {
    tareas = tareas.filterW(t => t.id !== id);
    guardarDatos();
}