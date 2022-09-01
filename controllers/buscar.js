const { response, request } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require("mongoose").Types; 

const coleccionesPermitidas  = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

// Buscar Usuario
const buscarUsuario = async ( termino = '' , res = response ) => {

    // valida si es un mongo ID
    const esMongoID = ObjectId.isValid( termino ); // Boolean

    if ( esMongoID ) {

        // Busqueda por mongo ID
        const usuario = await Usuario.findById( termino )   

        return res.json({
            length: 1,
            results: ( usuario ) ? [ usuario ] : []
        })
        
    } 

    // Js Expreciones regulares key sensitive( Mayusculas y minusculas )
    const regex = new RegExp( termino, 'i' );

    //Busqueda por nombre y/o correo
    const usuarios = await Usuario.find({ 
        $or:  [ { nombre: regex }, { correo: regex } ],
        $and: [ { estado: true } ]  
    });

    // cuenta la cantidad de registros encontrados 
    const length = Object.keys( usuarios ).length;
    
    res.json({
        length,
        results: usuarios
    })
    
}

// Buscar Categoria
const buscarCategoria = async ( termino = '', res = response ) => {

    //valida si es un mongo ID
    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ) {
        
        //Busqueda por mongo ID
        const categoria = await Categoria.findById( termino )

        return res.json({
            length: 1,
            results: ( categoria ) ? [ categoria ] : []  
        })

    }

    // Js Expreciones regulares key sensitive( Mayusculas y minusculas )
    const regex = new RegExp( termino, 'i' );

    //Busqueda por nombre 
    const categorias = await Categoria.find({ 
        $or:  [ { nombre: regex }],
        $and: [ { estado: true } ]  
    });

    // cuenta la cantidad de registros encontrados 
    const length = Object.keys( categorias ).length;
    
    res.json({
        length,
        results: categorias
    })

}

// Buscar Producto
const buscarProducto = async ( termino = '', res = response ) => {

    //valida si es un mongo ID
    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ) {
        
        //Busqueda por mongo ID
        const producto = await Producto.findById( termino ).populate( 'categoria', 'nombre' )
       
        // si no es producto busca x categoria  
        if ( !producto ) {

            // Busca si es una categoria 
            // Busqueda por mongo ID
            const producto = await Producto.find( { categoria :  termino, estado : true } ).populate( 'categoria', 'nombre' )

            // cuenta la cantidad de registros encontrados 
            const length = Object.keys( producto ).length;

            return res.json({
                length,
                results: ( producto ) ?  producto  : []  
            })
        }

        // cuenta la cantidad de registros encontrados 
        const length = Object.keys( [ producto ] ).length;

        return res.json({
            length,
            results: ( producto ) ? [ producto ] : []  
        })

    }

    // Js Expreciones regulares key sensitive( Mayusculas y minusculas )
    const regex = new RegExp( termino, 'i' );

    //Busqueda por nombre 
    const productos = await Producto.find({ 
        $or:  [ { nombre: regex }],
        $and: [ { estado: true } ]  
    }).populate( 'categoria', 'nombre' );

    // cuenta la cantidad de registros encontrados 
    const length = Object.keys( productos ).length;
    
    res.json({
        length,
        results: productos
    })

}

const buscar = ( req = request , res = response) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `las colecciones permitidas son ${ coleccionesPermitidas }`
        })
    }

    switch ( coleccion ) {
        case 'usuarios':
            buscarUsuario( termino, res );
            break;
        case 'categorias':
            buscarCategoria( termino, res );
            break;
        case 'productos':
            buscarProducto( termino, res );
            break;    
        default:
            res.status(500).json({
                msg: `Se le olvido hacer esta busqueda ${ coleccion }`
            })    
            break;
    }

}

module.exports = {
    buscar
}