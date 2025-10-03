require("dotenv").config();
const express = require("express");
const session = require('express-session');
const companyRouter =require ("./router/companyRouter");
const computerRouter = require ("./router/computerRouter");
const employeeRouter = require("./router/employeeRouter");
const sendMail = require("./router/mailer");

const app = express();

app.use(express.json());

// Route to send email
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    const info = await sendMail(to, subject, text);

    res.json({ message: "Email sent!", id: info.messageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'keep_your_nose_out_of_my_business',
    resave: true,
    saveUninitialized: true,
}));


app.use(companyRouter);
app.use(computerRouter);
app.use(employeeRouter);


app.listen(process.env.PORT, () =>{
    console.log("Ecoute sur la port 3000");
});

