//----------------------------------BOTONES HEADER--------------------------------------------------

let botonMostrarDias = document.getElementById('mostrarDias');
const listaDias = document.getElementById('listaDias')

botonMostrarDias.addEventListener("click", (e)=>{
    e.stopPropagation()
    listaDias.classList.toggle("abierto");
})

let btnDesplegar = document.getElementById("btnDesplegar");
let agregarTarea = document.getElementById("agregarTarea");

btnDesplegar.addEventListener("click", (e)=>{
    e.stopPropagation()
    agregarTarea.classList.toggle("activo")
})
document.addEventListener("click", (e) => {
    if (!botonMostrarDias.contains(e.target) && !listaDias.contains(e.target)) {
        listaDias.classList.remove("abierto");
    }

    if (!btnDesplegar.contains(e.target) && !agregarTarea.contains(e.target)) {
        agregarTarea.classList.remove("activo");
    }
});
//-----------------------------------------------------------------------------------------------------

//TRAIGO DATOS DEL LOCAL

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

// Capturo datos que me llegan del formulario para agregar una tarea nueva
let nombreTarea = document.getElementById("nombreTarea");
let diaTarea = document.getElementById("diaTarea");
let horaTarea = document.getElementById("horaTarea");
let horaTareaFinalizacion = document.getElementById("horaTareaFinalizacion")
let descripcionTarea = document.getElementById("descripcionTarea");
let btnAgregarTarea = document.getElementById("btnAgregarTarea");
const formAgregar = document.getElementById("agregarTarea");
const diasSemana = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]


