const mysql = require('mysql');
const fs = require('fs');

const crearModelo = require('./modelo.js');


// Configura la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'automa52_fpruebas'
});

// Conecta a la base de datos
connection.connect(err => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos MySQL establecida');
  
  // Consulta SQL para obtener datos de la tabla
  const query = 'SELECT dia, hora, valor_medido FROM temperatura'; // Reemplaza "nombre_de_la_tabla" con el nombre de tu tabla

  // Ejecuta la consulta
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      connection.end(); // Cierra la conexión a la base de datos
      return;
    }

    // Formatea la fecha y hora en el formato deseado
    const formattedResults = results.map(row => {
      const fechaFormateada = new Date(row.dia).toISOString().split('T')[0]; // Obtiene solo la parte de la fecha
      const horaFormateada = row.hora.split(':').slice(0, 2).join(':'); // Obtiene solo la parte de la hora
      return {
        dia: fechaFormateada,
        hora: horaFormateada,
        valor_medido: row.valor_medido
      };
    });

    // Guarda los resultados formateados en un archivo JSON
    fs.writeFile('datos.json', JSON.stringify(formattedResults), err => {
      if (err) {
        console.error('Error al guardar los datos en el archivo:', err);
        return;
      }
      console.log('Datos guardados en el archivo datos.json');
      
      // Crea y entrena el modelo
      const modeloEntrenado = crearModelo(results);
      modeloEntrenado.then(() => {
        console.log('Modelo creado y entrenado exitosamente');
        connection.end(); // Cierra la conexión a la base de datos después de guardar los datos
      }).catch(error => {
        console.error('Error al crear y entrenar el modelo:', error);
        connection.end();
    });
  });
});
});
