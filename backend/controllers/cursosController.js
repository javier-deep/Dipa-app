const db = require('../db/connection');

// Función auxiliar para comparar horas
const compareTimes = (time1, time2) => {
  const [h1, m1, s1] = time1.split(':').map(Number);
  const [h2, m2, s2] = time2.split(':').map(Number);
  
  if (h1 !== h2) return h1 - h2;
  if (m1 !== m2) return m1 - m2;
  return s1 - s2;
};



// Función para validar código
const validarCodigo = (req, res) => {
  const { codigo } = req.body;

  if (!codigo || typeof codigo !== 'string') {
    return res.status(400).json({ valid: false, message: 'Código requerido' });
  }

  const codigoNormalizado = codigo.trim().toUpperCase();

  db.query(
    'SELECT * FROM talleres WHERE codigo_finalizacion = ?',
    [codigoNormalizado],
    (err, results) => {
      if (err) {
        console.error('Error al validar el código:', err);
        return res.status(500).json({ valid: false, message: 'Error en el servidor' });
      }

      if (results.length === 0) {
        return res.json({ valid: false, message: 'Código no encontrado' });
      }

      const taller = results[0];
      const ahora = new Date();
      
      // Ajustar a la zona horaria local para fecha
      const fechaHoy = ahora.toLocaleDateString('en-CA');
      const fechaHabilitada = new Date(taller.fecha_habilitada).toLocaleDateString('en-CA');
      
      // Comparación de fechas
      if (fechaHoy !== fechaHabilitada) {
        return res.json({
          valid: false,
          message: `Código válido solo el ${fechaHabilitada} (hoy es ${fechaHoy})`
        });
      }

      // Comparación de horas
      const horaAhora = ahora.toTimeString().substring(0, 8);
      
      if (compareTimes(horaAhora, taller.hora_inicio) < 0) {
        return res.json({
          valid: false,
          message: `El código será válido a partir de las ${taller.hora_inicio}`
        });
      }

      if (compareTimes(horaAhora, taller.hora_fin) > 0) {
        return res.json({
          valid: false,
          message: `El código era válido hasta las ${taller.hora_fin}`
        });
      }

      // Si pasa todas las validaciones
      res.json({
        valid: true,
        curso: {
          id: taller.id,
          titulo: taller.titulo,
          sede: taller.sede,
          horario: `${taller.hora_inicio} - ${taller.hora_fin}`,
          fecha: fechaHabilitada
        }
      });
    }
  );
};
// Función para obtener todos los cursos (con filtro por sede)
const obtenerCursos = (req, res) => {
  const { sede } = req.query; // Obtener el parámetro de sede de la URL
  
  let query = 'SELECT t.*, s.nombre as nombre_sede FROM talleres t LEFT JOIN sedes s ON t.sede = s.id';
  const params = [];
  
  if (sede && sede !== 'all') {
    query += ' WHERE t.sede = ?';
    params.push(sede);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error al obtener cursos:', err);
      return res.status(500).json({ 
        error: 'Error al obtener los cursos',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    
    // Mapear los resultados para incluir el nombre de la sede
    const cursosConSede = results.map(curso => ({
      ...curso,
      sede_nombre: curso.nombre_sede || 'Sin sede asignada'
    }));
    
    res.json(cursosConSede);
  });
};


// Función para obtener todas las sedes
const obtenerSedes = (req, res) => {
  db.query('SELECT * FROM sedes WHERE status = "activo"', (err, results) => {
    if (err) {
      console.error('Error al obtener sedes:', err);
      return res.status(500).json({ 
        error: 'Error al obtener las sedes',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    res.json(results);
  });
};

// Actualiza el export al final del archivo
module.exports = {
  obtenerCursos,
  validarCodigo,
  obtenerSedes
};