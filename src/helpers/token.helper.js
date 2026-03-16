import jwt from "jsonwebtoken";

function authenticate(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    if(!token) {
        return res.json({
            ok: false,
            error: "Usuario no esta autorizado",
        })
    }
    jwt.verify(token, process.env.SECRETO, (err, payload) =>{
        if(err) {
            return res.json({
                ok: false,
                error: "token invalido o expirado"
            })
        } 
        req.payload = payload;
        next()
    });
}

export {authenticate}