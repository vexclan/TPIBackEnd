const router=require("express").Router();
const{ verificarToken }=require("@damianegreco/hashpass");

const TOKEN_SECRET = "PRUEBA1 12312gqwkjudnjfasigqw";

const clienteRouter=require("./cliente");
const pedidoRouter=require("./pedido");
const articuloPedidoRouter=require("./articulo_pedido");
const direccionRouter=require("./direccion");
const ciudadRouter=require("./ciudad");
const articuloRouter=require("./articulo");
const usuariosRouter=require("./usuarios");
const paisRouter=require("./pais");
const provinciaRouter=require("./provincia");
const administradorRouter=require("./administrador");

router.use("/pais",function (req, res, next){
    const token = req.headers.authorization;
    console.log('token pais : ', token);
    
    const verificacion = verificarToken(token, TOKEN_SECRET);
    if (verificacion?.data  !== undefined) {
        next();
    } else {
        console.error(verificacion);
        res.status(403).json({status:'error', error: verificacion})
    }
});

router.use("/pedido",function (req, res, next){
    const token = req.headers.authorization;
    console.log('token pedido : ', token);
    
    const verificacion = verificarToken(token, TOKEN_SECRET);
    if (verificacion?.data  !== undefined) {
        next();
    } else {
        console.error(verificacion);
        res.status(403).json({status:'error', error: verificacion})
    }
});

router.use("/articuloPedido",function (req, res, next){
    const token = req.headers.authorization;
    console.log('token articuloPedido : ', token);
    
    const verificacion = verificarToken(token, TOKEN_SECRET);
    if (verificacion?.data  !== undefined) {
        next();
    } else {
        console.error(verificacion);
        res.status(403).json({status:'error', error: verificacion})
    }
});

router.use("/cliente",function (req, res, next){
    const token = req.headers.authorization;
    console.log('token cliente : ', token);
    
    const verificacion = verificarToken(token, TOKEN_SECRET);
    if (verificacion?.data  !== undefined) {
        next();
    } else {
        console.error(verificacion);
        res.status(403).json({status:'error', error: verificacion})
    }
});

router.use("/provincia",function (req, res, next){
    const token = req.headers.authorization;
    console.log('token provincia : ', token);
    
    const verificacion = verificarToken(token, TOKEN_SECRET);
    if (verificacion?.data  !== undefined) {
        next();
    } else {
        console.error(verificacion);
        res.status(403).json({status:'error', error: verificacion})
    }
});

router.use("/articulo",function (req, res, next){
    const token = req.headers.authorization;
    console.log('comprobando token en articulo : ',token);
    
    const verificacion = verificarToken(token, TOKEN_SECRET);
    if (verificacion?.data  !== undefined) {
        next();
    } else {
        console.error(verificacion);
        res.status(403).json({status:'error', error: verificacion})
    }
});

router.use("/administrador",function (req, res, next){
    const token = req.headers.authorization;
    console.log('token administrador : ', token);
    
    const verificacion = verificarToken(token, TOKEN_SECRET);
    if (verificacion?.data  !== undefined) {
        next();
    } else {
        console.error(verificacion);
        res.status(403).json({status:'error', error: verificacion})
    }
});

router.use("/direccion",function (req, res, next){
    const token = req.headers.authorization;
    console.log('token direccion : ', token);
    
    const verificacion = verificarToken(token, TOKEN_SECRET);
    if (verificacion?.data  !== undefined) {
        next();
    } else {
        console.error(verificacion);
        res.status(403).json({status:'error', error: verificacion})
    }
});

router.use("/ciudad",function (req, res, next){
    const token = req.headers.authorization;
    console.log('token ciudad : ', token);
    
    const verificacion = verificarToken(token, TOKEN_SECRET);
    if (verificacion?.data  !== undefined) {
        next();
    } else {
        console.error(verificacion);
        res.status(403).json({status:'error', error: verificacion})
    }
});


router.use("/cliente",clienteRouter);
router.use("/pedido",pedidoRouter);
router.use("/articuloPedido",articuloPedidoRouter);
router.use("/ciudad",ciudadRouter);
router.use("/direccion",direccionRouter);
router.use("/administrador",administradorRouter);
router.use("/pais",paisRouter);
router.use("/usuarios",usuariosRouter);
router.use("/articulo",articuloRouter);
router.use("/provincia",provinciaRouter);

module.exports=router;