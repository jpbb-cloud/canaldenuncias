const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Ruta donde se creará la base
const dbPath = './db/canal.db';

// Si el archivo existe, lo eliminamos
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Base de datos anterior eliminada');
}

// Creamos la nueva base
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error('Error al crear la base:', err.message);
  console.log('Base de datos canal.db creada');
});

// Activar claves foráneas
db.run("PRAGMA foreign_keys = ON");

// Crear tablas
db.serialize(() => {
  db.run(`CREATE TABLE usuario (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    relacion_empresa TEXT NOT NULL,
    anonimo INTEGER DEFAULT 0,
    nombre_completo TEXT,
    correo TEXT,
    telefono TEXT
  )`);

  db.run(`CREATE TABLE denunciado (
    id_denunciado INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_completo TEXT,
    conocimiento INTEGER NOT NULL,
    asunto TEXT NOT NULL,
    detalle TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE denuncias (
    id_denuncia INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo INTEGER NOT NULL,
    fecha_incidente DATE NOT NULL,
    fecha_denuncia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado TEXT NOT NULL,
    detalle_id_denuncia INTEGER NOT NULL,
    archivo_nom TEXT,
    archivo_ruta TEXT,
    archivo_tipo TEXT,
    usuario_id_usuario INTEGER NOT NULL,
    fecha_resolucion TIMESTAMP,
    FOREIGN KEY (detalle_id_denuncia) REFERENCES denunciado(id_denunciado),
    FOREIGN KEY (usuario_id_usuario) REFERENCES usuario(id_usuario)
  )`);
});

db.close(() => {
  console.log('Base de datos cerrada correctamente');
});