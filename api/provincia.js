const express = require('express');
const { conexion } = require('../db/conexion.js')
const router = express.Router();

router.get('/',function(req, res, next){
    //obtiene Provincia
    const { id } = req.query;
    console.log(id);
    if (id !==undefined) {
        const sql = "SELECT * FROM Provincia WHERE id =?";
        
        conexion.query(sql,[id], function(error, result){
            if (error){
                console.error(error);
                return res.json.status(500).send(error);
            }
            console.log(result);
            
            res.json({
                status: "ok",
                Provincia:result 
            })

    })
    } else {
        const sql = "SELECT * FROM Provincia";
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
    //guardar una Provincia

    const { nombre } = req.body;
    console.log(nombre );
    

    const sql = "INSERT INTO Provincia "+"(`nombre`) "+" VALUES (?)"

    conexion.query(sql, [nombre ],function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        console.log(result);
        res.json({status:"ok", Provincia_id: result.insertId})
    })
})

router.put('/',function (req, res, next) {
    //actualizar datos de una Provincia

    const { id } = req.query;
    const { nombre } = req.body;
    console.log(nombre );
    

    const sql = "UPDATE Provincia SET "+ "nombre =? "+ "WHERE id= ?"
    
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
    //delete elimina una Provincia
    
    const { id } = req.query;

    const sql = "DELETE FROM Provincia where id= ?"
    
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