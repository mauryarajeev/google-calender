/* 

    Rutas de evento / Events
    host+api/events

*/
const { Router } = require('express');
const { check } = require("express-validator");
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/validate-fields');
const router = Router();


const { getEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/events");

//validar todas tienen que pasar por la validación de JWT
router.use(validateJWT);

//Obtener eventos
router.get("/", getEvents);


//Crear evento
router.post("/",
    [
        check("title", "Obligatory field").not().isEmpty(),
        check("start", "Obligatory field").not().isEmpty(),
        check("end", "Obligatory field").not().isEmpty(),
        validateFields,
    ]

    , createEvent);


//Actualizar evento
router.put("/:id", updateEvent);

//Eliminar Evento
router.delete("/:id", deleteEvent);

module.exports = router;
