const router=require("express").Router();
const{ verificarToken }=require("@damianegreco/hashpass");

const TOKEN_SECRET = "PRUEBA1 12312gqwkjudnjfasigqw";

const articuloRouter=require("./articulo");

router.use("/articulo",articuloRouter);

router.use("/articulo",function (req, res, next){
    const token = req.headers.authorization;
    const verificacion = verificarToken(token, TOKEN_SECRET);
    if (verificacion?.data  !== undefined) {
        next();
    } else {
        console.error(verificacion);
        res.status(403).json({status:'error', error: verificacion})
    }
});


module.exports=router;