import { estaLogueado } from "../modules/login-registro.js";

if (!estaLogueado()) {
    // Si no tiene token, al login
    window.location.href = "./login.html"; 
}
import { cargarTareasEliminadas, activarTarea } from "../modules/storage.js";
import { cargarUsuario, editarUsuario } from "../modules/storageUser.js";

function renderizar(array, main) {
    array.forEach(tarea => {
    main.innerHTML += `
    <section class="tarjeta" data-id="${tarea._id}">
        <h4> Tarea </h4>        
        <p> ${tarea.tarea} </p>
        <h4> Horario </h4>
        <p> ${tarea.hora} </p>
        <button> Recuperar </button>
    </section>
    `    
});
}
const mainEstilos = document.getElementById("mainEstilos");
const headerEstilos = document.getElementById("headerEstilos");
const footerEstilos = document.getElementById("footerEstilos")
const usuario = await cargarUsuario()

let estiloPagina = usuario.data.result.tema
if (estiloPagina == "whiteMode") {
    mainEstilos.classList.add("whiteMode")
    headerEstilos.classList.add("whiteMode")
    footerEstilos.classList.add("whiteMode")    
} else {
    mainEstilos.classList.remove("whiteMode")
    headerEstilos.classList.remove("whiteMode")
    footerEstilos.classList.remove("whiteMode")    
}

let botonesDark = document.getElementById("darkMode")
let botonesWhite = document.getElementById("whiteMode")
let botonesEstilos = document.getElementById("toogle")



botonesEstilos.addEventListener("click", async (e)=>{
    if (e.target.closest("#darkMode")) {
        botonesWhite.classList.remove("activo")
        botonesDark.classList.toggle("activo")
        let estiloPagina = { tema: "darkMode" };
        await editarUsuario(estiloPagina)
        if (mainEstilos.classList.contains("whiteMode")) {
            mainEstilos.classList.remove("whiteMode")
            headerEstilos.classList.remove("whiteMode")
            footerEstilos.classList.remove("whiteMode")
        }
    }
    if (e.target.closest("#whiteMode")) {
        botonesDark.classList.remove("activo")
        botonesWhite.classList.toggle("activo")
        let estiloPagina = { tema: "whiteMode" };
        await editarUsuario(estiloPagina)
        if (!mainEstilos.classList.contains("whiteMode")) {
            mainEstilos.classList.add("whiteMode")
            headerEstilos.classList.add("whiteMode")
            footerEstilos.classList.add("whiteMode")
        }        

    }
})
document.addEventListener("click", (e)=>{
    if (!botonesDark.contains(e.target) && !botonesWhite.contains(e.target)) {
        botonesWhite.classList.remove("activo");
        botonesDark.classList.remove("activo")
    }
})


const btnDesloguear = document.getElementById("cerrarSesion")
btnDesloguear.addEventListener("click", ()=>{
    const sesion = localStorage.getItem("token_horizon")
    if (sesion) {
        localStorage.removeItem("token_horizon")
        location.reload()
    }
})
let responseTareas = await cargarTareasEliminadas()

let tareasBorradas = responseTareas.data.filter(t => t.active === false);
renderizar(tareasBorradas, mainEstilos)

mainEstilos.addEventListener("click", async (e) => {
    if (e.target.closest("button")) {
        const tarjeta = e.target.closest(".tarjeta");
        const id = tarjeta.dataset.id;
        await activarTarea(id);
        
        tareasBorradas = tareasBorradas.filter(t => t._id !== id);
        
        mainEstilos.innerHTML = "";
        renderizar(tareasBorradas, mainEstilos)

    }
});