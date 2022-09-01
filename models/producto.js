const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({

    nombre : {
        type: String,
        required: [ true, 'El nombre es obligatorio'],
        unique: true       
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: [ true, 'La Categoria es obligatoria' ]
    },
    descripcion: { type: String },
    disponible: { type: Boolean, default: true },
    estado: {
        type: Boolean,
        default: true,
        required: [ true, 'El estado es obligatorio']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [ true, 'El Usuario es obligatorio'] 
    }

});

// sobrescribir el JSON para no mostrar __v ni el password
ProductoSchema.methods.toJSON = function() {
    const { __v, estado, ...data } = this.toObject(); 
    return data
}


module.exports = model( 'Producto', ProductoSchema );

