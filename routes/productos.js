const { Router } = require('express');
const { check } = require('express-validator');

const { crearProducto, obtenerProducto, obtenerProductos, actualizarProducto, borrarProducto} = require('../controllers/productos');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

/*

{{ url }}/api/productos

*/

// Obtener todas las productos - publico
router.get('/', obtenerProductos );

// Obtener todas las productos por id - publico
router.get('/:id', [
    check('id', 'No es un ID Valido' ).isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto );

// Crear producto - privado - cualquier persona con un token válido 
router.post('/', [ 
    validarJWT, 
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    check('categoria').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto );

// Actualizar - privado - cualquier persona con un token válido 
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID Valido' ).isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto );

// Eliminar - privado - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID Valido' ).isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto );


module.exports = router; 