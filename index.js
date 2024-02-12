const express = require("express");
const mysql = require("mysql");
const app = express();

// Configuración de la conexión a la base de datos
const conexion = mysql.createConnection({
    host: "localhost",
    database: "basedatosprueba",
    user: "root",
    password: ""
});

// Configuración del servidor Express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// Rutas

// Ruta principal que renderiza la vista "registro"
app.get("/", (req, res) => {
    res.render("registro");
});

// Ruta para validar y registrar nuevos usuarios
app.post("/validar", (req, res) => {
    const datos = req.body;
    const { id, nom, apell, correo, pass } = datos;

    // Consultar si el usuario ya existe
    const buscar = "SELECT * FROM tabla_usuarios WHERE id = ?";
    conexion.query(buscar, [id], (error, row) => {
        if (error) {
            throw error;
        } else {
            if (row.length > 0) {
                console.log("No se puede registrar, usuario ya existe");
            } else {
                // Registrar nuevo usuario si no existe
                const registrar = "INSERT INTO tabla_usuarios (id, nombre, apellido, correo, contrasenia) VALUES (?, ?, ?, ?, ?)";
                conexion.query(registrar, [id, nom, apell, correo, pass], (error) => {
                    if (error) {
                        throw error;
                    } else {
                        console.log("Datos almacenados correctamente");
                    }
                });
            }
        }
    });
});

// Ruta para consultar un usuario por ID
app.get("/consultar", (req, res) => {
    const consultaId = req.query.id;
    const consultar = "SELECT * FROM tabla_usuarios WHERE id = ?";
    conexion.query(consultar, [consultaId], (error, resultados) => {
        if (error) {
            res.json({ error: 'Error en la consulta' });
        } else {
            if (resultados.length > 0) {
                const usuarioEncontrado = resultados[0];
                res.json({
                    nombre: usuarioEncontrado.nombre,
                    apellido: usuarioEncontrado.apellido,
                    correo: usuarioEncontrado.correo
                });
            } else {
                res.json({ error: 'Usuario no encontrado' });
            }
        }
    });
});

// Ruta para obtener todos los datos de la tabla_usuarios
app.get("/todosLosDatos", (req, res) => {
    const consultarTodos = "SELECT * FROM tabla_usuarios";
    conexion.query(consultarTodos, (error, resultados) => {
        if (error) {
            res.json({ error: 'Error al obtener todos los datos' });
        } else {
            res.json(resultados);
        }
    });
});

// Ruta para borrar un usuario por ID
app.delete("/borrar", (req, res) => {
    const borrarId = req.query.id;
    const borrar = "DELETE FROM tabla_usuarios WHERE id = ?";
    conexion.query(borrar, [borrarId], (error, resultados) => {
        if (error) {
            res.json({ error: 'Error en el borrado' });
        } else {
            if (resultados.affectedRows > 0) {
                res.json({ message: 'Usuario borrado correctamente' });
            } else {
                res.json({ error: 'Usuario no encontrado' });
            }
        }
    });
});

// Inicio del servidor en el puerto 3000
app.listen(3000, () => {
    console.log("Servidor creado http://localhost:3000");
});
