const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require("cors");

/* Crear el servidor de express */
const app = express();

//Conexión a la base de datos
dbConnection();


//CORS
app.use(cors())

//Directorio público
app.use(express.static('public'));

//Lectura y parseo del body
app.use(express.json());


/* Rutas */
app.use("/api/auth", require("./routes/auth"));

//Todo auth / crear, login, renew
//TODO CRUD: Eventos
//
app.use("/api/events", require("./routes/events"));


app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
})


/* Escuchar petición */
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
})

