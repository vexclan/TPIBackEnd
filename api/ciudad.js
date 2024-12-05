const express = require('express');
const { conexion } = require('../db/conexion.js')
const router = express.Router();
console.log('Ciudad');


router.get('/',function(req, res, next){
    //obtiene Ciudad
    const { id } = req.query;
    console.log('id :',id);
    if (id !==undefined) {
        const sql = "SELECT * FROM Ciudad WHERE id =?";
        
        conexion.query(sql,[id], function(error, result){
            if (error){
                console.error(error);
                return res.json.status(500).send(error);
            }
            console.log(result);
            
            res.json({
                status: "ok",
                Ciudad:result 
            })

    })
    } else {
        const sql = "SELECT * FROM Ciudad";
    conexion.query(sql, function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        res.json({
            status: "ok",
            Ciudad:result 
        })
    })

    }

})

router.post('/',function (req, res, next) {
    //guardar un Ciudad

    const { nombre } = req.body;
    console.log(nombre );
    

    const sql = "INSERT INTO Ciudad "+"(nombre) "+" VALUES (?)"

    conexion.query(sql, [nombre ],function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        console.log(result);
        res.json({status:"ok", Ciudad_id: result.insertId})
    })
})

router.put('/',function (req, res, next) {
    //actualizar datos de un Ciudad

    const { id } = req.query;
    const { nombre } = req.body;
    console.log(nombre );
    

    const sql = "UPDATE Ciudad SET "+ "nombre =? "+ "WHERE id= ?"
    
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
    //delete elimina un Ciudad
    
    const { id } = req.query;

    const sql = "UPDATE Ciudad SET activo = 1 where id= ?"
    
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