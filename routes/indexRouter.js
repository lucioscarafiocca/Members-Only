const { Router } = require("express")
const indexRouter = Router()
const mainController = require("../controllers/mainController")
const passport = require("passport")
const authMiddleware = require("./authMiddleware")

indexRouter.get("/", mainController.indexGet)
indexRouter.get("/sign-up", mainController.signUpGet)
indexRouter.post("/sign-up", mainController.signUpPost)
indexRouter.get("/log-in", mainController.logInGet)
indexRouter.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  })
)
indexRouter.get("/log-out", mainController.logOutGet)
indexRouter.get(
  "/new/message",
  authMiddleware.isUser,
  mainController.NewMessageGet
)
indexRouter.post("/new/message", mainController.NewMessagePost)
indexRouter.get("/club", mainController.clubGet)
indexRouter.post("/club", mainController.clubPost)
indexRouter.post("/delete", authMiddleware.isAdmin, mainController.DeletePost)

module.exports = indexRouter
