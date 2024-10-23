const mysql = require ("mysql");
const conexion = mysql.createConnection({
    host: "phpmyadmin.ctpoba.edu.ar",
    user: "gomezd",
    password: "46809704",
    database: "24_71_E"
})

conexion.connect(
    function (error) {
        if (error) {
            console.error(error);
            return;
        }
        console.log("conectado correctamente a la db");
        
    }
)

module.exports = {conexion};