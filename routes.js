const Router = require('express').Router
const router = new Router()

const image = require('./model/image/router')

router.route('/').get((req, res) => {
  res.render('index')
})

router.use('/image', image)
module.exports = router
