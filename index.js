//Main starting point
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const app = express()
const router = require('./router')

//DB Setup
mongoose.connect('mongodb://localhost/auth', {
  useNewUrlParser: true,
  useCreateIndex: true
})

//App Setup
app.use(morgan('combined'))
app.use(bodyParser.json({ type: '*/*' }))
router(app)

//Server Setup
const server = http.createServer(app)
server.listen(process.env.PORT || 3050, () => {
  console.log('Listening on 3050')
})
