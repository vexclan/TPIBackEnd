const express = require('express');
const { conexion } = require('../db/conexion.js');
const router = express.Router();

// Middleware de validación
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

const validarArticuloPedido = (req, res, next) => {
    const { id_pedido, id_articulo, cantidad, precio } = req.body;
    
    if (!id_pedido || !id_articulo || !cantidad || !precio || 
        !Number.isInteger(parseInt(id_pedido)) || 
        !Number.isInteger(parseInt(id_articulo)) ||
        !Number.isFinite(parseFloat(cantidad)) ||
        !Number.isFinite(parseFloat(precio))) {
        return res.status(400).json({
            status: "error",
            mensaje: "Datos de artículo-pedido inválidos"
        });
    }

    next();
};

// Rutas
router.get('/', validarId, async (req, res) => {
    try {
        const { id } = req.query;
        let sql, params = [];

        if (id !== undefined) {
            sql = "SELECT * FROM Articulo_Pedido WHERE id = ?";
            params = [id];
        } else {
            sql = "SELECT * FROM Articulo_Pedido";
        }

        const [results] = await conexion.promise().query(sql, params);

        if (id && results.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "Artículo de pedido no encontrado"
            });
        }

        res.json({
            status: "ok",
            datos: results
        });
    } catch (error) {
        console.error('Error en GET /articulo-pedido:', error);
        res.status(500).json({
            status: "error",
            mensaje: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.post('/', validarArticuloPedido, async (req, res) => {
    try {
        const { id_pedido, id_articulo, cantidad, precio } = req.body;

        const [result] = await conexion.promise().query(
            "INSERT INTO Articulo_Pedido (id_pedido, id_articulo, cantidad, precio) VALUES (?, ?, ?, ?)",
            [id_pedido, id_articulo, cantidad, precio]
        );

        res.status(201).json({
            status: "ok",
            mensaje: "Artículo de pedido creado exitosamente",
            id: result.insertId
        });
    } catch (error) {
        console.error('Error en POST /articulo-pedido:', error);
        res.status(500).json({
            status: "error",
            mensaje: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.put('/', [validarId, validarArticuloPedido], async (req, res) => {
    try {
        const { id } = req.query;
        const { id_pedido, id_articulo, cantidad, precio } = req.body;

        const [result] = await conexion.promise().query(
            "UPDATE Articulo_Pedido SET id_pedido = ?, id_articulo = ?, cantidad = ?, precio = ? WHERE id = ?",
            [id_pedido, id_articulo, cantidad, precio, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "Artículo de pedido no encontrado"
            });
        }

        res.json({
            status: "ok",
            mensaje: "Artículo de pedido actualizado exitosamente"
        });
    } catch (error) {
        console.error('Error en PUT /articulo-pedido:', error);
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
            "DELETE FROM Articulo_Pedido WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "Artículo de pedido no encontrado"
            });
        }

        res.json({
            status: "ok",
            mensaje: "Artículo de pedido eliminado exitosamente"
        });
    } catch (error) {
        console.error('Error en DELETE /articulo-pedido:', error);
        res.status(500).json({
            status: "error",
            mensaje: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Ruta adicional para obtener artículos por ID de pedido
router.get('/pedido/:idPedido', async (req, res) => {
    try {
        const { idPedido } = req.params;

        const [results] = await conexion.promise().query(
            `SELECT ap.*, a.nombre, a.descripcion 
             FROM Articulo_Pedido ap 
             JOIN Articulo a ON ap.id_articulo = a.id 
             WHERE ap.id_pedido = ?`,
            [idPedido]
        );

        if (results.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontraron artículos para este pedido"
            });
        }

        res.json({
            status: "ok",
            datos: results
        });
    } catch (error) {
        console.error('Error en GET /articulo-pedido/pedido:', error);
        res.status(500).json({
            status: "error",
            mensaje: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;