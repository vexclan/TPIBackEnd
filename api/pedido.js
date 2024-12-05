const express = require('express');
const { conexion } = require('../db/conexion.js')
const router = express.Router();
console.log('Pedido');


router.get('/',function(req, res, next){
    //obtiene Pedido
    const { id } = req.query;
    console.log('id :',id);
    if (id !==undefined) {
        const sql = "SELECT * FROM `Pedido` WHERE id =?";
        
        conexion.query(sql,[id], function(error, result){
            if (error){
                console.error(error);
                return res.json.status(500).send(error);
            }
            console.log(result);
            
            res.json({
                status: "ok",
                Pedido:result 
            })

    })
    } else {
        const sql = "SELECT * FROM `Pedido` ";
    conexion.query(sql, function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        res.json({
            status: "ok",
            Pedido:result 
        })
    })

    }

})

router.post('/',function (req, res, next) {
    //guardar un Pedido

    const {  id_de_cliente , precio_de_envio , fecha , total , forma_de_pago , activo } = req.body;
    console.log( id_de_cliente , precio_de_envio , fecha , total , forma_de_pago , activo );
    

    const sql = "INSERT INTO `Pedido` ( `id_de_cliente`, `precio_de_envio`, `fecha`, `total`, `forma_de_pago`, `activo`) VALUES (?,?,?,?,?,?)"

    conexion.query(sql, [ id_de_cliente , precio_de_envio , fecha , total , forma_de_pago , activo ],function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        console.log(result);
        res.json({status:"ok", Pedido_id: result.insertId})
    })
})

router.put('/',function (req, res, next) {
    //actualizar datos de un Pedido

    const { id } = req.query;
    const {  id_de_cliente , precio_de_envio , fecha , total , forma_de_pago , activo } = req.body;
    console.log( id_de_cliente , precio_de_envio , fecha , total , forma_de_pago , activo );
    

    const sql = "UPDATE Pedido SET id_de_cliente=? , precio_de_envio=? , fecha=? , total=? , forma_de_pago=? , activo =? WHERE id= ?"
    
    conexion.query(sql, [ id_de_cliente , precio_de_envio , fecha , total , forma_de_pago , activo , id],function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        console.log(result);
        res.json({status:"ok"})
    })


})

router.delete('/',function (req, res, next) {
    //delete elimina un Pedido
    
    const { id } = req.query;

    const sql = "UPDATE Pedido SET activo = 1 where id= ?"
    
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