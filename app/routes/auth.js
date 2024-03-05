const { Router} = require('express')
const passport = require('passport')
const User = require('../models/User')

const router = Router()

router.get('/user', (req,res) => {
    if(req.user){
        res.json({user: req.user.username})
    } else {
        res.json({user: null})
    }
})

module.exports = router