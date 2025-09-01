const pool = require("./pool")

async function PostUser(username, password, fullname, admin) {
  await pool.query(
    "INSERT INTO users (username, password, membership_status, fullname, admin) VALUES ($1,$2,$3,$4,$5)",
    [username, password, false, fullname, admin]
  )
}

async function PostMessage(title, text, usernameId) {
  await pool.query(
    "INSERT INTO messages (title, text, user_id) VALUES ($1,$2,$3)",
    [title, text, usernameId]
  )
}

async function GetAllMessages() {
  let result = []
  const { rows } = await pool.query("SELECT * FROM messages")
  for (let msg of rows) {
    const fullname = await pool.query(
      "SELECT fullname FROM users JOIN messages ON users.id = messages.user_id WHERE  messages.id = $1",
      [msg.id]
    )
    result.push({ ...msg, fullname: fullname.rows[0].fullname })
  }
  return result
}

async function GetFullName(user_id) {
  const { rows } = await pool.query(
    "SELECT fullname FROM users JOIN messages ON users.id = messages.user_id WHERE users.id = $1",
    [user_id]
  )
  return rows
}

async function SetMembership(user_id) {
  await pool.query(
    "UPDATE users SET membership_status = $1 WHERE users.id = $2",
    [true, user_id]
  )
}

async function DeleteMessage(id) {
  await pool.query("DELETE FROM messages WHERE messages.id = $1", [id])
}
module.exports = {
  PostUser,
  PostMessage,
  GetAllMessages,
  GetFullName,
  SetMembership,
  DeleteMessage,
}
