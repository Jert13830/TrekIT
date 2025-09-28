const express = require("express");
const session = require('express-session');
const companyRouter =require ("./router/companyRouter");
const computerRouter = require ("./router/computerRouter");

const port = 3000;
const app = express();

app.use(express.static("./public"));
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'votre_secret_key',
    resave: true,
    saveUninitialized: true,
}));


app.use(companyRouter);
app.use(computerRouter);


app.listen(port,()=>{
    console.log("Ecoute sur la port 3000");
});

