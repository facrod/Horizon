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
