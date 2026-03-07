//GUARDAR TAREAS EN EL LOCAL 
export let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

export function guardarDatos() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}
export function eliminarTarea(id) {
    tareas = tareas.filter(t => t.id !== id);
    guardarDatos();
}