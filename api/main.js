const router=require("express").Router();
const{ verificarToken }=require("@damianegreco/hashpass");

const TOKEN_SECRET = "PRUEBA1 12312gqwkjudnjfasigqw";

const articuloRouter=require("./articulo");
const usuariosRouter=require("./usuarios");

router.use("/articulo",function (req, res, next){
    const token = req.headers.authorization;
    console.log(token);
    
    const verificacion = verificarToken(token, TOKEN_SECRET);
    if (verificacion?.data  !== undefined) {
        next();
    } else {
        console.error(verificacion);
        res.status(403).json({status:'error', error: verificacion})
    }
});

router.use("/usuarios",usuariosRouter);
router.use("/articulo",articuloRouter);

module.exports=router;