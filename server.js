const express = require('express')
const app = express()
const ejs = require('ejs')
app.set('view engine', ejs)
app.set('views', __dirname + '/view');

//page d'accueil
app.get('/',( req,res) =>{

//mettre fichier html ici 
res.render(__dirname + '/view/index.ejs');
})

//router de login-register
const welcomeRouter = require('./routes/user')
app.use('/user', welcomeRouter)



app.listen(3000)