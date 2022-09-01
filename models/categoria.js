const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({

    nombre : {
        type: String,
        required: [ true, 'El nombre es obligatorio'],
        unique: true
        
    },
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
CategoriaSchema.methods.toJSON = function() {
    const { __v, estado, ...data } = this.toObject(); 
    return data
}


module.exports = model( 'Categoria', CategoriaSchema );

