const { Router } = require('express');
const { check } = require('express-validator');

const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

/*

{{ url }}/api/categorias

*/

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias );

// Obtener todas las categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID Valido' ).isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], obtenerCategoria );

// Crear categoria - privado - cualquier persona con un token válido 
router.post('/', [ 
    validarJWT, 
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria );

// Actualizar - privado - cualquier persona con un token válido 
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    check('id', 'No es un ID Valido' ).isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], actualizarCategoria );

// Eliminar - privado - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID Valido' ).isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria );


module.exports = router; 