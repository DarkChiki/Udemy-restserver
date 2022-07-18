const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const { generarJWT } = require('../helpers/generar-jwt');

const Usuario = require('../models/usuario');


const  login = async( req = request, res = response ) => {

    const { correo, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ correo });

        // Verificar si el email existe
        if( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }
                
        // Si el usuario esta activo
        if( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: falso'
            });
        }
        
        // Verificar la contraseña 
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - Password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id )

        res.json({
            msg: 'login Ok',
            usuario,
            token

        })
        
    } catch (error) {

        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}












module.exports = {
    login
}