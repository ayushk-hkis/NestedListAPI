const express = require('express')
const bodyParser = require('body-parser')
const listRoutes = require('./routes/ListRoute')
const app = express()
const PORT = process.env.PORT || 2001

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/list', listRoutes)

app.listen(PORT, () => {
    console.log(`App is perfectly running on port no. ${PORT}`)
})