const express = require("express");
const companyRouter =require ("./router/companyRouter");

const port = 3000;
const app = express();
app.use(companyRouter);

app.listen(port,()=>{
    console.log("Ecoute sur la port 3000");
});

