import { tareas } from "./storage.js";
// Función para convertir HH:mm a minutos (Número)
export function horaAMinutos(horaStr) {
    if (!horaStr) return 0;
    const partes = horaStr.split(':'); 
    const h = Number(partes[0]);        
    const m = Number(partes[1]);        
    return (h * 60) + m;               
}

// Función para detectar solapamientos
export function obtenerTareaSolapada(dia, inicio, fin, idActual = null) {
    const nuevaInicio = horaAMinutos(inicio);
    const nuevaFin = horaAMinutos(fin);
    return tareas.find( t => {
        if (t.dia !== dia) {
            return false;
        }

        if (idActual && t._id === idActual) {
            return false;
        }

        const exInicio = horaAMinutos(t.hora);
        const exFin = horaAMinutos(t.horaFinalizacion);


        return nuevaInicio < exFin && nuevaFin > exInicio;
    });
}