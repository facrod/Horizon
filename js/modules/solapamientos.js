import { tareas } from "./storage.js";
// Función para convertir HH:mm a minutos (Número)
export function horaAMinutos(horaStr) {
    if (!horaStr) return 0;
    const partes = horaStr.split(':'); // Ejemplo: ["09", "30"]
    const h = Number(partes[0]);        // 9
    const m = Number(partes[1]);        // 30
    return (h * 60) + m;                // 540 + 30 = 570
}

// Función para detectar solapamientos
export function obtenerTareaSolapada(dia, inicio, fin, idActual = null) {
    //Convertimos las horas de la tarea que queremos agregar/editar a minutos
    const nuevaInicio = horaAMinutos(inicio);
    const nuevaFin = horaAMinutos(fin);
    // Buscamos dentro del array tareas
    return tareas.find( t => {
        // Si no es el mismo día, no hay choque posible, pasamos a la siguiente
        if (t.dia !== dia) {
            return false;
        }

        // Si el ID coincide con idActua', es la misma tarea que estamos editando.
        // La ignoramos para que no choque contra sí misma.
        if (idActual && t.id === idActual) {
            return false;
        }

        //Convertimos las horas de la tarea que ya estaba guardada
        const exInicio = horaAMinutos(t.hora);
        const exFin = horaAMinutos(t.horaFinalizacion);


        // Si la nueva empieza antes de que termine la vieja y la nueva termina después de que empiece la vieja se cruzan 
        return nuevaInicio < exFin && nuevaFin > exInicio;
    });
}