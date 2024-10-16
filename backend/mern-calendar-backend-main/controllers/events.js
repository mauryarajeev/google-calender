const { response } = require('express');
const Event = require('../models/Event');
const User = require('../models/User');

const getEvents = async (req, res = response) => {

    //mostrar solo los eventos que pertenecen al usuario logeado
    let user = await User.findById(req.uid);
    const events = await Event.find({ user }).populate("user", "name");

    res.status(200).json({
        ok: true,
        events
    })
}


const createEvent = async (req, res = response) => {

    const { title, start, end } = req.body;

    const fields = [title,new Date(start), new Date(end)];

    try {

        if (fields.some(field => field === "")) {
            return res.status(400).json({
                ok: false,
                msg: "Campos obligatorios vacios"
            })
        }


        let event = await Event(req.body);
        event.user = req.uid;
        await event.save();


        res.status(201).json({
            ok: true,
            msg: event,
        })
    } catch (error) {

        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Problemas con el servidor, hable con su administrador"
        })

    }


}

const updateEvent = async (req, res = response) => {
    const { id } = req.params;
    const uid = req.uid;

    try {

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: "Evento no encontrado"
            });
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: "No puedes actualizar este evento"
            })
        }

        const eventUpdated = {
            ...req.body,
            user: uid
        }

        await Event.findByIdAndUpdate(id, eventUpdated, { new: true });


        res.status(200).json({
            ok: true,
            msg: "Evento actualizado",
            event
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Problemas con el servidor, hable con su administrador"
        })
    }

}

const deleteEvent = async (req, res = response) => {
    const { id } = req.params;
    const uid = req.uid;

    try {

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: "Evento no encontrado"
            })
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: "No puedes eliminar este evento"
            })
        }

        await Event.findByIdAndDelete(id);


        res.status(200).json({
            ok: true,
            msg: "Evento eliminado",

        });


    } catch (error) {
        console.error(error);


        if (id.length < 24 || id.length > 24) {
            return res.status(400).json({
                ok: false,
                msg: 'La id debe contener 24 caracteres'
            });
        }

        res.status(500).json({
            ok: false,
            msg: "Problemas con el servidor, hable con su administrador"
        })
    }


}


module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}

