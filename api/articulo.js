const express = require('express');
const { conexion } = require('../db/conexion.js')
const router = express.Router();
const multer = require('multer')
const upload = multer({dest:'imagenes/'})
const fs = require('node:fs')

router.get('/',function(req, res, next){
    //obtiene Articulo
    const { id } = req.query;
    console.log('get : id : ',id);
    if (id !== undefined) {
        const sql = "SELECT * FROM Articulo WHERE id =?";
        
        conexion.query(sql,[id], function(error, result){
            if (error){
                console.error(error);
                return res.json.status(500).send(error);
            }
            console.log(result);
            
            res.json({
                status: "ok",
                Articulo:result 
            })

    })
    } else {
        const sql = "SELECT * FROM Articulo";
    conexion.query(sql, function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        res.json({
            status: "ok",
            Articulos:result 
        })
    })

    }

})

function guardarImagen(file) {
    const imagen = `./imagenes/${file.originalname}`;
    fs.renameSync(file.path, imagen);
    return imagen ;
}



router.post('/', upload.single('imagen') ,function (req, res, next) {
    //guardar un Articulo
  
    console.log('imagen : ',req.file);
    const imagen = guardarImagen(req.file);
    console.log('imagen despues de la funcion : ',imagen)
    
    const { nombre , descripcion , precio , activo } = req.body;
    console.log('post : nombre , descripcion , precio , imagen , activo : ', nombre , descripcion , precio , imagen , activo);
    
    const sql = "INSERT INTO Articulo (`nombre` , `descripcion` , `precio` , `imagen` , `activo`) VALUES (?,?,?,?,?)"

    conexion.query(sql, [nombre , descripcion , precio , imagen , activo],function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        console.log(result);
        res.json({status:"ok", Articulo_id: result.insertId})
    })
})

router.put('/', upload.single('imagen') ,function (req, res, next) {
    //actualizar datos de un Articulo

    console.log('imagen : ',req.file);
    const imagen = guardarImagen(req.file);
    console.log('imagen despues de la funcion : ',imagen)

    const { id } = req.query;
    const { nombre , descripcion , precio } = req.body;
    console.log('put : nombre , descripcion , precio , id :',nombre , descripcion , precio , id);
    

    const sql = "UPDATE Articulo SET nombre =?, descripcion =?, precio =? , imagen =? WHERE id= ?"
    
    conexion.query(sql, [nombre , descripcion , precio , imagen , id],function(error, result){
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
    console.log('delete : id : ',id);
    

    const sql = "UPDATE Articulo SET activo = 1 where id= ?"
    
    conexion.query(sql , [id] ,function(error, result){
        if (error){
            console.error(error);
            return res.json.status(500).send(error);
        }
        console.log(result);
        res.json({status:"ok"})
    })
})


module.exports = router;