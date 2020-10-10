const menu = require('./menu.json')

module.exports.getMenu = (req, res) => {
  res.json(menu)
}