//-----------------------------------------FUNCIONES-------------------------------------------------
function obtenerLimitesSemanales() {
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

function establecerLimitesCalendario() {
    const limites = obtenerLimitesSemanales();
    diaTarea.min = limites.min;
    diaTarea.max = limites.max;
}

//RENDERIZAR TAREAS 
function renderizarTareasInicio() {
    // Ordenamos 
    tareas.sort((a, b) => {
        return a.hora.localeCompare(b.hora);
    });

    // Obtenemos los límites de nuevo para filtrar
    let hoy = new Date();
    let diaActual = hoy.getUTCDay();
    let diferenciaAlLunes = (diaActual === 0) ? 6 : diaActual - 1;
    
    let lunes = new Date(hoy);
    lunes.setHours(0,0,0,0);
    lunes.setDate(hoy.getDate() - diferenciaAlLunes);

    let domingo = new Date(lunes);
    domingo.setHours(23,59,59,999);
    domingo.setDate(lunes.getDate() + 6);

    // 3. Filtramos y pintamos
    tareas.filter( t => {
        let fechaTarea = new Date(t.dia.replace(/-/g, '\/'));
        return fechaTarea >= lunes && fechaTarea <= domingo;
    }).forEach(function(t) {
        pintarTarea(t);        
    });
}
//GUARDAR TAREAS EN EL LOCAL 

function guardarDatos() {
    localStorage.setItem("tareas", JSON.stringify(tareas));

}
//FUNCION PARA PINTAR UNA TAREA
function pintarTarea(tarea) {
    let dia = new Date(tarea.dia)
    let diaIndex = dia.getUTCDay()
    let diaSection = document.getElementById(diasSemana[diaIndex])

    diaSection.innerHTML += `
    <section class="tarjeta" data-id="${tarea.id}">
        <article class="tarjetaI" id="${tarea.id}">    
            <h4> Tarea </h4>        
            <p> ${tarea.tarea} </p>
            <h4> Horario </h4>
            <p> ${tarea.hora} </p>
        </article>
        <label class="labelTarjetaTablero">
            <input type="checkbox"data-id="${tarea.id}" ${tarea.estado ? "checked" : ""} class="checkBoxTablero">
            <img src="img/checkBlanco.png" alt="completado" class="imgCheckTablero"> 
        </label>
    </section>
    `
}
//PINTAR TAREA NUEVA O MODIFICADA
function refrescarDia(diaString) {

    let dia = new Date(diaString);
    let diaIndex = dia.getUTCDay();
    let idSeccion = diasSemana[diaIndex];

    const section = document.getElementById(idSeccion);
    if (!section) return;

    section.innerHTML = "";

    tareas.filter(t => {
            let d = new Date(t.dia);
            return d.getUTCDay() === diaIndex;
        })
        .forEach(t => pintarTarea(t));
}
//REFRESCAR DESCRIPCION Y REENDERIZAR
function reenderizarTarea(tarjeta) {
    let nuevoContenido = `
        <img src="img/cerrar.png" class="cerrar" id="close" alt="cerrar">
        
        <section id="seccionDescripcionInfo">
            <article class="info-descripcion">
                <h3>${tarjeta.tarea}</h3>
                <p>${tarjeta.descripcion}</p>    
            </article>
            <article class="dia-hora-descripcion">
                <p>${tarjeta.dia}</p>
                <p>Inicio: ${tarjeta.hora}</p>
                <p>Fin: ${tarjeta.horaFinalizacion}
                <p class="estadoMsj">Estado: ${tarjeta.estado ? "Completa" : "incompleta"}</p>
            </article>
        </section>

        <form id="inputsModificar" >
            <label for="tareaModificada">Tarea</label>
            <input type="text" id="tareaModificada" class="modificarT">

            <label for="descripcionInput">Descripción</label>
            <textarea id="descripcionInput" class="modificarT" cols="30" rows="10"></textarea>

            <label for="diaModificado">Fecha</label>
            <input type="date" id="diaModificado" class="modificarT">

            <label for="horaModificada">Hora</label>
            <input type="time" id="horaModificada" class="modificarT">

            <label for="horaTareaFinalizacionModificada">Hora de finalización</label>
            <input type="time" id="horaTareaFinalizacionModificada">
            <span id="errorHoraModf">La hora de fin debe ser posterior a la de inicio</span>
            
            <input type="submit" id="btnModificar" class="modificarT" value="modificar">
        </form>

        <article class="acciones-descripcion">
            <button class="accion-editar" data-id="${tarjeta.id}">
                <p>editar</p>    
                <img src="img/editarBlanco.png" alt="editar">
            </button>
            <button class="accion-eliminar">
                <p>eliminar</p>    
                <img src="img/eliminarBlanco.png" alt="elimininar">
            </button>
            <section id="mensajeEliminar">
                    <button class="cerrarModalBorrar" > <img src="img/cerrar.png" alt="cerrar"></button>
                    <p>Estas seguro que quieres eliminar la tarea?</P>
                    <button class="eliminarBtn" id="btnEliminar" data-id="${tarjeta.id}">eliminar</button>
            </section>
            <label class="custom-checkbox" data-id="${tarjeta.id}">
                <input type="checkbox" ${tarjeta.estado ? "checked" : ""}>
                <span class="checkmark"> 
                    <img src="img/checkBlanco.png" alt="completado"> 
                </span>
                Estado
            </label>
        </article>
        `;
        return nuevoContenido;
}
// Función para convertir HH:mm a minutos (Número)
function horaAMinutos(horaStr) {
    if (!horaStr) return 0;
    const partes = horaStr.split(':'); // Ejemplo: ["09", "30"]
    const h = Number(partes[0]);        // 9
    const m = Number(partes[1]);        // 30
    return (h * 60) + m;                // 540 + 30 = 570
}

// Función para detectar solapamientos
function obtenerTareaSolapada(dia, inicio, fin, idActual = null) {
    //Convertimos las horas de la tarea que queremos agregar/editar a minutos
    const nuevaInicio = horaAMinutos(inicio);
    const nuevaFin = horaAMinutos(fin);

    // Buscamos dentro del array tareas
    return tareas.find(function(t) {
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
//-----------------------------------------------------------------------------------------------------

establecerLimitesCalendario();
renderizarTareasInicio()

//--------------------------LOGICA PARA AGREGAR UNA TAREA NUEVA A LA BASE DE DATOS----------------------
let inputs = [nombreTarea, diaTarea, horaTarea];
/* */
formAgregar.addEventListener("input", (e) => { 
    
    if (e.target.closest("#horaTarea")) {
        horaTareaFinalizacion.value = horaTarea.value;
    }

    const errorSpan = document.getElementById("errorHora");

    if (horaTareaFinalizacion.value && horaTarea.value) {
        if (horaTareaFinalizacion.value <= horaTarea.value) {
            errorSpan.style.display = "block";
        } else {
            errorSpan.style.display = "none";
        }
    }
});

formAgregar.addEventListener("submit", (e) => {
    e.preventDefault();

    let formularioValido = true;
    const msjErrorFormulario = document.getElementById("errorFormulario")

    const errorSpan = document.getElementById("errorHora");
    if (errorSpan.style.display === "block") {
        errorSpan.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'     
        })
        return
    }

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.border = "1.5px solid #ff4d4d";
            formularioValido = false;
        } else {
            input.style.border = "none";
            msjErrorFormulario.style.display = "none"
        }
    });
    if (!formularioValido) {
        msjErrorFormulario.style.display = "block"
        return;
    }

    let tarea = {
        tarea: nombreTarea.value,
        dia: diaTarea.value,
        hora: horaTarea.value,
        horaFinalizacion: horaTareaFinalizacion.value,
        descripcion: descripcionTarea.value,
        estado: false,
        id: Date.now(),
    };
    const existeDuplicado = tareas.some(t => t.dia === tarea.dia && t.hora === tarea.hora);

    if (existeDuplicado) {
        alert("Ya tienes una tarea programada para ese mismo día y hora.");
        return; 
    }
    const conflicto = obtenerTareaSolapada(tarea.dia, tarea.hora, tarea.horaFinalizacion);
    if (conflicto) {
        alert(`¡Conflicto! Este horario ya está ocupado por: "${conflicto.tarea}" (${conflicto.hora} - ${conflicto.horaFinalizacion})`);
        return;
    }
    tareas.push(tarea);
    tareas.sort((a, b) => a.hora.localeCompare(b.hora)); 
    guardarDatos()
    refrescarDia(tarea.dia); 

    formAgregar.reset(); 
    agregarTarea.classList.remove("activo");
    

});
//-------------------------------------------------------------------------------------------------------

