export function obtenerLimitesSemanales() {
    let hoy = new Date();
    let diaActual = hoy.getUTCDay();
    let diferenciaAlLunes = (diaActual === 0) ? 6 : diaActual - 1;

    let lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - diferenciaAlLunes);

    let domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);

    function formatear(fecha) {
        let d = fecha.getDate().toString().padStart(2, '0');
        let m = (fecha.getMonth() + 1).toString().padStart(2, '0');
        let y = fecha.getFullYear();
        return y + "-" + m + "-" + d;
    }

    return { 
        min: formatear(lunes), 
        max: formatear(domingo) 
    };
}

export function establecerLimitesCalendario(diaTarea) {
    const limites = obtenerLimitesSemanales();
    diaTarea.min = limites.min;
    diaTarea.max = limites.max;
}
