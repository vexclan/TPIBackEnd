const express = require('express');
const { conexion } = require('../db/conexion.js');
const router = express.Router();

const validarId = (req, res, next) => {
    const id = req.query.id;
    if (id && !Number.isInteger(parseInt(id))) {
        return res.status(400).json({
            status: "error",
            mensaje: "El ID debe ser un número válido"
        });
    }
    next();
};

const validarCiudad = (req, res, next) => {
    const { nombre } = req.body;
    
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
        return res.status(400).json({
            status: "error",
            mensaje: "Nombre de ciudad inválido"
        });
    }

    next();
};

router.get('/', validarId, async (req, res) => {
    try {
        const { id } = req.query;
        let sql, params = [];

        if (id !== undefined) {
            sql = "SELECT * FROM Ciudad WHERE id = ?";
            params = [id];
        } else {
            sql = "SELECT * FROM Ciudad";
        }

        const [results] = await conexion.promise().query(sql, params);

        if (id && results.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "Ciudad no encontrada"
            });
        }

        res.json({
            status: "ok",
            datos: results
        });
    } catch (error) {
        console.error('Error en GET /ciudad:', error);
        res.status(500).json({
            status: "error",
            mensaje: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.post('/', validarCiudad, async (req, res) => {
    try {
        const { nombre } = req.body;

        const [result] = await conexion.promise().query(
            "INSERT INTO Ciudad (nombre) VALUES (?)",
            [nombre]
        );

        res.status(201).json({
            status: "ok",
            mensaje: "Ciudad creada exitosamente",
            id: result.insertId
        });
    } catch (error) {
        console.error('Error en POST /ciudad:', error);
        res.status(500).json({
            status: "error",
            mensaje: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.put('/', [validarId, validarCiudad], async (req, res) => {
    try {
        const { id } = req.query;
        const { nombre } = req.body;

        const [result] = await conexion.promise().query(
            "UPDATE Ciudad SET nombre = ? WHERE id = ?",
            [nombre, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "Ciudad no encontrada"
            });
        }

        res.json({
            status: "ok",
            mensaje: "Ciudad actualizada exitosamente"
        });
    } catch (error) {
        console.error('Error en PUT /ciudad:', error);
        res.status(500).json({
            status: "error",
            mensaje: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.delete('/', validarId, async (req, res) => {
    try {
        const { id } = req.query;

        const [result] = await conexion.promise().query(
            "DELETE FROM Ciudad WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "Ciudad no encontrada"
            });
        }

        res.json({
            status: "ok",
            mensaje: "Ciudad eliminada exitosamente"
        });
    } catch (error) {
        console.error('Error en DELETE /ciudad:', error);
        res.status(500).json({
            status: "error",
            mensaje: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;