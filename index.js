//botones header

let botonMostrarDias = document.getElementById('mostrarDias');
const listaDias = document.getElementById('listaDias')

botonMostrarDias.addEventListener("click", ()=>{
    listaDias.classList.toggle("abierto");
})

let btnDesplegar = document.getElementById("btnDesplegar");
let agregarTarea = document.getElementById("agregarTarea");

btnDesplegar.addEventListener("click", ()=>{
    agregarTarea.classList.toggle("activo")
})

//fin botones header

// Logica para agregar una tarea nueva al local storage
let nombreTarea = document.getElementById("nombreTarea");
let diaTarea = document.getElementById("diaTarea");
let horaTarea = document.getElementById("horaTarea");
let descripcionTarea = document.getElementById("descripcionTarea");
let btnAgregarTarea = document.getElementById("btnAgregarTarea");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
const tablero = document.getElementById("tablero");
const seccionDescripcion = document.getElementById("descripcion");

//LOGICA PARA PINTAR TAREAS EN LAS CARDS, YA SEA AL INICIAR LA PAGINA O AL CARGAR
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



btnAgregarTarea.addEventListener("click", (e)=>{
    e.preventDefault()
    if (!diaTarea.value) {
        alert("Seleccioná una fecha");
        return;
    }    
    let tarea = {
        tarea: nombreTarea.value,
        dia: diaTarea.value,
        hora: horaTarea.value,
        descripcion: descripcionTarea.value,
        estado: false,
        id: Date.now(),
    }
    tareas.push(tarea);
    localStorage.setItem("tareas", JSON.stringify(tareas))

    pintarTarea(tarea)

})


//fin logica

//cargado de tareas en el tablero

const diasSemana = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]

tareas.forEach(tarea => {
    pintarTarea(tarea)
});


tablero.addEventListener("click", (e) => {

    const tarjeta = e.target.closest(".tarjeta");
    if (!tarjeta) return;

    const tareaId = Number(tarjeta.id);
    const tareaEncontrada = tareas.find(t => t.id === tareaId);
    if (!tareaEncontrada) return;

    let mensaje = tareaEncontrada.estado ? "Completa" : "Incompleta";
    let diaParseado = tareaEncontrada.dia.split("T");

    const nuevoContenido = `
        <img src="img/cerrar.png" class="cerrar" id="close" alt="cerrar">

        <article class="info-descripcion">
            <h3>${tareaEncontrada.tarea}</h3>
            <p>${tareaEncontrada.descripcion}</p>
        </article>
        <article class="dia-hora-descripcion">
            <p>${diaParseado[0]}</p>
            <p>${tareaEncontrada.hora}</p>
            <p>Estado: ${mensaje}</p>
        </article>
        <article class="acciones-descripcion">
            <button class="accion-editar">
                <p>editar</p>    
                <img src="img/editar.png" alt="editar">
            </button>
            <button class="accion-eliminar">
                <p>eliminar</p>    
                <img src="img/eliminar.png" alt="elimininar">
            </button>
            <label class="custom-checkbox" id="${tareaEncontrada.id}">
                <input type="checkbox" >
                <span class="checkmark"> 
                    <img src="img/checkBlanco.png" alt="completado"> 
                </span>
                Estado
            </label>
        </article>
        `;

    //REPASAR FUERTEMENTE ESTO
    //si esta visible prendemos(fade-out)
    if (seccionDescripcion.classList.contains("activo")) {

        seccionDescripcion.classList.remove("activo");

        const handler = () => {
            seccionDescripcion.innerHTML = nuevoContenido;
            seccionDescripcion.classList.add("activo");
            seccionDescripcion.removeEventListener("transitionend", handler);
        };

        seccionDescripcion.addEventListener("transitionend", handler);

    } else {
        // Si estaba apagado, prendemos
        seccionDescripcion.innerHTML = nuevoContenido;
        seccionDescripcion.classList.add("activo");
    }

});

seccionDescripcion.addEventListener("click", (e) => {
    if (e.target.closest(".cerrar")) {
        seccionDescripcion.classList.remove("activo");
    }
    console.log(e.target)
});
/*
    let tareaClick = document.getElementById(tareas.id)
    const seccionDescripcion = document.getElementById("seccion-descripcion")
    tareaClick.addEventListener("click", ()=>{
        seccionDescripcion.innerHTML = `
            <h3> ${tareas.tarea}

    `

    let estadoCheckbox = document.getElementById("")
    })
    */