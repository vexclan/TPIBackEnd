const express=require("express");
const apiRouter=require("./api/main");
const app=express();
const port=3000;

app.use(express.json());

app.get("/", function(req, res, next){
    res.send("App personas")
});

app.use("/api",apiRouter);

app.listen(port,()=>{
    console.log(`Servidor en puerto ${port}`);
});