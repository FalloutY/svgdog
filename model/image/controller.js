const Controller = require('../../lib/controller')
const imageFacade = require('./facade')

class ImageController extends Controller {}

module.exports = new ImageController(imageFacade)
