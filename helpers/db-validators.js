// const Role = require('../models/role');
// const Usuario = require('../models/usuario');
// const Categoria = require('../models/categoria');

const { Role, Usuario, Categoria, Producto } = require('../models');

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
    // Verificar si Usuario existe 
    const existeUsuario = await Usuario.findById( id );

    if ( !existeUsuario ) {
        throw new Error(`El Id : ${ id }, No existe en la DB`)
    }
}

const existeCategoriaPorId = async ( id = '' ) => {
    // Verificar si Categotia existe 
    const existeCategoria = await Categoria.findById( id );
    console.log(id);
    if ( !existeCategoria ) {
        throw new Error(`El Id : ${ id }, No existe en la DB`)
    }
}

const existeProductoPorId = async ( id = '' ) => {
    // Verificar si Producto existe 
    const existeProducto = await Producto.findById( id );
    
    if ( !existeProducto ) {
        throw new Error(`El Id : ${ id }, No existe en la DB`)
    }
} 

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}