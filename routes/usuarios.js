const { Router } = require('express');
const { usuariosGET, usuariosPUT, usuariosPOST, usuariosDELETE, usuraiosPATCH } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGET );

router.put('/:id', usuariosPUT );

router.post('/', usuariosPOST );

router.delete('/', usuariosDELETE );

router.patch('/', usuraiosPATCH);

module.exports = router;
