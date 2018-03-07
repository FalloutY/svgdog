const Facade = require('../../lib/facade')
const imageSchema = require('./schema')

class ImageFacade extends Facade {}

module.exports = new ImageFacade('Image', imageSchema)
