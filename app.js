const express = require("express")
const indexRouter = require("./routes/indexRouter")
const path = require("node:path")
const session = require("express-session")
const passport = require("passport")

app = express()
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }))
require("./config/passport")
app.use(passport.session())

app.use("/", indexRouter)

const PORT = 3000
app.listen(PORT, () => {
  console.log(`My first Express app - listening on port ${PORT}!`)
})
