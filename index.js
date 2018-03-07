const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const bluebird = require('bluebird')
const multer = require('multer')
const fs = require('fs')
function getFileExtensionFromMIME (mime) {
  switch (mime) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg'
    case 'image/png':
      return 'png'
    case 'image/svg':
    case 'image/svg+xml':
      return 'svg'
  }
}
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const title = req.body.title || Date.now()
    cb(null, title + '.' + getFileExtensionFromMIME(file.mimetype))
  }
})
const upload = multer({ storage: storage })

const config = require('./config')
const routes = require('./routes')

const app = express()

mongoose.Promise = bluebird
mongoose.connect(config.mongo.url)

app.use(helmet())
const parser = bodyParser.urlencoded({ extended: true, limit: '1gb' })
app.use(parser)
app.use(bodyParser.json())
app.use(morgan('tiny'))

app.set('view engine', 'ejs')
app.use('/', routes)
app.post('/upload/', upload.single('image'), (req, res) => {
  console.log(req.file)
  console.log(req.body)
  fs.rename(req.file.path, 'uploads/' + req.body.title + '.' + getFileExtensionFromMIME(req.file.mimetype), (err) => {
    if (err) {
      res.status(400).json({err: 'FAILED'})
    }
    res.status(200).json({ info: req.file })
  })
})

app.listen(config.server.port, () => {
  console.log(`Magic happens on port ${config.server.port}`)
})

module.exports = app
