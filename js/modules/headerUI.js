export function inicializarHeaderUI() {
    let btnDesplegar = document.getElementById("btnDesplegar");
    let agregarTarea = document.getElementById("agregarTarea");

    btnDesplegar.addEventListener("click", (e)=>{
        e.stopPropagation()
        agregarTarea.classList.toggle("activo")
    })
    document.addEventListener("click", (e) => {

        if (!btnDesplegar.contains(e.target) && !agregarTarea.contains(e.target)) {
            agregarTarea.classList.remove("activo");
        }
    });
    
    const btnDesloguear = document.getElementById("cerrarSesion")
    btnDesloguear.addEventListener("click", ()=>{
        const sesion = localStorage.getItem("token_horizon")
        if (sesion) {
            localStorage.removeItem("token_horizon")
            location.reload()
        }
    })
}
