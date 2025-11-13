@echo off
echo Exporting database tables to CSV files...
REM ruta a base de datos SQLite
SET DB_PATH=.\db\canal.db

REM archivo de salida
set OUTPUT_FILE=denuncias.csv

REM Comando para exportar tablas a CSV
sqlite3 %DB_PATH% ".headers on" ".mode csv" ".output %OUTPUT_FILE%" "SELECT * FROM usuario;" "SELECT * FROM denunciado;" "SELECT * FROM denuncias;" ".output stdout"

echo Exportación completada: %OUTPUT_FILE%
pause
