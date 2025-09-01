const db = require("../db/queries")
const { body, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const { render } = require("ejs")

const alphaErr = "must only contain letters"
const emailErr = "must be an email"
const lengthErr = "must be a maximum of 15 characters"
const matchErr = "must be the same"
const validateUser = [
  body("username").trim().isEmail().withMessage(`Username ${emailErr}`),
  body("password")
    .trim()
    .isLength({ max: 15 })
    .withMessage(`Password ${lengthErr}`),
  body("passwordConfirmation")
    .trim()
    .custom((value, { req }) => {
      return value == req.body.password
    })
    .withMessage(`Passwords ${matchErr}`),
  body("firstName").trim().isAlpha().withMessage(`Name ${alphaErr}`),
  body("lastName").trim().isAlpha().withMessage(`Last Name ${alphaErr}`),
]

async function indexGet(req, res) {
  const msg = await db.GetAllMessages()
  if (req.isAuthenticated()) {
    if (req.user.membership_status) {
      res.render("indexClub", { user: req.user, messages: msg })
    } else {
      res.render("indexLogged", { user: req.user, messages: msg })
    }
  } else {
    res.render("index", { messages: msg })
  }
}

async function signUpGet(req, res) {
  values = {
    username: "",
    password: "",
    passwordConfirmation: "",
    firstName: "",
    lastName: "",
  }
  res.render("sign-up", { values: values })
}

const signUpPost = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up", {
        values: req.body,
        errors: errors.array(),
      })
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const fullname = req.body.firstName + req.body.lastName
      await db.PostUser(
        req.body.username,
        hashedPassword,
        fullname,
        req.body.admin == "on" ? true : false
      )
      res.redirect("/")
    }
  },
]

async function logInGet(req, res) {
  values = { username: "", password: "" }
  res.render("log-in", { values })
}

async function logInPost(req, res) {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
}

async function logOutGet(req, res) {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect("/")
  })
}

async function NewMessageGet(req, res) {
  res.render("message")
}

const messageErr = "must only contain alphanumerical characters"
const messageLengthErr = "must be a maximum of 120 characters"

const validateMessage = [
  body("title").trim().isLength({ max: 15 }).withMessage(`Title ${lengthErr}`),
  body("text")
    .trim()
    .isString()
    .withMessage(`Text ${messageErr}`)
    .isLength({ max: 120 })
    .withMessage(`Text ${messageLengthErr}`),
]

const NewMessagePost = [
  validateMessage,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).render("message", {
        errors: errors.array(),
      })
    } else {
      const { title, text } = req.body
      const id = req.user.id
      await db.PostMessage(title, text, id)
      res.redirect("/")
    }
  },
]

async function clubGet(req, res) {
  res.render("club")
}

async function clubPost(req, res) {
  const secretpassword = "cats"
  const password = req.body.password
  if (secretpassword == password) {
    await db.SetMembership(req.user.id)
    res.redirect("/")
  } else {
    res.render("club", { error: "Wrong code" })
  }
}

async function DeletePost(req, res) {
  const id = req.body.id
  await db.DeleteMessage(id)
  res.redirect("/")
}

module.exports = {
  indexGet,
  signUpGet,
  signUpPost,
  logInGet,
  logInPost,
  logOutGet,
  NewMessageGet,
  NewMessagePost,
  clubGet,
  clubPost,
  DeletePost,
}
