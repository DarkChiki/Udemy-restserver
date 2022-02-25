
const { response, request } = require('express');

const usuariosGET = ( req = request, res = response ) => {

    const { q, nombre = 'No Name', apikey, page =1, limit } = req.query;

    res.json({
        ok: true,
        msg: 'Get Api - Controlador',
        q, 
        nombre, 
        apikey,
        page,
        limit
    });
}

const usuariosPUT = ( req = request, res = response ) => {

    const id = req.params.id;

    res.status(500).json({
        ok: true,
        msg: 'Put Api - Controlador',
        id
    })
}

const usuariosPOST = ( req = request, res = response ) => {

    const { nombre, edad } = req.body;

    res.status(201).json({
        ok: true,
        msg: 'Post Api - Controlador',
        nombre, 
        edad
    })
}

const usuariosDELETE = ( req, res = response ) => {
    res.json({
        ok: true,
        msg: 'Delete Api - Controlador'
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