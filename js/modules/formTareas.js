import { tareas, guardarDatos } from "./storage.js";
import { obtenerTareaSolapada } from "./solapamientos.js";
import { establecerLimitesCalendario } from "./calendario.js";
import { refrescarDia } from "./render.js";
import { diasSemana } from "./utils.js";

export function inicializarFormulario() {
    let diaTarea = document.getElementById("diaTarea");
    establecerLimitesCalendario(diaTarea);
    let nombreTarea = document.getElementById("nombreTarea");
    let horaTarea = document.getElementById("horaTarea");
    let horaTareaFinalizacion = document.getElementById("horaTareaFinalizacion");
    let descripcionTarea = document.getElementById("descripcionTarea");

    const formAgregar = document.getElementById("agregarTarea");
    let inputs = [nombreTarea, diaTarea, horaTarea];

    formAgregar.addEventListener("input", (e) => {
        const errorSpan = document.getElementById("errorHora");

        if (e.target.closest("#horaTarea")) {
            horaTareaFinalizacion.value = horaTarea.value;
        }
        if (horaTareaFinalizacion.value && horaTarea.value) {
            if (horaTareaFinalizacion.value <= horaTarea.value) {
                errorSpan.style.display = "block";
            } else {
                errorSpan.style.display = "none";
            }
        }

    });

    formAgregar.addEventListener("submit", async (e) => {

        e.preventDefault();

        let formularioValido = true;
        const msjErrorFormulario = document.getElementById("errorFormulario");

        const errorSpan = document.getElementById("errorHora");
        if (errorSpan.style.display === "block") {
            errorSpan.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            return;
        }

        inputs.forEach(input => {

            if (!input.value.trim()) {
                input.style.border = "1.5px solid #ff4d4d";
                formularioValido = false;
            } else {
                input.style.border = "none";
                msjErrorFormulario.style.display = "none";
            }

        });

        if (!formularioValido) {
            msjErrorFormulario.style.display = "block";
            return;
        }

        const tarea = {
            tarea: nombreTarea.value,
            dia: diaTarea.value,
            hora: horaTarea.value,
            horaFinalizacion: horaTareaFinalizacion.value,
            descripcion: descripcionTarea.value,
            estado: false,
        };
        const conflicto = obtenerTareaSolapada(
            tarea.dia,
            tarea.hora,
            tarea.horaFinalizacion
        );

        if (conflicto) {
            alert(`¡Conflicto! Este horario ya está ocupado por: "${conflicto.tarea}" (${conflicto.hora} - ${conflicto.horaFinalizacion})`);
            return;
        }
        const resultado = await guardarDatos(tarea);
        if(resultado && resultado.ok) {
            tareas.sort((a, b) => a.hora.localeCompare(b.hora));

            refrescarDia(tarea.dia, diasSemana);
            
            formAgregar.reset();
            formAgregar.classList.remove("activo");
            msjErrorFormulario.style.display = "none";           
        } else {
            console.log(resultado)
            alert("No se pudo guardar la tarea en el servidor.");
        }
    });

}