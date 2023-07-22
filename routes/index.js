const express = require("express")
const router = express.Router()
const {authenticateUser, guestAuthenticate} = require("../middleware/auth")




//making get req to /

router.get("/",guestAuthenticate, function(req,res){
  res.render("Login",{
    layout:"login",
  })
})


router.get("/dashboard",authenticateUser, function(req,res){
  res.render("dashboard");
})

module.exports = router
