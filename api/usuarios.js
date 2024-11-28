const router=require("express").Router();
const {conexion}=require("../db/conexion");
const{hashPass, verificarPass, generarToken }=require("@damianegreco/hashpass");

const TOKEN_SECRET = "PRUEBA1 12312gqwkjudnjfasigqw";


const checkUser=function(user){
    return new Promise((resolve, reject) => {
        const sql="SELECT id FROM Usuario WHERE Usuario=?";
        conexion.query(sql,[user],function(error,result){
            if(error)return reject(error);
            if(result.length>0)return reject("Usuario existente");
            return resolve();
        });
    });
}

const guardarUsuario=function(user, passHash){
    return new Promise((resolve, reject) => {
        const sql="INSERT INTO Usuario (Usuario,Contraseña) VALUES(?,?)";
        conexion.query(sql,[user,passHash], function(error,result){
            if(error)return reject(error);
            return resolve(result.insertId);
        })
    });
}

router.post("/",function(req,res,next){
    const {user, pass}=req.body;
    console.log(user , pass);
    

    checkUser(user)
    .then(()=>{
        const passHasheada=hashPass(pass);
        guardarUsuario(user,passHasheada)
        .then((Usuario_id)=>{
            res.json({status:"ok",Usuario_id});
        });
    })
    .catch((error)=>{
        console.error(error);
        res.json({status:"error", error});
    });
});

router.post("/login", function(req,res,next){
    const {user, pass}=req.body;
    console.log(user , pass);    
    const sql = 'SELECT id , Contraseña FROM Usuario WHERE Usuario = ?';
    conexion.query(sql, [user], function(error, result) {
        if (error) {
            console.error(error);
            return res.status(500).json({status:'error',error})
        } 
        if (result.length !== 1){
            console.error('Error al buscar Usuario (Usuario incorrecto)');
            return res.status(403).json({status:'error', error: 'Error al buscar Usuario (Usuario incorrecto)'})
        }
        if (verificarPass(pass, result[0].Contraseña)) {
            console.log("Inicio correctamente");
            const token = generarToken(TOKEN_SECRET, 6 , {Usuario_id:result[0].id, Usuario:user})
            res.json({status:'ok', token});
        } else {
            console.error('Usuario/contraseña incorrecto' , result);
            return res.status(403).json({status:'error', error: 'Usuario/contraseña incorrecto'})

        }
    } )

    //obtener de la db la pass del Usuario (si es que existe)
    //comparamos la pass recibida con la hasheada
        //si existe y coincide la pass: generamos token de auth 

})

module.exports=router;