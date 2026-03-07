import { tareas } from "./storage.js";
//RENDERIZAR TAREAS 
export function renderizarTareasInicio(diasSemana) {
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
        const [y,m,d] = t.dia.split("-");   //SOLUCIÓN PARA QUE SEA COMPATIBLE CON SAFARI
        let fechaTarea = new Date(y, m-1, d);        
        return fechaTarea >= lunes && fechaTarea <= domingo;
    }).forEach(function(t) {
        pintarTarea(t, diasSemana);        
    });
}
//FUNCION PARA PINTAR UNA TAREA
export function pintarTarea(tarea, diasSemana) {
    let dia = new Date(tarea.dia)
    let diaIndex = dia.getUTCDay()
    let diaSection = document.getElementById(diasSemana[diaIndex])

    diaSection.innerHTML += `
    <section class="tarjeta" data-id="${tarea.id}" draggable="true">
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
export function refrescarDia(diaString, diasSemana) {

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
        .forEach(t => pintarTarea(t, diasSemana));
}
//REFRESCAR DESCRIPCION Y REENDERIZAR
export function renderizarTarea(tarjeta) {
    let nuevoContenido = `
        <img src="img/cerrar.png" class="cerrar" id="close" alt="cerrar">
        
        <section id="seccionDescripcionInfo">
            <article class="info-descripcion">
                <h3>${tarjeta.tarea}</h3>
                <p>${tarjeta.descripcion}</p>    
            </article>
            <article class="dia-hora-descripcion">
                <p>Fecha: ${tarjeta.dia}</p>
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
