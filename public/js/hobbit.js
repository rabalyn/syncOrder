import 'bulma/css/bulma.min.css'
import fontawesome from '@fortawesome/fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import regular from '@fortawesome/fontawesome-free-regular'
import brands from '@fortawesome/fontawesome-free-brands'

import debug from 'debug'
const logdebug = debug('hobbit:debug')
const logerror = debug('hobbit:error')
const loginfo = debug('hobbit:info')
localStorage.debug += ' hobbit:* '

import io from 'socket.io-client'
const socket = io()

import menuData from '../../lib/hobbitMenu/menu.json'
import i18next from './i18next'

loginfo('hobbit, sweet hobbit 👀🙀👻')

const isVisible = elem => !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length )
function hideOnClickOutside(element) {
  const outsideClickListener = event => {
    if(!element.contains(event.target)) { // or use: event.target.closest(selector) === null
      if(isVisible(element)) {
        element.classList.remove('is-active')
        removeClickListener()
      }
    }
  }

  const removeClickListener = () => document.removeEventListener('click', outsideClickListener)
  document.addEventListener('click', outsideClickListener)
}
function initNavbar() {
  // Get all "navbar-burger" elements
  const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0)
  if(navbarBurgers.length > 0) {
    navbarBurgers.forEach((el) => {
      el.addEventListener('click', () => {
        const target = el.dataset.target
        const targetNode = document.getElementById(target)

        el.classList.toggle('is-active')
        targetNode.classList.toggle('is-active')
      })
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btnGerman = document.getElementById('btnGerman')
  const btnEnglish = document.getElementById('btnEnglish')
  const languagelistTrigger = document.getElementById('languagelistTrigger')
  const languagelistContainer = document.getElementById('languagelistContainer')
  const menuTableBody = document.getElementById('menuTableBody')

  initNavbar()
  languagelistTrigger.addEventListener('click', (e) => languagelistContainer.classList.toggle('is-active'))
  // hide languagelist if clicked outside extralist
  document.addEventListener('click', (e) => hideOnClickOutside(languagelistContainer))

  btnGerman.addEventListener('click', (e) => {
    document.cookie = 'i18next=de'
    location.reload()
  })

  btnEnglish.addEventListener('click', (e) => {
    document.cookie = 'i18next=en'
    location.reload()
  })

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