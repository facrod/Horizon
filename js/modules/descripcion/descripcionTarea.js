import { tareas, eliminarTarea } from "../storage.js";
import { obtenerLimitesSemanales } from "../calendario.js";
//-----------------------Acciones de la seccion descripcion------------------------------------------

export function inicializarDescripcion(seccionDescripcion) {

    // EVENTO CLICK
    seccionDescripcion.addEventListener("click", (e) => {

        // cerrar
        if (e.target.closest(".cerrar")) {
            seccionDescripcion.classList.remove("activo");
            return;
        }

        // editar
        if (e.target.closest(".accion-editar")) {

            let inputsModificar = document.getElementById("inputsModificar");
            let inputsDescripcion = document.getElementById("seccionDescripcionInfo");

            let idTarea = e.target.closest(".accion-editar").dataset.id;
            let tar = tareas.find(t => t.id == Number(idTarea));

            if (!inputsModificar.classList.contains("visible")) {

                inputsModificar.classList.add("visible");
                inputsDescripcion.classList.add("oculto");

                document.getElementById("tareaModificada").value = tar.tarea;
                document.getElementById("descripcionInput").value = tar.descripcion;
                document.getElementById("diaModificado").value = tar.dia;
                document.getElementById("horaModificada").value = tar.hora;
                document.getElementById("horaTareaFinalizacionModificada").value = tar.horaFinalizacion;

                inputsModificar.dataset.id = idTarea;

            } else {

                inputsModificar.classList.remove("visible");
                inputsDescripcion.classList.remove("oculto");

            }

            let inputModificarDia = document.getElementById("diaModificado");

            if (inputModificarDia) {
                const limites = obtenerLimitesSemanales();
                inputModificarDia.min = limites.min;
                inputModificarDia.max = limites.max;
            }
        }

        // eliminar
        if (e.target.closest(".accion-eliminar")) {

            let mensajeEliminar = document.getElementById("mensajeEliminar");
            mensajeEliminar.classList.add("msjVisible");

        }

        if (e.target.closest(".cerrarModalBorrar")) {

            mensajeEliminar.classList.remove("msjVisible");
            return;

        }

        if (e.target.closest("#btnEliminar")) {

            let tareaCapturadaId = Number(e.target.closest("#btnEliminar").dataset.id);

            eliminarTarea(tareaCapturadaId);

            mensajeEliminar.classList.remove("msjVisible");

            const articleTarea = document.getElementById(tareaCapturadaId);

            if (articleTarea) {
                articleTarea.parentElement.remove();
            }

            seccionDescripcion.classList.remove("activo");

        }

    });

}