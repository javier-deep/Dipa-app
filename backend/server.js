const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Aumentar límite para imágenes base64

// Rutas
const cursosRoutes = require('./routes/cursos');
const bannersRoutes = require('./routes/banners'); // Nueva ruta

app.use('/api/cursos', cursosRoutes);
app.use('/api/banners', bannersRoutes); // Registrar rutas de banners

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});