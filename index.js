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

const diasSemana = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]

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


let inputs = [nombreTarea, diaTarea, horaTarea, descripcionTarea];

btnAgregarTarea.addEventListener("click", (e) => {
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
        alert("Faltan rellenar campos")
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

    tareas.push(tarea);
    localStorage.setItem("tareas", JSON.stringify(tareas));

    pintarTarea(tarea);

    inputs.forEach(input => {
        input.value = "";
        input.style.border = "none"; 
    });
    
    agregarTarea.classList.remove("activo");
    
});


//fin logica

//cargado de tareas en el tablero


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
                <input type="text" id="tarea" class="modificarT" hidden>
            <p>${tareaEncontrada.descripcion}</p>
                <input type="text" id="descripcionInput" class="modificarT" hidden>
            </article>
        <article class="dia-hora-descripcion">
            <p>${diaParseado[0]}</p>
                <input type="date" id="dia" class="modificarT" hidden>
            <p>${tareaEncontrada.hora}</p>
                <input type="time" id="hora" class="modificarT" hidden>
            <p>Estado: ${mensaje}</p>
        </article>
        <article class="acciones-descripcion">
            <button class="accion-editar" data-id="${tareaEncontrada.id}">
                <p>editar</p>    
                <img src="img/editar.png" alt="editar">
            </button>
            <button class="accion-eliminar" data-id="${tareaEncontrada.id}">
                <p>eliminar</p>    
                <img src="img/eliminar.png" alt="elimininar">
            </button>
            <label class="custom-checkbox" data-id="${tareaEncontrada.id}">
                <input type="checkbox" ${tareaEncontrada.estado ? "checked" : ""}>
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
        seccionDescripcion.innerHTML = nuevoContenido;
        seccionDescripcion.classList.add("activo");
        setTimeout(() => {
                seccionDescripcion.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 200);

    }

});

seccionDescripcion.addEventListener("click", (e) => {
    if (e.target.closest(".cerrar")) {
        seccionDescripcion.classList.remove("activo");
        return;
    }

            // EDITAR

    if (e.target.closest(".accion-editar")) {
        let idTarea = e.target.closest(".accion-editar").dataset.id;
        let tar = tareas.find(t => t.id == Number(idTarea));
        let elemento = document.getElementsByClassName("modificarT")

        for (let index = 0; index < elemento.length; index++) {
            //let elementoAnterior = document.getElementsByClassName("modificarT")[index].previousElementSibling
            elemento[index].previousElementSibling.hidden = true
            elemento[index].removeAttribute("hidden")
            //elemento[index].value = elementoAnterior.innerHTML
            switch (elemento[index].id) {
                case "tarea":
                        elemento[index].value = tar.tarea
                    break;
                case "descripcionInput":
                        elemento[index].value = tar.descripcion
                break
                case "dia":
                        elemento[index].value = tar.dia
                break;
                case "hora":
                        elemento[index].value = tar.hora
                    break;
                default:
                    break;
            }
        }
        
    
        //ELIMINAR
    }
    if (e.target.closest(".accion-eliminar")) {
        let idTarea = e.target.closest(".accion-eliminar").dataset.id;
        tareas = tareas.filter (t => t.id !== Number(idTarea))        
        localStorage.setItem("tareas", JSON.stringify(tareas));

        const tarjeta = document.getElementById(idTarea);
        if (tarjeta) {
            tarjeta.remove();
        }
        seccionDescripcion.classList.remove("activo");
    }
});

seccionDescripcion.addEventListener("change", (e) => {
    if (!e.target.matches('input[type="checkbox"]')) return;

    const label = e.target.closest(".custom-checkbox");
    const tareaEncontrada = tareas.find(t => t.id === Number(label.dataset.id));
    if (!tareaEncontrada) return;

    tareaEncontrada.estado = e.target.checked;

    localStorage.setItem("tareas", JSON.stringify(tareas));

    console.log(tareaEncontrada);
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