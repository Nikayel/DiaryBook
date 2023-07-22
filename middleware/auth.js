module.exports = {
  authenticateUser: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  },
  guestAuthenticate: function(req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect("/dashboard");
    } else {
      return next();
    }
  }
};

//making this part so when the user is logged out they cant go back to Dashboard
//and if they are signed in they shouldnt be redirected to login page
