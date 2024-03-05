const express = require("express");
const multer = require('multer');
const upload = multer({dest :'uploads/'});
const User = require("../models/user");
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const sharp = require('sharp');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

//router pour voir son propre profile
router.get("/", async (req, res, next) => {
    //check si est connecte sinon retour a connection
    if (!req.session.user) {
        return res.redirect("/user/login");
      }
      //affiche profile de la personne 
    try {
      const user = req.session.user;
      res.render('profile', {
        prenom: user.prenom,
        nom: user.nom,
        username: user.username,
        picture: user.picture && user.picture.data ? user.picture.data.toString('base64') : 'ionen_profile',
      });
    } catch (err) {
      return next(err);
    }
  });

//première connection
router.get("/creation", (req,res, next) =>{
// Si décide de modifier sa photo de profil alors l'amene vers la route 
if (req.session.user.picture) {
    res.redirect("/profile/picture");
    //sinon il est redirigé vers le formulaire
  } else {
    res.render("profileCreation",{
        user: req.session.user,
      });
  }
}).post('/creation', upload.single('profilePicture'), async(req,res)=>{
    const { username, bio } = req.body;
  const validationErrors = [];

  if (!username || !bio) {
    return res.render("Veuillez remplir tous les champs");
  }

  //check si le username est libre
  const userExist = await User.findOne({ username: username }).exec();
  console.log(userExist);
  if (userExist) {
    return res.status(400).send("Ce username est déjà utilisé");
  } else {
    // sauvegarde des infos
    req.session.user.username = username;
    req.session.user.bio = bio;
    req.session.save();

    // direction route de confirmation
    res.redirect("/profile/confirm");
  }
});
router.get('/confirm', (req, res, next) => {
    try{
    const user = req.session.user;
  
    res.render("profileConfirm", {
      prenom: user.prenom,
      nom: user.nom,
      username: user.username,
      bio: user.bio,
      picture: req.session.user.picture && req.session.user.picture.data ? req.session.user.picture.data.toString("base64") : '',
    });}catch(err){
        return next(err);
    }
});

router.get('/picture', async (req, res) => {
    // Check if a profile picture exists
  if (!req.session.user.picture) {
    return res.redirect("/profile/creation");
  }

  res.render("profilePicture", {
    picture: req.session.user.picture && req.session.user.picture.data ? req.session.user.picture.data.toString("base64") : '',
  });
  })
//profile picture settings route
.post('/picture', upload.single('profilePicture'), async (req, res) => {
    if (req.file) {
        req.session.user.picture = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }
    
      // Save the user's profile picture
      await req.session.save();
    
      // Redirect to the confirmation route
      res.redirect("/profile/creation");

});
module.exports = router;
