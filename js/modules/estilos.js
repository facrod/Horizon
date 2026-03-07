export function renderizadoEstilosInicial(main,header,footer,columnas, formulario) {
    let estiloPagina = JSON.parse(localStorage.getItem("estilo"))
    if (estiloPagina == "whiteMode") {
        main.classList.add("whiteMode")
        header.classList.add("whiteMode")
        footer.classList.add("whiteMode")    
        for (let i = 0; i < columnas.length; i++) {
            columnas[i].classList.add("whiteMode") 
        }
        formulario.classList.add("whiteMode")    

    } else {
        main.classList.remove("whiteMode")
        header.classList.remove("whiteMode")
        footer.classList.remove("whiteMode")    
        for (let i = 0; i < columnas.length; i++) {
            columnas[i].classList.remove("whiteMode") 
        }           
        formulario.classList.remove("whiteMode")    

    }
}
export function inicializarEstilos(formAgregar) {
    let botonesDark = document.getElementById("darkMode")
    let botonesWhite = document.getElementById("whiteMode")
    let botonesEstilos = document.getElementById("toogle")

    const mainEstilos = document.getElementById("mainEstilos");
    const headerEstilos = document.getElementById("headerEstilos");
    const footerEstilos = document.getElementById("footerEstilos")
    const columnasEstilos = document.querySelectorAll(".columna")

    botonesEstilos.addEventListener("click", (e)=>{
        if (e.target.closest("#darkMode")) {
            botonesWhite.classList.remove("activo")
            botonesDark.classList.toggle("activo")
            let estiloPagina = "darkMode"
            localStorage.setItem("estilo", JSON.stringify(estiloPagina))
            if (mainEstilos.classList.contains("whiteMode")) {
                mainEstilos.classList.remove("whiteMode")
                headerEstilos.classList.remove("whiteMode")
                footerEstilos.classList.remove("whiteMode")
                for (let i = 0; i < columnasEstilos.length; i++) {
                    columnasEstilos[i].classList.remove("whiteMode") 
                }
                formAgregar.classList.remove("whiteMode");
            }
        }
        if (e.target.closest("#whiteMode")) {
            botonesDark.classList.remove("activo")
            botonesWhite.classList.toggle("activo")
            let estiloPagina = "whiteMode"
            localStorage.setItem("estilo", JSON.stringify(estiloPagina))
            if (!mainEstilos.classList.contains("whiteMode")) {
                mainEstilos.classList.add("whiteMode")
                headerEstilos.classList.add("whiteMode")
                footerEstilos.classList.add("whiteMode")
                for (let i = 0; i < columnasEstilos.length; i++) {
                    columnasEstilos[i].classList.add("whiteMode") 
                }
                formAgregar.classList.add("whiteMode");

            }        

        }
    })
    document.addEventListener("click", (e)=>{
        if (!botonesDark.contains(e.target) && !botonesWhite.contains(e.target)) {
            botonesWhite.classList.remove("activo");
            botonesDark.classList.remove("activo")
        }
    })
}