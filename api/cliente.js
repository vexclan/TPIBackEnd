const express = require('express');
<<<<<<< Updated upstream
const { conexion } = require('../db/conexion.js')
const router = express.Router();

router.get('/',function(req, res, next){
    //obtiene Cliente
    const { id } = req.query;
    console.log(id);
    if (id !==undefined) {
        const sql = "SELECT * FROM Cliente WHERE id =?";
        
        conexion.query(sql,[id], function(error, result){
            if (error){
                console.error(error);
                return res.json.status(500).send(error);
            }
            console.log(result);
            
            res.json({
                status: "ok",
                Cliente:result 
            })

    })
    } else {
        const sql = "select  C.* , U.Usuario , COUNT(D.id) as 'Direcciones' from Cliente as C join Usuario as U on C.id_usuario = U.Id join Direccion as D on D.id_cliente = C.id GROUP BY C.id, U.Usuario;";
    conexion.query(sql, function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        res.json({
            status: "ok",
            Cliente:result 
        })
    })

    }

})

router.post('/',function (req, res, next) {
    //guardar una Cliente

    const { Correo , id_usuario , activo } = req.body;
    console.log( ' Correo , id_usuario , activo : ', Correo , id_usuario , activo );
    

    const sql = "INSERT INTO `Cliente`( `Correo`, `id_usuario`, `activo`) VALUES (? , ? , ?)"

    conexion.query(sql, [Correo , id_usuario , activo],function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        console.log(result);
        res.json({status:"ok", Cliente_id: result.insertId})
    })
})

router.put('/',function (req, res, next) {
    //actualizar datos de una Cliente

    const { id } = req.query;
    const { Correo , id_usuario , activo } = req.body;
    console.log( Correo , id_usuario , activo );
    

    const sql = "UPDATE Cliente SET  Correo=? , id_usuario=? , activo=?  WHERE id= ?"
    
    conexion.query(sql, [ Correo , id_usuario , activo , id],function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        console.log(result);
        res.json({status:"ok"})
    })


})

router.delete('/',function (req, res, next) {
    //delete elimina una Cliente
    
    const { id } = req.query;
    console.log('delete : id : ',id);
    

    const sql = "UPDATE Cliente SET activo = 1 where id= ?"
    
    conexion.query(sql, [id],function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        console.log(result);
        res.json({status:"ok"})
    })
    
})

=======
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

const validarNombre = (req, res, next) => {
    const { nombre } = req.body;
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
        return res.status(400).json({
            status: "error",
            mensaje: "El nombre es requerido y debe ser una cadena no vacía"
        });
    }
    next();
};

router.get('/', validarId, async (req, res) => {
    try {
        const { id } = req.query;
        let sql, params = [];

        if (id !== undefined) {
            sql = "SELECT * FROM Pais WHERE id = ?";
            params = [id];
        } else {
            sql = "SELECT * FROM Pais";
        }

        const [results] = await conexion.promise().query(sql, params);

        if (id && results.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "País no encontrado"
            });
        }

        res.json({
            status: "ok",
            datos: id ? results[0] : results
        });
    } catch (error) {
        console.error('Error en GET /pais:', error);
        res.status(500).json({
            status: "error",
            mensaje: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.post('/', validarNombre, async (req, res) => {
    try {
        const { nombre } = req.body;
        const sql = "INSERT INTO Pais (nombre) VALUES (?)";
        
        const [result] = await conexion.promise().query(sql, [nombre]);

        res.status(201).json({
            status: "ok",
            mensaje: "País creado exitosamente",
            id: result.insertId
        });
    } catch (error) {
        console.error('Error en POST /pais:', error);
        res.status(500).json({
            status: "error",
            mensaje: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.put('/', [validarId, validarNombre], async (req, res) => {
    try {
        const { id } = req.query;
        const { nombre } = req.body;

        const sql = "UPDATE Pais SET nombre = ? WHERE id = ?";
        const [result] = await conexion.promise().query(sql, [nombre, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "País no encontrado"
            });
        }

        res.json({
            status: "ok",
            mensaje: "País actualizado exitosamente"
        });
    } catch (error) {
        console.error('Error en PUT /pais:', error);
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
        const sql = "DELETE FROM Pais WHERE id = ?";
        
        const [result] = await conexion.promise().query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "País no encontrado"
            });
        }

        res.json({
            status: "ok",
            mensaje: "País eliminado exitosamente"
        });
    } catch (error) {
        console.error('Error en DELETE /pais:', error);
        res.status(500).json({
            status: "error",
            mensaje: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
>>>>>>> Stashed changes

module.exports = router;