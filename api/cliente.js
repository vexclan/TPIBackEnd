const express = require('express');
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


module.exports = router;