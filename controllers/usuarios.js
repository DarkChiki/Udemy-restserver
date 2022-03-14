const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGET =  async ( req = request, res = response ) => {

    const { limite = 5, desde = 0 } = req.query; 
    const query = { estado: true };

    const [ total, usuarios ] =  await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
            .skip(  Number( desde ) )
            .limit( Number( limite ))
    ]);

    res.json({
        total,
        usuarios
    });

}

const usuariosPUT = async ( req = request, res = response ) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto }= req.body;

    // TODO Validar contra base de datos

    if ( password ) {
        
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );   

    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto )

    res.status(500).json({
        ok: true,
        msg: 'Put Api - Controlador',
        usuario
    })
}

const usuariosPOST = async ( req = request, res = response ) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en DB
    await usuario.save();

    res.status(201).json({
        ok: true,
        msg: 'Post Api - Controlador',
        usuario
    })
}

const usuariosDELETE = async ( req = request , res = response ) => {

    const { id } = req.params; 

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado : false } );


    res.json({
        ok: true,
        msg: 'Delete Api - Controlador',
        id,
        usuario
    })
}

const usuraiosPATCH = ( req, res = response) => {
    res.json({
        ok: true,
        msg: 'Patch Api - controlador'
    })
}


module.exports = {
    usuariosGET,
    usuariosPUT, 
    usuariosPOST,
    usuariosDELETE,
    usuraiosPATCH
}