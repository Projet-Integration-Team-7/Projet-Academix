const express = require("express")
const router = express.Router()
const User = require("../models/user")

const bodyParser= require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

//page pour se connecter
router.get("/login",(req,res) => {
    res.render('login')
    }).post('/login', async (req,res) =>{
        const{email, password} = req.body;
        if(!email || !password){
            return res.status(400).send("Veuillez remplir tous les champs")
        }
        try{
            //Trouver username ou email 
            let user = await User.findOne({email});
            if(!user || password != user.password){
                return res.status(400).send("Mot de passe ou email incorrecte")
            }
           return res.redirect("/user/account");
        }catch (err){
            return res.status(500);
        }
    })

router.get("/register", (req,res) =>{
    res.render('register')
    }).post("/register", async(req,res) =>{
        const {username, email, password} = req.body;
        //validate that all fields are filled
        if(!username || !email ||!password){
            return res.status(400).send("Veuillez remplir tous les champs")
        }

        try{
            //check if already exists or no
            let previousUser = await User.findOne({email});
            if (previousUser){
                return res.status(400).send("Vous avez déjà un compte associé à cette adresse mail")
            }

            //Create new user
            const newUser = new User({username, email, password})
            await newUser.save();
            return res.status(201).redirect("/user/login")
        }catch(err){
            return res.status(500)
        }
    })

module.exports = router
