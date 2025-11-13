const nodemailer = require('nodemailer');
require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Configurar nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos
const db = new sqlite3.Database('./db/canal.db', (err) => {
  if (err) {
    console.error('Error al conectar con SQLite:', err.message);
  } else {
    console.log('Conectado a la base de datos canal.db');
  }
});

// Ruta GET para ver todas las denuncias
app.get('/api/denuncias', (req, res) => {
  db.all('SELECT * FROM denuncias', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Ruta POST para registrar una denuncia
app.post('/api/denuncias', (req, res) => {
  const { tipo, fecha_incidente, estado, detalle, usuario } = req.body;

  // Insertar usuario
  db.run(
    `INSERT INTO usuario (relacion_empresa, anonimo, nombre_completo, correo, telefono)
     VALUES (?, ?, ?, ?, ?)`,
    [usuario.relacion_empresa, usuario.anonimo, usuario.nombre_completo, usuario.correo, usuario.telefono],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      const usuario_id = this.lastID;

      // Insertar denunciado
      db.run(
        `INSERT INTO denunciado (nombre_completo, conocimiento, asunto, detalle)
         VALUES (?, ?, ?, ?)`,
        [detalle.nombre_completo, detalle.conocimiento, detalle.asunto, detalle.detalle],
        function (err2) {
          if (err2) return res.status(500).json({ error: err2.message });
          const denunciado_id = this.lastID;

          // Generar radicado
          const radicado = `RAD-${fecha_incidente.replace(/-/g, '')}-${Date.now()}`;

          // Insertar denuncia principal
          db.run(
            `INSERT INTO denuncias (radicado, tipo, fecha_incidente, estado, usuario_id_usuario, detalle_id_denuncia)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [radicado, tipo, fecha_incidente, estado, usuario_id, denunciado_id],
            function (err3) {
              if (err3) return res.status(500).json({ error: err3.message });

              // Enviar correo
              const mensajeCorreo = `
Nueva denuncia registrada:

Radicado: ${radicado}
Tipo: ${tipo}
Fecha del incidente: ${fecha_incidente}
Asunto: ${detalle.asunto}
Detalle: ${detalle.detalle}

Denunciante: ${usuario.anonimo ? 'Anónimo' : usuario.nombre_completo}
Correo: ${usuario.anonimo ? 'No disponible' : usuario.correo}
`;

              transporter.sendMail(
                {
                  from: process.env.EMAIL_USER,
                  to: process.env.EMAIL_RECEIVER,
                  subject: `Nueva denuncia recibida - Radicado ${radicado}`,
                  text: mensajeCorreo
                },
                (error, info) => {
                  if (error) {
                    console.error('Error al enviar el correo:', error);
                  } else {
                    console.log('Correo enviado:', info.response);
                  }

                  // Enviar respuesta al cliente
                  res.json({ mensaje: 'Denuncia registrada con éxito', radicado });
                }
              );
            }
          );
        }
      );
    }
  );
});

// Ruta GET para consultar estado de denuncia
app.get('/api/consulta', (req, res) => {
  const { radicado, fecha } = req.query;

  if (!radicado || !fecha) {
    return res.status(400).json({ error: 'Debe ingresar radicado y fecha.' });
  }

  db.get(
    `SELECT estado, observacion, fecha_resolucion FROM denuncias WHERE radicado = ? AND date(fecha_denuncia) = date(?)`,
    [radicado, fecha],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Denuncia no encontrada' });
      }


      res.json({
        estado: row.estado,
        observacion: row.observacion || 'Sin observaciones',
        fecha_resolucion: row.fecha_resolucion || 'En proceso'
      });
    }
  );
});

app.put('/api/denuncias/:radicado', (req, res) => {
  const { radicado } = req.params;
  const { estado, observacion, fecha_resolucion } = req.body;

  db.run(
    `UPDATE denuncias
     SET estado = ?, observacion = ?, fecha_resolucion = ?
     WHERE radicado = ?`,
    [estado, observacion, fecha_resolucion, radicado],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Denuncia no encontrada' });

      res.json({ mensaje: 'Denuncia actualizada correctamente' });
    }
  );
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
