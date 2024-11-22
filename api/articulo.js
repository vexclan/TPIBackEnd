const express = require('express');
const { conexion } = require('../db/conexion.js')
const router = express.Router();
const multer = require('multer')
const upload = multer({dest:'imagenes/'})
const fs = require('node:fs')

router.get('/',function(req, res, next){
    //obtiene Articulo
    const { id } = req.query;
    console.log('id : ',id);
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
    console.log(nombre , descripcion , precio , imagen , activo);
    
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

router.put('/',function (req, res, next) {
    //actualizar datos de un Articulo

    const { id } = req.query;
    const { nombre , decripcion , precio } = req.body;
    console.log(nombre , decripcion , precio , id);
    

    const sql = "UPDATE Articulo SET nombre =?, decripcion =?, precio =? WHERE id= ?"
    
    conexion.query(sql, [nombre , decripcion , precio , id],function(error, result){
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