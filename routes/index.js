const express = require("express");
const router = express.Router();
const { authenticateUser, guestAuthenticate } = require("../middleware/auth");
const Diary = require("../models/Diary");

// Making GET request to "/"
router.get("/", guestAuthenticate, function(req, res) {
  res.render("Login", {
    layout: "login",
  });
});

router.get("/dashboard", authenticateUser, async function(req, res) {
  try {
    const diaries = await Diary.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      diaries // Corrected variable name from "stories" to "diaries"
    });
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
});

module.exports = router;
