const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// Registrar contraseña (pantalla Continuar)
router.post('/register', authController.registerPassword);

// Iniciar sesión (pantalla Login)
router.post('/login', authController.login);

// Actualizar avatar del usuario
router.post('/update-avatar', authController.updateAvatar);

// Obtener configuración del avatar
router.get('/avatar/:userId', authController.getAvatar);

// Obtener datos del usuario (pantalla Datos)
router.get('/user/:matricula', userController.getUserData);

module.exports = router;