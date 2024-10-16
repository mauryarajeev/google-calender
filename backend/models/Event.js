const { Schema, model, default: mongoose } = require('mongoose');

const EventSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    notes: {
        type: String,

    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    //referenciamos al otro usuario para saber de que usuario viene la nota del calendar
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', //nombre del otro esquema
        required: true,
    }
});

//Configuraciones y accesos a todo el modelo
EventSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Event', EventSchema);