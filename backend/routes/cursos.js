const express = require('express');
const router = express.Router();

const { obtenerCursos, validarCodigo } = require('../controllers/cursosController');

// Ruta GET para obtener todos los cursos
router.get('/', obtenerCursos);

// Ruta POST para validar código de finalización
router.post('/validar', validarCodigo);

module.exports = router;