const { response, request } = require("express");
const { Categoria } = require("../models");

// obtenerCategorias -- paginado -- total -- populate( moongose ) 
const obtenerCategorias = async ( req = request, res = response  ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments( query ),
        Categoria.find( query )
            .populate( 'usuario', 'nombre' )
            .skip( Number( desde ) )
            .limit( Number( limite ))
    ]);       
    
    res.status(201).json({
        total,
        categorias
    });
}

// obtenerCategoria  -- populate( moongose ) {}
const obtenerCategoria = async ( req = request, res = response ) => {

    const { id } = req.params;
    const categoria = await Categoria.findById( id )
                                    .populate( 'usuario', 'nombre' );

    res.status(201).json({ 
        categoria
    });

}

// crearCategoria
const crearCategoria = async ( req = request, res = response ) => {
    
    const nombre = req.body.nombre.toUpperCase(); 
    const categoriaDB = await Categoria.findOne( { nombre } );

    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });    
    } 

    // Generar la data a Guardar 
    const data = {
        nombre, 
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );

    //Guardar DB
    await categoria.save();

    res.status(201).json( categoria );

}

// actualizarCategoria
const actualizarCategoria = async ( req = request, res = response ) => {

    const { id } = req.params;
    const {estado, usuario, ...data } = req.body; 

    // Generar la data a Guardar 
    data.nombre  = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    // Actualiza Categoria
    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true });                                            
    
    res.status(201).json({
        ok: true,
        categoria
    });

}

// borrarCategoria -- estado:false
const borrarCategoria = async ( req = request, res = response ) => {
    
    const { id } = req.params;
    
    // Generar la data  
    const data = {
        estado : false , 
        usuario: req.usuario._id
    }

    const categoria  = await Categoria.findByIdAndUpdate( id, data, { new: true } );

    res.status(200).json({
        ok: true,
        categoria
    })
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}
