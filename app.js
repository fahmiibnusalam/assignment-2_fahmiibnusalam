// modul - modul
const jwt = require("jsonwebtoken")
const fs = require("fs")
const express = require("express")
const app = express()

app.use(express.urlencoded({ extended: true }))

// Route ganti
app.post("/login", (req, res) => {
  const { username, password } = req.body

  const readUserFile = fs.readFileSync("./data/users.json", "utf-8")
  const convertToJSON = JSON.parse(readUserFile)

  const userMatch = convertToJSON.find((user) => user.username === username)
  if (userMatch && userMatch.password === password) {
    res.send("Data Valid")
    const data = {
      username: userMatch.username,
      password: userMatch.password,
    }
    jwt.sign(
      {
        data: data,
      },
      "secret",
      (err, token) => {
        console.log(`Token Anda: ${token}`)
      }
    )
  } else if (userMatch && userMatch.password !== password) {
    res.send("Password Salah")
  } else {
    res.send("Data tidak valid!")
  }
})

//  verifikasi
const verifikasi = (req, res, next) => {
  let getHeader = req.headers["auth"]
  if (typeof getHeader !== "undefined") {
    req.token = getHeader
    next()
  } else {
    res.sendStatus(403)
  }
}

// Routing data teachers
app.get("/get-data-teachers", verifikasi, (req, res) => {
  jwt.verify(req.token, "secret", (err, auth) => {
    if (err) {
      res.sendStatus(403)
    } else {
      const users = fs.readFileSync("./data/teachers.json", "utf-8")
      const convertToJSON = JSON.parse(users)
      res.json(convertToJSON)
    }
  })
})

app.listen(3000, () => {
  console.log("Listening at http://localhost:3000")
})
