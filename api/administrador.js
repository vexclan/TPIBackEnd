const express = require('express');
const { conexion } = require('../db/conexion.js')
const router = express.Router();

router.get('/',function(req, res, next){
    //obtiene Administrador
    const { id } = req.query;
    console.log(id);
    if (id !==undefined) {
        const sql = "SELECT * FROM Administrador WHERE id =?";
        
        conexion.query(sql,[id], function(error, result){
            if (error){
                console.error(error);
                return res.json.status(500).send(error);
            }
            console.log(result);
            
            res.json({
                status: "ok",
                Administrador:result 
            })

    })
    } else {
        const sql = "SELECT * FROM Administrador";
        conexion.query(sql, function(error, result){
            if (error){
                console.error(error);
                return res.json.status(500).send(error);
            }
            res.json({
                status: "ok",
                personas:result 
            })
        })

    }

})

router.post('/',function (req, res, next) {
    //guardar una Administrador

    const { id_usuario } = req.body;
    console.log(id_usuario );
    

    const sql = "INSERT INTO Administrador "+"(`id usuario`) "+" VALUES (?)"

    conexion.query(sql, [id_usuario ],function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        console.log(result);
        res.json({status:"ok", Administrador_id: result.insertId})
    })
})

router.put('/',function (req, res, next) {
    //actualizar datos de una Administrador

    const { id } = req.query;
    const { id_usuario } = req.body;
    console.log(id_usuario );
    

    const sql = "UPDATE Administrador SET "+ "id usuario =? "+ "WHERE id= ?"
    
    conexion.query(sql, [id_usuario , id],function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        console.log(result);
        res.json({status:"ok"})
    })


})

router.delete('/',function (req, res, next) {
    //delete elimina una Administrador
    
    const { id } = req.query;

    const sql = "DELETE FROM Administrador where id= ?"
    
    conexion.query(sql, [id],function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        console.log(result);
        res.json({status:"ok"})
    })
})


module.exports = router;