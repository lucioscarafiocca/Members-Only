function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.admin == true) {
    next()
  } else {
    res.redirect("/")
  }
}

function isUser(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect("/")
  }
}

module.exports = {
  isAdmin,
  isUser,
}
