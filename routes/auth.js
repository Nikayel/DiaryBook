const express = require("express");
const router = express.Router();
const passport = require("passport");

// Auth with Google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// Google callback
// get req to auth/google/callback
// redirect to dash if success
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// Logging out the user
// route would be /auth/logout
router.get("/logout", (req, res) => {
  // Use the callback function to handle errors
  req.logout(function (err) {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.redirect("/");
  });
});

module.exports = router;
