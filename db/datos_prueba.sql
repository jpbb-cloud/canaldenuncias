-- Usuarios (identificados y anónimos)
INSERT INTO usuario (relacion_empresa, anonimo, nombre_completo, correo, telefono) VALUES
('Empleado', 0, 'Laura Gómez', 'laura.gomez@empresa.com', 612345678),
('Proveedor', 0, 'Carlos Ruiz', 'carlos.ruiz@proveedor.com', 699876543),
('Externo', 1, NULL, NULL, NULL);

-- Denunciados
INSERT INTO denunciado (nombre_completo, conocimiento, asunto, detalle) VALUES
('Jorge Martínez', 1, 'Manipulación de informes', 'Se detectó alteración de datos financieros en el informe trimestral.'),
('Ana Torres', 0, 'Comportamiento inapropiado', 'Se reporta acoso verbal en reuniones de equipo.'),
('Desconocido', 0, 'Condiciones inseguras', 'Se observó maquinaria sin mantenimiento en zona de producción.');

-- Denuncias
INSERT INTO denuncias (
  tipo, fecha_incidente, estado, detalle_id_denuncia,
  archivo_nom, archivo_ruta, archivo_tipo,
  usuario_id_usuario, fecha_resolucion
) VALUES
(1, '2025-10-15', 'En revisión', 1, 'informe.pdf', '/archivos/informe.pdf', 'application/pdf', 1, NULL),
(3, '2025-09-20', 'Investigando', 2, NULL, NULL, NULL, 2, NULL),
(6, '2025-11-01', 'Cerrada', 3, 'foto.jpg', '/archivos/foto.jpg', 'image/jpeg', 3, '2025-11-05');