const express = require('express');
const { conexion } = require('../db/conexion.js')
const router = express.Router();


router.get('/',function(req, res, next){
    //obtiene Articulo_Pedido
    const { id } = req.query;
    console.log('id :',id);
    if (id !==undefined) {
        const sql = "select AP.* , A.* FROM Articulo_Pedido as AP join Articulo as A on AP.id_articulo = A.id join Pedido as P on P.id = AP.id_pedido WHERE P.id = ?";
        
        conexion.query(sql,[id], function(error, result){
            if (error){
                console.error(error);
                return res.json.status(500).send(error);
            }
            console.log(result);
            
            res.json({
                status: "ok",
                Articulo_Pedido:result 
            })

    })
    } else {
        const sql = "select AP.* , A.* FROM Articulo_Pedido as AP join Articulo as A on AP.id_articulo = A.id join Pedido as P on P.id = AP.id_pedido ";
    conexion.query(sql, function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        res.json({
            status: "ok",
            Articulo_Pedido:result 
        })
    })

    }

})

router.post('/',function (req, res, next) {
    //guardar un Articulo_Pedido

    const { nombre } = req.body;
    console.log(nombre );
    

    const sql = "INSERT INTO Articulo_Pedido (nombre)  VALUES (?)"

    conexion.query(sql, [nombre ],function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        console.log(result);
        res.json({status:"ok", Articulo_Pedido_id: result.insertId})
    })
})

router.put('/',function (req, res, next) {
    //actualizar datos de un Articulo_Pedido

    const { id } = req.query;
    const { nombre } = req.body;
    console.log(nombre );
    

    const sql = "UPDATE Articulo_Pedido SET nombre =? WHERE id= ?"
    
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
    //delete elimina un Articulo_Pedido
    
    const { id } = req.query;

    const sql = "UPDATE Articulo_Pedido SET activo = 1 where id= ?"
    
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