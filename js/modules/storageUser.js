const API = "https://horizon-production-6288.up.railway.app/api";


//router.get("/usuario/:id", getUserId)

export async function cargarUsuario () {
    try {
        const token = localStorage.getItem("token_horizon");
        if (!token) return { ok: false, error: "No hay token" };

        const resultado = await fetch(`${API}/perfil`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}` 
            }            
        });

        const res = await resultado.json();

        if (res.ok) {
            return { ok: true, data: res.data };
        } else {
            return { ok: false, error: res.error };
        } 
    } catch (error) {
        return { ok: false, error: "Error de conexión" };

    }
}

export async function editarUsuario (UsuarioEdit) {
    try {
        const token = localStorage.getItem("token_horizon");
        const resultado = await fetch(`${API}/perfil`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json" 
            },
            body : JSON.stringify(UsuarioEdit)            
        });

        const res = await resultado.json();

        if (res.ok) {
            console.log(res.data)
            return { ok: true, data: res.data };
        } else {
            return { ok: false, error: res.error };
        } 
    } catch (error) {
        return { ok: false, error: "Error de conexión" };

    }    
}