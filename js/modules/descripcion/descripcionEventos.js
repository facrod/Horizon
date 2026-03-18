import { obtenerTareaSolapada} from "../solapamientos.js"; 
import { obtenerLimitesSemanales } from "../calendario.js";
import { tareas, guardarDatos, modificarTarea } from "../storage.js";
import { refrescarDia, renderizarTarea } from "../render.js";
import { diasSemana } from "../utils.js";

export function inicializarDescripcionEventos (seccionDescripcion) {
    seccionDescripcion.addEventListener("change", (e) => {
                     //LOGICA DE HORARIOS EN EDITAR
        // Corregir limites del calendario al cambiar el dia
        let inputModificarDia = document.getElementById("diaModificado");
        if (inputModificarDia) {
            const limites = obtenerLimitesSemanales();
            inputModificarDia.min = limites.min;
            inputModificarDia.max = limites.max;
        }

        // Sincronizar hora de inicio con hora de fin
        if (e.target.id === "horaModificada") {
            let horaFinalizacionModificada = document.getElementById("horaTareaFinalizacionModificada");
            if (horaFinalizacionModificada) {
                horaFinalizacionModificada.value = e.target.value;
            }
        }

        // Validar solapamiento de horas (Inicio < Fin)
        if (e.target.id === "horaTareaFinalizacionModificada" || e.target.id === "horaModificada") {
            let msjError = document.getElementById("errorHoraModf");
            let horaInicioMod = document.getElementById("horaModificada");
            let horaFinalizacionMod = document.getElementById("horaTareaFinalizacionModificada");

            if (horaInicioMod && horaFinalizacionMod && msjError) {
                if (horaInicioMod.value >= horaFinalizacionMod.value) {
                    msjError.style.display = "block";
                } else {
                    msjError.style.display = "none";
                }
            }
        }
    });

            // EDITAR (FUNCIONALIDAD)

    seccionDescripcion.addEventListener("submit", async (e) => {
        if (e.target.id === "inputsModificar") {
            e.preventDefault(); 
            let idTarea = e.target.dataset.id;
            let tar = tareas.find(t => t._id === idTarea);

            let nuevaFecha = document.getElementById("diaModificado").value;
            let nuevaHoraInicio = document.getElementById("horaModificada").value;
            let nuevaHoraFinalizacion = document.getElementById("horaTareaFinalizacionModificada").value

            const conflictoEdicion = obtenerTareaSolapada(nuevaFecha, nuevaHoraInicio, nuevaHoraFinalizacion, idTarea);

            if (conflictoEdicion) {
                alert(`No puedes mover la tarea aquí. Choca con: "${conflictoEdicion.tarea}"`);
                return;
            }

            let fechaVieja = tar.dia;
            
            let msjError = document.getElementById("errorHoraModf");
            if (msjError.style.display == "block") {
                msjError.scrollIntoView({
                    behavior: 'smooth', 
                    block: 'center'    
                })
                return;
            }
            tar.tarea = document.getElementById("tareaModificada").value;
            tar.descripcion = document.getElementById("descripcionInput").value;
            tar.dia = nuevaFecha;
            tar.hora = nuevaHoraInicio;
            tar.horaFinalizacion = nuevaHoraFinalizacion

            tareas.sort((a, b) => a.hora.localeCompare(b.hora));
            console.log(tar)
            await modificarTarea(tar);
        
            refrescarDia(fechaVieja, diasSemana); 

            if (fechaVieja !== nuevaFecha) {
                refrescarDia(nuevaFecha, diasSemana); 
            }
            
            setTimeout(() => {
                    seccionDescripcion.style.opacity = "0";
                    
                    setTimeout(() => {
                        seccionDescripcion.innerHTML = renderizarTarea(tar);
                        seccionDescripcion.style.opacity = "1";
                    }, 200);
                }, 300);
        }
    });

            // CHECKBOX 
    seccionDescripcion.addEventListener("change", async (e) => {
        if (!e.target.matches('input[type="checkbox"]')) return;

        const label = e.target.closest(".custom-checkbox");
        const tareaEncontrada = tareas.find(t => t._id === label.dataset.id);
        if (!tareaEncontrada) return;

        tareaEncontrada.estado = e.target.checked;

        await modificarTarea(tareaEncontrada)
        let msjEstado = document.getElementsByClassName("estadoMsj")
        if (e.target.checked) {
            msjEstado[0].textContent = "Estado: Completa";
        } else {
            msjEstado[0].textContent = "Estado: Incompleta";
        }
        const checkboxTablero = document.querySelector(`.checkBoxTablero[data-id="${tareaEncontrada._id}"]`);
        
        if (checkboxTablero) {
            // Le pasamos el mismo estado (true/false) que tiene el de la descripción
            checkboxTablero.checked = e.target.checked;
        }
    });
};



