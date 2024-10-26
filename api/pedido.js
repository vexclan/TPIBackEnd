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

const validarPedido = (req, res, next) => {
    const { idCliente, fechaEnvio, total, formaPago, articulos } = req.body;
    
    if (!idCliente || !Number.isInteger(parseInt(idCliente))) {
        return res.status(400).json({
            status: "error",
            mensaje: "ID de cliente inválido"
        });
    }

    if (!fechaEnvio || !Date.parse(fechaEnvio)) {
        return res.status(400).json({
            status: "error",
            mensaje: "Fecha de envío inválida"
        });
    }

    if (!total || typeof total !== 'number' || total <= 0) {
        return res.status(400).json({
            status: "error",
            mensaje: "Total inválido"
        });
    }

    if (!formaPago || typeof formaPago !== 'string' || formaPago.trim().length === 0) {
        return res.status(400).json({
            status: "error",
            mensaje: "Forma de pago inválida"
        });
    }

    if (!Array.isArray(articulos) || articulos.length === 0) {
        return res.status(400).json({
            status: "error",
            mensaje: "Debe incluir al menos un artículo"
        });
    }

    next();
};

router.get('/', validarId, async (req, res) => {
    try {
        const { id } = req.query;
        let sql, params = [];

        if (id !== undefined) {
            sql = `
                SELECT p.*, ap.idArticulo, ap.cantidad, ap.precio 
                FROM Pedido p 
                LEFT JOIN ArticuloPedido ap ON p.id = ap.idPedido 
                WHERE p.id = ?
            `;
            params = [id];
        } else {
            sql = `
                SELECT p.*, c.correo as clienteCorreo 
                FROM Pedido p 
                JOIN Cliente c ON p.idCliente = c.id
            `;
        }

        const [results] = await conexion.promise().query(sql, params);

        if (id) {
            if (results.length === 0) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "Pedido no encontrado"
                });
            }
            
            const pedido = {
                ...results[0],
                articulos: results.map(row => ({
                    idArticulo: row.idArticulo,
                    cantidad: row.cantidad,
                    precio: row.precio
                }))
            };
            delete pedido.idArticulo;
            delete pedido.cantidad;
            delete pedido.precio;

            return res.json({
                status: "ok",
                datos: pedido
            });
        }

        res.json({
            status: "ok",
            datos: results
        });
    } catch (error) {
        console.error('Error en GET /pedido:', error);
        res.status(500).json({
            status: "error",
            mensaje: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.post('/', validarPedido, async (req, res) => {
    const connection = await conexion.promise();
    try {
        await connection.beginTransaction();

        const { idCliente, fechaEnvio, total, formaPago, articulos } = req.body;

        const [resultPedido] = await connection.query(
            "INSERT INTO Pedido (idCliente, fechaEnvio, total, formaPago) VALUES (?, ?, ?, ?)",
            [idCliente, fechaEnvio, total, formaPago]
        );

        const idPedido = resultPedido.insertId;

        for (const articulo of articulos) {
            await connection.query(
                "INSERT INTO ArticuloPedido (idPedido, idArticulo, cantidad, precio) VALUES (?, ?, ?, ?)",
                [idPedido, articulo.idArticulo, articulo.cantidad, articulo.precio]
            );
        }

        await connection.commit();

        res.status(201).json({
            status: "ok",
            mensaje: "Pedido creado exitosamente",
            id: idPedido
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error en POST /pedido:', error);
        res.status(500).json({
            status: "error",
            mensaje: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.put('/', [validarId, validarPedido], async (req, res) => {
    const connection = await conexion.promise();
    try {
        await connection.beginTransaction();

        const { id } = req.query;
        const { idCliente, fechaEnvio, total, formaPago, articulos } = req.body;

        const [resultPedido] = await connection.query(
            "UPDATE Pedido SET idCliente = ?, fechaEnvio = ?, total = ?, formaPago = ? WHERE id = ?",
            [idCliente, fechaEnvio, total, formaPago, id]
        );

        if (resultPedido.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({
                status: "error",
                mensaje: "Pedido no encontrado"
            });
        }

        await connection.query("DELETE FROM ArticuloPedido WHERE idPedido = ?", [id]);

        for (const articulo of articulos) {
            await connection.query(
                "INSERT INTO ArticuloPedido (idPedido, idArticulo, cantidad, precio) VALUES (?, ?, ?, ?)",
                [id, articulo.idArticulo, articulo.cantidad, articulo.precio]
            );
        }

        await connection.commit();

        res.json({
            status: "ok",
            mensaje: "Pedido actualizado exitosamente"
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error en PUT /pedido:', error);
        res.status(500).json({
            status: "error",
            mensaje: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.delete('/', validarId, async (req, res) => {
    const connection = await conexion.promise();
    try {
        await connection.beginTransaction();

        const { id } = req.query;

        await connection.query("DELETE FROM ArticuloPedido WHERE idPedido = ?", [id]);

        const [result] = await connection.query("DELETE FROM Pedido WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({
                status: "error",
                mensaje: "Pedido no encontrado"
            });
        }

        await connection.commit();

        res.json({
            status: "ok",
            mensaje: "Pedido eliminado exitosamente"
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error en DELETE /pedido:', error);
        res.status(500).json({
            status: "error",
            mensaje: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;