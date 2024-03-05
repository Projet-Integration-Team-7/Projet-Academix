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
            //sauvegarde user dans la session
            req.session.user = user;
            //si n'a pas de profile redirige vers creation de profil
            if(user.hasProfile){
           return res.redirect("/home");}else{ return res.redirect("/profile/creation")}
        }catch (err){
            return res.status(500);
        }
    })

router.get("/register", (req,res) =>{
    res.render('register', {messages: req.flash()});
    }).post("/register", async(req,res) =>{
        
        const {prenom, nom, email, password, password2, tel, dn, genre} = req.body;
        //validate that all fields are filled
        if(!prenom || !nom || !email || !password|| !password2 || !tel || !dn || !genre){
            console.log("Champs vides");
            req.flash('error', "Veuillez remplir tous les champs")
            return res.redirect('/user/register')
        }else if( password != password2){
            req.flash('error', "Les 2 mots de passes doivent être pareils");
            return res.redirect('/user/register');
        }
        
        try{
            //check if already exists or no
            let previousUser = await User.findOne({email});
            if (previousUser){
                req.flash('error', 'Vous avez déjà un compte associé à cette adresse mail');
                return res.redirect('/user/register');
            }

            //Create new user
        const newUser = new User({prenom, nom, email, password, genre, dn, tel})
        await newUser.save();
        console.log("user created");
        return res.status(201).redirect('/user/login')
    }catch(err){
        console.error(err);
        req.flash('error', err);
        return res.redirect('/user/register');
        }
    })

module.exports = router
