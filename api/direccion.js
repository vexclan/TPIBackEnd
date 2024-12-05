const express = require('express');
const { conexion } = require('../db/conexion.js')
const router = express.Router();

router.get('/',function(req, res, next){
    //obtiene Direccion
    const { id } = req.query;
    console.log('id :',id);
    if (id !==undefined) {
        const sql = "select  D.* , PA.nombre as pais , PO.nombre as provincia , C.nombre as ciudad from Direccion as D join Pais as PA on PA.id = D.id_pais join Provincia as PO on PO.id = D.id_provincia JOIN Ciudad as C ON C.id = D.id_ciudad WHERE D.id =?";
        
        conexion.query(sql,[id], function(error, result){
            if (error){
                console.error(error);
                return res.json.status(500).send(error);
            }
            console.log(result);
            
            res.json({
                status: "ok",
                Direccion:result 
            })

    })
    } else {
        const sql = "select  D.* , PA.nombre as pais , PO.nombre as provincia , C.nombre as ciudad from Direccion as D join Pais as PA on PA.id = D.id_pais join Provincia as PO on PO.id = D.id_provincia JOIN Ciudad as C ON C.id = D.id_ciudad;";
    conexion.query(sql, function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        res.json({
            status: "ok",
            Direccion:result 
        })
    })

    }

})

router.post('/',function (req, res, next) {
    //guardar una Direccion

    const { id_cliente, calle, código_postal, id_provincia, id_ciudad, id_pais, activo } = req.body;
    console.log( ' id_cliente, calle, código_postal, id_provincia, id_ciudad, id_pais, activo : ', id_cliente, calle, código_postal, id_provincia, id_ciudad, id_pais, activo );
    

    const sql = "INSERT INTO `Direccion`( `id_cliente`, `calle`, `código_postal`, `id_provincia`, `id_ciudad`, `id_pais`, `activo`) VALUES (? , ? , ? , ? , ? , ? , ?)"

    conexion.query(sql, [id_cliente, calle, código_postal, id_provincia, id_ciudad, id_pais, activo],function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        console.log(result);
        res.json({status:"ok", Direccion_id: result.insertId})
    })
})

router.put('/',function (req, res, next) {
    //actualizar datos de una Direccion

    const { id } = req.query;
    const { id_cliente, calle, código_postal, id_provincia, id_ciudad, id_pais, activo } = req.body;
    console.log( id_cliente, calle, código_postal, id_provincia, id_ciudad, id_pais, activo );
    

    const sql = "UPDATE Direccion SET  id_cliente=?, calle=?, código_postal=?, id_provincia=?, id_ciudad=?, id_pais=?, activo=?  WHERE id= ?"
    
    conexion.query(sql, [ id_cliente, calle, código_postal, id_provincia, id_ciudad, id_pais, activo , id],function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        console.log(result);
        res.json({status:"ok"})
    })


})

router.delete('/',function (req, res, next) {
    //delete elimina una Direccion
    
    const { id } = req.query;
    console.log('delete : id : ',id);
    

    const sql = "UPDATE Direccion SET activo = 1 where id= ?"
    
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