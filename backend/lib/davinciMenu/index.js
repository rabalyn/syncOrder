import menu from './menu.json'

module.exports.getMenu = (req, res) => {
  res.json(menu)
}
