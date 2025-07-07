const db = require('../db/connection');

// Obtener datos del usuario
exports.getUserData = async (req, res) => {
  const { matricula } = req.params;
  
  try {
    const [alumno] = await db.promise().query(
      `SELECT 
        id, 
        matricula, 
        nombres, 
        primer_apellido, 
        segundo_apellido, 
        no_generacion AS generacion,
        academia AS sede
      FROM alumnos 
      WHERE matricula = ?`, 
      [matricula]
    );
    
    if (alumno.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.status(200).json(alumno[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
};