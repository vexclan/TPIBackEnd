const express = require('express');
const { conexion } = require('../db/conexion.js')
const router = express.Router();

router.get('/',function(req, res, next){
    //obtiene Pais
    const { id } = req.query;
    console.log(id);
    if (id !==undefined) {
        const sql = "SELECT * FROM Pais WHERE id =?";
        
        conexion.query(sql,[id], function(error, result){
            if (error){
                console.error(error);
                return res.json.status(500).send(error);
            }
            console.log(result);
            
            res.json({
                status: "ok",
                Pais:result 
            })

    })
    } else {
        const sql = "SELECT * FROM Pais";
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
    //guardar un Pais

    const { nombre } = req.body;
    console.log(nombre );
    

    const sql = "INSERT INTO Pais "+"(`nombre`) "+" VALUES (?)"

    conexion.query(sql, [nombre ],function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        console.log(result);
        res.json({status:"ok", Pais_id: result.insertId})
    })
})

router.put('/',function (req, res, next) {
    //actualizar datos de un Pais

    const { id } = req.query;
    const { nombre } = req.body;
    console.log(nombre );
    

    const sql = "UPDATE Pais SET "+ "nombre =? "+ "WHERE id= ?"
    
    conexion.query(sql, [nombre , id],function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        console.log(result);
        res.json({status:"ok"})
    })


})

router.delete('/',function (req, res, next) {
    //delete elimina un Pais
    
    const { id } = req.query;

    const sql = "DELETE FROM Pais where id= ?"
    
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