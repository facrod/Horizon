import { obtenerTareaSolapada } from "./solapamientos.js";
import { renderizarTarea , refrescarDia } from "./render.js";
import { tareas, modificarTarea, cargarTareas } from "./storage.js";

export function inicializarTablero(tablero, diasSemana, seccionDescripcion) {

    tablero.addEventListener("click", (e) => {

        const tarjeta = e.target.closest(".tarjetaI");
        if (!tarjeta) return;

        const tareaId = tarjeta.id;
        const tareaEncontrada = tareas.find(t => t._id === tareaId);
        if (!tareaEncontrada) return;

        // Le "pegamos" el ID al contenedor de la descripción como una etiqueta invisible
        seccionDescripcion.dataset.tareaActivaId = tareaId;
        //si esta visible prendemos(fade-out)
        if (seccionDescripcion.classList.contains("activo")) {

            seccionDescripcion.classList.remove("activo");

            const handler = () => {
                seccionDescripcion.innerHTML = renderizarTarea(tareaEncontrada);
                seccionDescripcion.classList.add("activo");
                setTimeout(() => {
                        seccionDescripcion.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                    }, 300);
                seccionDescripcion.removeEventListener("transitionend", handler);
            };

            seccionDescripcion.addEventListener("transitionend", handler);

        } else {
            // Si estaba apagado, prendemos
            seccionDescripcion.innerHTML = renderizarTarea(tareaEncontrada);
            seccionDescripcion.classList.add("activo");
            setTimeout(() => {
                    seccionDescripcion.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 200);
        }
    });
    tablero.addEventListener("change", (e) => {
        if (!e.target.classList.contains("checkBoxTablero")) return; 

        let idCheckboxTarjeta = e.target.dataset.id;
        let tareaClickeada = tareas.find(t => t._id === idCheckboxTarjeta);
        
        tareaClickeada.estado = !tareaClickeada.estado; 

        modificarTarea(tareaClickeada);
        let idAbierto = seccionDescripcion.dataset.tareaActivaId;
        
        if (seccionDescripcion.classList.contains("activo") && idAbierto === idCheckboxTarjeta) {
            seccionDescripcion.innerHTML = renderizarTarea(tareaClickeada);
        }
    })

    //------------------------------------------FUNCIONALIDAD DROP-----------------------------------
    tablero.addEventListener("dragenter", (e) => {
        let columna = e.target.closest(".columna");
        if (columna) {
            columna.classList.add("drag-over");
        }
    });

    tablero.addEventListener("dragleave", (e) => {
        let columna = e.target.closest(".columna");

        if (columna && !columna.contains(e.relatedTarget)) {
            columna.classList.remove("drag-over");
        }
    });
    tablero.addEventListener("dragstart", (e)=>{
        let tarjetaArrastrada = e.target.dataset.id
        localStorage.setItem("idTarea", JSON.stringify(tarjetaArrastrada))
    })
    tablero.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    tablero.addEventListener("drop", async (e)=>{
        e.preventDefault();

        let article = e.target.closest(".columna");
        
        if (article) {
            article.classList.remove("drag-over");
            let idTarea = JSON.parse(localStorage.getItem("idTarea"))
            let sectionInterno = article.querySelector("section");
            
            let diaId = sectionInterno.id;

            function encontrarDia(diaStringNombre) {
                let numeroDia = 0;
                switch (diaStringNombre) {
                    case "domingo":
                        numeroDia = 0;
                        break;
                    case "lunes":
                        numeroDia = 1;
                        break;
                    case "martes":
                        numeroDia = 2;
                        break;
                    case "miercoles":
                        numeroDia = 3;
                        break;
                    case "jueves":
                        numeroDia = 4;
                        break;
                    case "viernes":
                        numeroDia = 5;
                        break;
                    case "sabado":
                        numeroDia = 6;
                        break;
                }
                let fechaDiaDrop = new Date();
                fechaDiaDrop.setHours(0, 0, 0, 0);
                fechaDiaDrop.setDate(fechaDiaDrop.getDate() + (numeroDia - fechaDiaDrop.getDay()))
                let y = fechaDiaDrop.getFullYear().toString()
                let m = (fechaDiaDrop.getMonth() + 1).toString().padStart(2, '0');
                let d = fechaDiaDrop.getDate().toString().padStart(2, '0');
                let fechaDropeoParseada = `${y}-${m}-${d}`;
                return fechaDropeoParseada
            }
            
            let fechaDropeo = encontrarDia(diaId)
            let tareaEncontrada = tareas.filter(t => t._id == idTarea)
            let fechaVieja = tareaEncontrada[0].dia
            let conflicto = obtenerTareaSolapada(fechaDropeo, tareaEncontrada[0].hora, tareaEncontrada[0].horaFinalizacion,tareaEncontrada[0]._id);
            if (conflicto) {
                    const tarjetaVisual = document.getElementById(idTarea).parentElement;

                    if (tarjetaVisual) {
                        tarjetaVisual.classList.add("shake-error");

                        setTimeout(() => {
                            tarjetaVisual.classList.remove("shake-error");
                        }, 500);
                    }
                    return;
                } 

            tareaEncontrada[0].dia = fechaDropeo
            await modificarTarea(tareaEncontrada[0]);

            refrescarDia(fechaVieja, diasSemana)    
            refrescarDia(fechaDropeo, diasSemana)

            if (seccionDescripcion) {
                seccionDescripcion.innerHTML = renderizarTarea(tareaEncontrada[0]);
            }
            }
    })
//---------------------------------------------------------------------------------------------------
}