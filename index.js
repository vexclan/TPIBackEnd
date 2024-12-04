const express=require("express");
const apiRouter=require("./api/main");
const app=express();
const cors = require('cors')
const port=3000;
const path = require('path');

app.use(express.json());
app.use(cors())

app.use('/imagenes', express.static(path.join(__dirname, './imagenes')));

app.get("/", function(req, res, next){
    res.send("App cafeteria")
});

app.use("/api",apiRouter);

app.listen(port,()=>{
    console.log(`Servidor en puerto ${port}`);
});