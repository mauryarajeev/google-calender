const { response } = require("express");
const jwt = require("jsonwebtoken");

const validateJWT = (req, res = response, next) => {

    /*Validamos nuestro TOken mediante header
        x-token headers 
    */


    const token = req.header("x-token"); //obtenemos el token del header

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: "No existe token"
        })
    }


    try {
        const { uid, name } = jwt.verify(token, process.env.SECRET_JWT);
        req.uid = uid;
        req.name = name;
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            ok: false,
            msg: "Token no válido"
        })
    }


    next();
}

module.exports = {
    validateJWT
}