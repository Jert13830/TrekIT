const express = require("express");
const companyRouter =require ("./router/companyRouter");

const port = 3000;
const app = express();

app.use(express.static("./public"));
app.use(express.urlencoded({extended: true}));
app.use(companyRouter);

app.listen(port,()=>{
    console.log("Ecoute sur la port 3000");
});

