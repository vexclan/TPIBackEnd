const express = require('express');
const { conexion } = require('../db/conexion.js');
const router = express.Router();

router.get('/', function(req, res, next) {
    const { id } = req.query;
    console.log(id);
    
    if (id !== undefined) {
        const sql = "SELECT * FROM Ciudad WHERE id = ?";
        
        conexion.query(sql, [id], function(error, result) {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
            console.log(result);
            res.json({
                status: "ok",
                Ciudad: result 
            });
        });
    } else {
        const sql = "SELECT * FROM Ciudad";
        
        conexion.query(sql, function(error, result) {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
            res.json({
                status: "ok",
                ciudades: result 
            });
        });
    }
});

router.post('/', function(req, res, next) {
    const { nombre } = req.body;
    console.log(nombre);
    
    const sql = "INSERT INTO Ciudad (`nombre`) VALUES (?)";

    conexion.query(sql, [nombre], function(error, result) {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
        console.log(result);
        res.json({ status: "ok", Ciudad_id: result.insertId });
    });
});

router.put('/', function(req, res, next) {
    const { id } = req.query;
    const { nombre } = req.body;
    console.log(nombre);
    
    const sql = "UPDATE Ciudad SET nombre = ? WHERE id = ?";
    
    conexion.query(sql, [nombre, id], function(error, result) {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
        console.log(result);
        res.json({ status: "ok" });
    });
});

router.delete('/', function(req, res, next) {
    const { id } = req.query;

    const sql = "DELETE FROM Ciudad WHERE id = ?";
    
    conexion.query(sql, [id], function(error, result) {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
        console.log(result);
        res.json({ status: "ok" });
    });
});

module.exports = router;
