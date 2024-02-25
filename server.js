const express = require('express');
const app = express();
const ejs = require('ejs');

// Setup connection to database (MongoDB)
const mongoose = require('mongoose'); 
const DB_URI = "mongodb://localhost/projet7"
mongoose.connect(DB_URI)
.then(() => console.log("Successfully connected to MongoDB"))
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process if unable to connect to MongoDB
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/view');

// Page d'accueil
app.get('/', async (req, res) => {
    res.render('index')
});

// Router de login-register
const userRouter = require('./routes/user');
app.use('/user', userRouter);

//router de page d'accueil
const homeRouter = require('./routes/home');
app.use('/home', homeRouter)

app.listen(3000, () => {
    console.log("Server running on port 3000");
});