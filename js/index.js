//----------------------------------FIN BOTONES HEADER--------------------------------------------------

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
let descripcionTarea = document.getElementById("descripcionTarea");
let btnAgregarTarea = document.getElementById("btnAgregarTarea");
const formAgregar = document.getElementById("agregarTarea");
const diasSemana = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]


//-----------------------------------------FUNCIONES-------------------------------------------------


//RENDERIZAR TAREAS 
function renderizarTareasInicio() {
    tareas.sort((a, b) => a.hora.localeCompare(b.hora)); 
    tareas.forEach(tarea => {
        pintarTarea(tarea)        
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
        <article class="tarjeta" id="${tarea.id}">    
            <h4> Tarea </h4>        
            <p> ${tarea.tarea} </p>
            <h4> Horario </h4>
            <p> ${tarea.hora} </p>
        </article>
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
                <p>${tarjeta.hora}</p>
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

            <input type="submit" id="btnModificar" class="modificarT" value="modificar">
        </form>

        <article class="acciones-descripcion">
            <button class="accion-editar" data-id="${tarjeta.id}">
                <p>editar</p>    
                <img src="img/editar.png" alt="editar">
            </button>
            <button class="accion-eliminar" data-id="${tarjeta.id}">
                <p>eliminar</p>    
                <img src="img/eliminar.png" alt="elimininar">
            </button>
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
//-----------------------------------------------------------------------------------------------------


renderizarTareasInicio()

//--------------------------LOGICA PARA AGREGAR UNA TAREA NUEVA A LA BASE DE DATOS----------------------
let inputs = [nombreTarea, diaTarea, horaTarea];
formAgregar.addEventListener("submit", (e) => {
    e.preventDefault();

    let formularioValido = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.border = "1.5px solid #ff4d4d";
            formularioValido = false;
        } else {
            input.style.border = "none";
        }
    });

    if (!formularioValido) {
        alert("Faltan rellenar campos");
        return;
    }

    let tarea = {
        tarea: nombreTarea.value,
        dia: diaTarea.value,
        hora: horaTarea.value,
        descripcion: descripcionTarea.value,
        estado: false,
        id: Date.now(),
    };
    const existeDuplicado = tareas.some(t => t.dia === tarea.dia && t.hora === tarea.hora);

    if (existeDuplicado) {
        alert("Ya tienes una tarea programada para ese mismo día y hora.");
        return; 
    }

    console.log(taresaSinRepetir)
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

    const tarjeta = e.target.closest(".tarjeta");
    if (!tarjeta) return;

    const tareaId = Number(tarjeta.id);
    const tareaEncontrada = tareas.find(t => t.id === tareaId);
    if (!tareaEncontrada) return;

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
            inputsModificar.classList.add("visible");
            inputsDescripcion.style.display = "none";

            document.getElementById("tareaModificada").value = tar.tarea;
            document.getElementById("descripcionInput").value = tar.descripcion;
            document.getElementById("diaModificado").value = tar.dia;
            document.getElementById("horaModificada").value = tar.hora;
            
            // Guardamos el ID en el form para saber cuál TAREA estamos editando
            inputsModificar.dataset.id = idTarea;

        } else {
            inputsModificar.classList.remove("visible");
            inputsDescripcion.style.display = "block";
        }   
    }

            //ELIMINAR

    if (e.target.closest(".accion-eliminar")) {
        let idTarea = e.target.closest(".accion-eliminar").dataset.id;
        tareas = tareas.filter (t => t.id !== Number(idTarea))        
        guardarDatos()
        const tarjeta = document.getElementById(idTarea);
        if (tarjeta) {
            tarjeta.remove();
        }
        seccionDescripcion.classList.remove("activo");
    }
});


        // EDITAR (FUNCIONALIDAD)
seccionDescripcion.addEventListener("submit", (e) => {
if (e.target.id === "inputsModificar") {
    e.preventDefault(); 

    let idTarea = Number(e.target.dataset.id);
    let tar = tareas.find(t => t.id === idTarea);

    let nuevaFecha = document.getElementById("diaModificado").value;
    let nuevaHora = document.getElementById("horaModificada").value;

    const hayConflicto = tareas.some(t => 
        t.dia === nuevaFecha && 
        t.hora === nuevaHora && 
        t.id !== idTarea // Que no sea la misma que estoy editando
    );

    if (hayConflicto) {
        alert("Ese horario ya está ocupado por otra tarea.");
        return; 
    }

    let fechaVieja = tar.dia;
    
    tar.tarea = document.getElementById("tareaModificada").value;
    tar.descripcion = document.getElementById("descripcionInput").value;
    tar.dia = nuevaFecha;
    tar.hora = nuevaHora;

    tareas.sort((a, b) => a.hora.localeCompare(b.hora));
    guardarDatos();
    
    refrescarDia(fechaVieja); 

    if (fechaVieja !== nuevaFecha) {
        refrescarDia(nuevaFecha); 
    }
    seccionDescripcion.innerHTML = reenderizarTarea(tar);
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

    console.log(tareaEncontrada);
});
//---------------------------------------------------------------------------------------------------


