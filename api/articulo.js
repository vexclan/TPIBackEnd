const express = require('express');
const { conexion } = require('../db/conexion.js')
const router = express.Router();


/*
params => url (query) ?id=123 = ?id=123
params => url (params) /:id = /123
body => datos

dreate => post   = body 
read =>   get    = params 
update => put    = params y body
delete => delete = params

*/

router.get('/',function(req, res, next){
    //obtiene Articulo
    const { id } = req.query;
    
    const sql = "SELECT * FROM Articulo WHERE id =?";
    conexion.query(sql,[user], function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        res.json({
            status: "ok",
            Articulo:result 
        })
    })

})

router.post('/',function (req, res, next) {
    //guardar un Articulo

    const { nombre , descripcion , precio } = req.body;
    console.log(nombre , descripcion , precio );
    

    const sql = "INSERT INTO Articulo "+"(`nombre` , `decripcion` , `precio`) "+" VALUES (?,?,?)"

    conexion.query(sql, [nombre , descripcion , precio],function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        console.log(result);
        res.json({status:"ok", Articulo_id: result.insertId})
    })
})

router.put('/',function (req, res, next) {
    //actualizar datos de un Articulo

    const { id } = req.query;
    const { nombre , descripcion , precio } = req.body;

    const sql = "UPDATE Articulo SET "+ "documento =?, nombre =?, apellido =?, domicilio =?, telefono =?"+ "where id= ?"
    
    conexion.query(sql, [nombre , descripcion , precio , id],function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        console.log(result);
        res.json({status:"ok"})
    })


})

router.delete('/',function (req, res, next) {
    //delete elimina un Articulo
    
    const { id } = req.query;

    const sql = "DELETE FROM Articulo where id= ?"
    
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