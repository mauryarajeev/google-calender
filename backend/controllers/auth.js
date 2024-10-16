const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const createUser = async (req, res = express.response) => {

    const { name, email, password } = req.body;

    try {

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                ok: false,
                msg: "User exists"
            })
        }

        user = new User(req.body);


        //encriptar password
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);

        await user.save();

        //Generar JWT
        const token = generarJWT(user.id, user.name);


        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador'
        })
    }
}

const LoginUser = async (req, res = express.response) => {
    const { email, password } = req.body;


    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: "User not exists"
            })
        }

        //revisar password ingresado sea igual al de la base de datos

        const comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return res.status(400).json({
                ok: false,
                msg: "Incorrect password",

            })
        }

        //Generar token
        const token = generarJWT(user.id, user.name);

        res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            msg: 'Login',
            token
        })


    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }



}

const renewJWT = async (req, res = express.response) => {

    const { uid, name } = req;

    //generar un nuevo JWT y retornarlo en esta petición
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        msg: 'renew',
        token,
        uid,
        name
    });
}


module.exports = {
    createUser,
    LoginUser,
    renewJWT,
}