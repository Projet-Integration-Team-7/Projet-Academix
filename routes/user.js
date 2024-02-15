const express = require("express")
const router = express.Router()

//page pour se connecter
router.get("/login",(req,res) => {
    res.send("Connectez vous à votre compte")
    })

router.get("/register", (req,res) =>{
    res.send("Créez un compte")
    })

module.exports = router
