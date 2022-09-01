const { response, request } = require("express");
const { Producto } = require("../models");

// obtenerProductos -- paginado -- total -- populate( moongose ) 
const obtenerProductos = async ( req = request, res = response  ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments( query ),
        Producto.find( query )
            .populate( 'usuario', 'nombre' ).populate( 'categoria' , 'nombre')
            .skip( Number( desde ) )
            .limit( Number( limite ))
    ]);       
    
    res.status(201).json({
        total,
        productos
    });
}

// obtenerProducto  -- populate( moongose ) {}
const obtenerProducto = async ( req = request, res = response ) => {

    const { id } = req.params;
    const producto = await Producto.findById( id ).populate( 'usuario', 'nombre' ).populate( 'categoria' , 'nombre');

    res.status(201).json({ 
        producto
    });

}

// crearProducto
const crearProducto = async ( req = request, res = response ) => {    

    const { estado, usuario,...data } = req.body;
    
    // Generar la data a Guardar 
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    // Valida si existe producto 
    const productoDB = await Producto.findOne( { nombre: data.nombre } );

    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        });    
    } 

    const producto = new Producto( data );

    //Guardar DB
    await producto.save();

    res.status(201).json( producto );

}

// actualizarProducto
const actualizarProducto = async ( req = request, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body; 

    // Generar la data a Guardar 

    if ( data.nombre ) {
        data.nombre  = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    // Actualiza producto
    const producto = await Producto.findByIdAndUpdate( id, data, { new: true });                                           
    
    res.status(201).json({
        ok: true,
        producto
    });

}

// borrarProducto -- estado:false
const borrarProducto = async ( req = request, res = response ) => {
    
    const { id } = req.params;
    
    // Generar la data  
    const data = {
        estado : false , 
        usuario: req.usuario._id
    }

    const categoria  = await Producto.findByIdAndUpdate( id, data, { new: true } );

    res.status(200).json({
        ok: true,
        categoria
    })
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}
