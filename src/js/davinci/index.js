import '../globals'
import '../bulmahelpers'

import menuData from '../../../lib/davinciMenu/menu.json'

import debug from 'debug'
const logdebug = debug('davinci:debug')
const logerror = debug('davinci:error')
const loginfo = debug('davinci:info')
localStorage.debug += ' davinci:* '

loginfo('davinci, sweet davinci 👀🙀👻')

document.addEventListener('DOMContentLoaded', () => {
  const menuTableBody = document.getElementById('menuTableBody')

  initNavbar()

  Object.keys(menuData).forEach((key) => {
    const headingrow = menuTableBody.insertRow(-1)
    const heading = document.createElement('div')
    heading.textContent = key
    headingrow.appendChild(heading)
    heading.setAttribute('class', 'spacing-top is-size-3')
    menuData[key].forEach((menuentry) => {
      const row = menuTableBody.insertRow(-1)
      row.setAttribute('scope', 'row')

      const name = row.insertCell(-1)
      const ingredients = row.insertCell(-1)
      const pricenormal = row.insertCell(-1)

      let price = []
      if(menuentry.name) name.textContent = menuentry.name
      if(menuentry.ingredients[0]) {
        const localizedIngredients = menuentry.ingredients.map(ingredient => i18next.t('ingredients.'+ingredient))
        ingredients.textContent = localizedIngredients.join(', ')
      }
      if(menuentry.pricesmall) price.push(menuentry.pricesmall + '€ ')
      if(menuentry.price) price.push(menuentry.price + '€')
      if(menuentry.pricebig) price.push(menuentry.pricebig + '€')

      pricenormal.textContent = price.join(', ')
    })
  })
})