//------------------------------CARGADO DE TAREAS EN EL TABLERO------------------------------------------
const tablero = document.getElementById("tablero");
const seccionDescripcion = document.getElementById("descripcion");

tablero.addEventListener("click", (e) => {

    const tarjeta = e.target.closest(".tarjetaI");
    if (!tarjeta) return;

    const tareaId = Number(tarjeta.id);
    const tareaEncontrada = tareas.find(t => t.id === tareaId);
    if (!tareaEncontrada) return;

    // Le "pegamos" el ID al contenedor de la descripción como una etiqueta invisible
    seccionDescripcion.dataset.tareaActivaId = tareaId;
    //REPASAR FUERTEMENTE ESTO
    //si esta visible prendemos(fade-out)
    if (seccionDescripcion.classList.contains("activo")) {

        seccionDescripcion.classList.remove("activo");

        const handler = () => {
            seccionDescripcion.innerHTML = reenderizarTarea(tareaEncontrada);
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
        seccionDescripcion.innerHTML = reenderizarTarea(tareaEncontrada);
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

    let idCheckboxTarjeta = Number(e.target.dataset.id);
    let tareaClickeada = tareas.find(t => t.id === idCheckboxTarjeta);
    
    tareaClickeada.estado = !tareaClickeada.estado; 
    
    guardarDatos();
    let idAbierto = Number(seccionDescripcion.dataset.tareaActivaId);
    
    if (seccionDescripcion.classList.contains("activo") && idAbierto === idCheckboxTarjeta) {
        // Re-renderizamos la descripción para que cambie el texto e ícono al instante
        seccionDescripcion.innerHTML = reenderizarTarea(tareaClickeada);
    }
    })
//---------------------------------------------------------------------------------------------------


//-----------------------Acciones de la seccion descripcion------------------------------------------
seccionDescripcion.addEventListener("click", (e) => {

            // CERRAR DESCRIPCION
    if (e.target.closest(".cerrar")) {
        seccionDescripcion.classList.remove("activo");
        return;
    }

            // EDITAR (ABRE LA SECCIÓN PARA MODIFICAR)

    if (e.target.closest(".accion-editar")) {
        let inputsModificar = document.getElementById("inputsModificar");
        let inputsDescripcion = document.getElementById("seccionDescripcionInfo");
        let idTarea = e.target.closest(".accion-editar").dataset.id;
        let tar = tareas.find(t => t.id == Number(idTarea));

        if (!inputsModificar.classList.contains("visible")) {
            inputsModificar.classList.add("visible")
            inputsDescripcion.classList.add("oculto")

            document.getElementById("tareaModificada").value = tar.tarea;
            document.getElementById("descripcionInput").value = tar.descripcion;
            document.getElementById("diaModificado").value = tar.dia;
            document.getElementById("horaModificada").value = tar.hora;
            document.getElementById("horaTareaFinalizacionModificada").value = tar.horaFinalizacion;
            // Guardamos el ID en el form para saber cuál TAREA estamos editando
            inputsModificar.dataset.id = idTarea;
        } else {
            inputsModificar.classList.remove("visible");
            inputsDescripcion.classList.remove("oculto")
        }
        //logica calendario filtrado por semana
        let inputModificarDia = document.getElementById("diaModificado");
        if (inputModificarDia) {
            const limites = obtenerLimitesSemanales(); 
            inputModificarDia.min = limites.min;
            inputModificarDia.max = limites.max;
        }
    }

    

            //ELIMINAR

    if (e.target.closest(".accion-eliminar")) {
        let mensajeEliminar = document.getElementById("mensajeEliminar")
        mensajeEliminar.classList.add("msjVisible")
    }
    if (e.target.closest(".cerrarModalBorrar")) {
        mensajeEliminar.classList.remove("msjVisible")
        return;
    }
    if (e.target.closest("#btnEliminar")) {
        let tareaCapturadaId = Number(e.target.closest("#btnEliminar").dataset.id)
        tareas = tareas.filter (t => t.id !== tareaCapturadaId)  
        guardarDatos()
        mensajeEliminar.classList.remove("msjVisible")
        const articleTarea = document.getElementById(tareaCapturadaId);
        if (articleTarea) {
            articleTarea.parentElement.remove();
        }
        seccionDescripcion.classList.remove("activo");
    }
        /*
        let idTarea = e.target.closest(".accion-eliminar").dataset.id;
        tareas = tareas.filter (t => t.id !== Number(idTarea))        
        guardarDatos()
        const articleTarea = document.getElementById(idTarea);
        if (articleTarea) {
            articleTarea.parentElement.remove();
        }
        seccionDescripcion.classList.remove("activo");
        */
    
});


    //LOGICA DE HORARIOS EN EDITAR
seccionDescripcion.addEventListener("change", (e)=>{
    let inputModificarDia = document.getElementById("diaModificado");
    if(inputModificarDia) {
        inputModificarDia.min = formatear(lunes);
        inputModificarDia.max = formatear(domingo);
    }
    if (e.target.closest("#horaModificada")) {
        let horaFinalizacionModificada = document.getElementById("horaTareaFinalizacionModificada")
        horaFinalizacionModificada.value = e.target.closest("#horaModificada").value
    }
    if (e.target.closest("#horaTareaFinalizacionModificada")) {
        let msjError = document.getElementById("errorHoraModf");
        let horaFinalizacionMod = e.target.closest("#horaTareaFinalizacionModificada")
        let horaInicioMod = document.getElementById("horaModificada")
        if (horaInicioMod.value >= horaFinalizacionMod.value) {
            msjError.style.display = "block"
            console.log("error")
        } else {
            msjError.style.display = "none";
        }
    }
})

        // EDITAR (FUNCIONALIDAD)

seccionDescripcion.addEventListener("submit", (e) => {
    if (e.target.id === "inputsModificar") {
        e.preventDefault(); 
        let idTarea = Number(e.target.dataset.id);
        let tar = tareas.find(t => t.id === idTarea);

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
        guardarDatos();
        
        refrescarDia(fechaVieja); 

        if (fechaVieja !== nuevaFecha) {
            refrescarDia(nuevaFecha); 
        }
        
        setTimeout(() => {
                seccionDescripcion.style.opacity = "0";
                
                setTimeout(() => {
                    seccionDescripcion.innerHTML = reenderizarTarea(tar);
                    seccionDescripcion.style.opacity = "1";
                }, 200);
            }, 300);
    }
});

        // CHECKBOX 
seccionDescripcion.addEventListener("change", (e) => {
    if (!e.target.matches('input[type="checkbox"]')) return;

    const label = e.target.closest(".custom-checkbox");
    const tareaEncontrada = tareas.find(t => t.id === Number(label.dataset.id));
    if (!tareaEncontrada) return;

    tareaEncontrada.estado = e.target.checked;

    guardarDatos()
    let msjEstado = document.getElementsByClassName("estadoMsj")
    if (e.target.checked) {
        msjEstado[0].textContent = "Estado: Completa";
    } else {
        msjEstado[0].textContent = "Estado: Incompleta";
    }
    const checkboxTablero = document.querySelector(`.checkBoxTablero[data-id="${tareaEncontrada.id}"]`);
    
    if (checkboxTablero) {
        // Le pasamos el mismo estado (true/false) que tiene el de la descripción
        checkboxTablero.checked = e.target.checked;
    }
});
//---------------------------------------------------------------------------------------------------


