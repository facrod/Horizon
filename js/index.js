import { obtenerLimitesSemanales, establecerLimitesCalendario } from "./modules/calendario.js";
import { inicializarHeaderUI } from "./modules/headerUI.js";
import { tareas, guardarDatos} from "./modules/storage.js";
import { 
    renderizarTareasInicio,
} from "./modules/render.js";
import { inicializarTablero } from "./modules/tablero.js";
import { renderizadoEstilosInicial, inicializarEstilos } from "./modules/estilos.js";
import { diasSemana } from "./modules/utils.js";
import { inicializarFormulario } from "./modules/formTareas.js";

import { inicializarDescripcion } from "./modules/descripcion/descripcionTarea.js";
import { inicializarDescripcionEventos } from "./modules/descripcion/descripcionEventos.js";
//-----------------------------------------------------------------------------------------------------
const mainEstilos = document.getElementById("mainEstilos");
const headerEstilos = document.getElementById("headerEstilos");
const footerEstilos = document.getElementById("footerEstilos");
const columnasEstilos = document.querySelectorAll(".columna");

function inicializarApp() {
    if (tareas.length === 0) {
        const limites = obtenerLimitesSemanales(); 
        
        const bienvenida = {
            tarea: "¡Bienvenido a Horizon! 🚀 Clickeame para más información.",
            dia: limites.min, 
            hora: "09:00",
            horaFinalizacion: "10:00",
            descripcion: "Buenas! soy HORIZON, tu calendario semanal. Planifica tus tareas para tener una vida más organizada. Puedes añadir una tarea nueva con sus respectivos detalles (hora de inicio, hora de finalización, descripción, día). Al clickear esta nueva tarea puedes editarla, eliminarla y marcarla como terminada. Crea una tarea y comencemos!",
            estado: false,
            id: Date.now()
        };
        
        tareas.push(bienvenida);
        guardarDatos();
    }

    // Ejecutamos los procesos iniciales
    renderizarTareasInicio(diasSemana);
}

inicializarApp();


inicializarHeaderUI();

const formAgregar = document.getElementById("agregarTarea");
renderizadoEstilosInicial(mainEstilos, headerEstilos, footerEstilos, columnasEstilos, formAgregar)

inicializarEstilos(formAgregar)
//-------------------------------FORMULARIO PARA CARGAR TAREAS-----------------------------------------
inicializarFormulario();
//------------------------------------------------------------------------------------------------

//------------------------------CARGADO DE TAREAS EN EL TABLERO------------------------------------------
const tablero = document.getElementById("tablero");
const seccionDescripcion = document.getElementById("descripcion");
inicializarTablero(tablero, diasSemana, seccionDescripcion);
//---------------------------------------------------------------------------------------------------

inicializarDescripcion(seccionDescripcion);
inicializarDescripcionEventos(seccionDescripcion);

