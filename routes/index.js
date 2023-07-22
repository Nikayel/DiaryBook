const express = require("express")
const router = express.Router()





//making get req to /

router.get("/",function(req,res){
  res.render("Login",{
    layout:"login",
  })
})


router.get("/dashboard",function(req,res){
  res.render("dashboard");
})

module.exports = router
