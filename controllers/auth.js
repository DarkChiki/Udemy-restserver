const { response, request, json } = require('express');
const bcryptjs = require('bcryptjs');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async ( req = request , res = response ) => {

    const { ID_TOKEN } = req.body;    
    
    try {
    
        const { nombre, img, correo } = await googleVerify( ID_TOKEN ); 
        let usuario = await Usuario.findOne({ correo }); 

        if ( !usuario ) {
            // Crear Usaurio
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: "USER_ROLE",
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario e DB
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, Usuario bloqueado'
            })
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id )

        res.json({
            msg: 'Todo bien!',
            ID_TOKEN,
            usuario,
            token 
        }) 
        
    } catch (error) {
        
        json.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
}










module.exports = {
    login,
    googleSignIn 
}