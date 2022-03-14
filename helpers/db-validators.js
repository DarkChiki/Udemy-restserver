const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async ( rol = '' ) => {
    const existeRol = await Role.findOne( { rol } );
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no esta registrado en la DB`)
    }
}

const emailExiste = async ( correo = '' ) => {
    // Verificar si correo existe 
    const existeEmail = await Usuario.findOne({ correo });

    if ( existeEmail ) {
        throw new Error(`El correo : ${ correo }, ya existe`)
    }
}
const existeUsuarioPorId = async ( id = '' ) => {
    // Verificar si correo existe 
    const existeUsuario = await Usuario.findById( id );

    if ( !existeUsuario ) {
        throw new Error(`El Id : ${ id }, No existe en la DB`)
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}