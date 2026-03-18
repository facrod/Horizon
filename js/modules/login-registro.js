const API_URL = "horizon-production-46a9.up.railway.app";

export async function login(correo, password) {
    try {
        const response = await fetch(`${API_URL}/usuario/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, password }),
        });

        const res = await response.json();

        if (res.ok) {
            localStorage.setItem("token_horizon", res.data);
            return { ok: true };
        } else {
            return { ok: false, error: res.error };
        }
    } catch (error) {
        return { ok: false, error: "Error: El servidor no responde" };
    }
}

export async function registrar(usuario) {
    try {
        const response = await fetch(`${API_URL}/usuario`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario),
        });

        const res = await response.json();
        return res;
    } catch (error) {
        return { ok: false, error: "Error de conexión" };
    }
}

export function estaLogueado() {
    return localStorage.getItem("token_horizon") !== null;
}


document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("formLogin");
    const formRegister = document.getElementById("formRegister");
    const btnIrARegistro = document.getElementById("irARegistro");
    const btnIrALogin = document.getElementById("irALogin");
    const errorMsjLogin = document.getElementById("errorLogin");
    const errorMsjRegistro = document.getElementById("errorRegister");


    if (btnIrARegistro && btnIrALogin) {
        btnIrARegistro.addEventListener("click", () => {
            errorMsjLogin.style.display = "none";
            formLogin.reset();
            formLogin.classList.add("hidden");
            formRegister.classList.remove("hidden");
        });

        btnIrALogin.addEventListener("click", () => {
            formRegister.classList.add("hidden");
            formLogin.classList.remove("hidden");
        });
    }

    //Login
    if (formLogin) {
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault();
            const correo = document.getElementById("correo").value;
            const password = document.getElementById("password").value;

            const resultado = await login(correo, password);

            if (resultado.ok) {
                window.location.href = "../index.html";
            } else {
                errorMsjLogin.style.display = "block";
                errorMsjLogin.textContent = resultado.error;
            }
        });
    }

    //registro
    if (formRegister) {
        formRegister.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const nuevoUsuario = {
                nombre: document.getElementById("regNombre").value,
                apellido: document.getElementById("regApellido").value,
                dni: document.getElementById("regDni").value,
                fechaNacimiento: document.getElementById("regFecha").value,
                correo: document.getElementById("regCorreo").value,
                password: document.getElementById("regPassword").value
            };

            const resultado = await registrar(nuevoUsuario);

            if (resultado.ok) {
                alert("Usuario creado con éxito. Inicia sesión.");
                formRegister.classList.add("hidden");
                formLogin.classList.remove("hidden");
            } else {                    
                errorMsjRegistro.textContent = resultado.error; 
                errorMsjRegistro.style.display = "block";
            }
        });
    }
});


