window.initNavbar = function() {
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

window.initModalDismissButtons = function(elemName, modalId) {
  const closeModalButtons = document.getElementsByName(elemName)
  Array.from(closeModalButtons).forEach(elem => {
    elem.addEventListener('click', (e) => {
      document.getElementById(modalId).classList.remove('is-active')
    })
  })
}

const isVisible = elem => !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length )
const removeClickListener = () => document.removeEventListener('click', outsideClickListener)

window.hideOnClickOutside = function(element) {
  window.outsideClickListener = event => {
    if(!element.contains(event.target)) { // or use: event.target.closest(selector) === null
      if(isVisible(element)) {
        element.classList.remove('is-active')
        removeClickListener()
      }
    }
  }

  document.addEventListener('click', outsideClickListener)
}

document.addEventListener('DOMContentLoaded', () => {
  const btnGerman = document.getElementById('btnGerman')
  const btnEnglish = document.getElementById('btnEnglish')
  const languagelistTrigger = document.getElementById('languagelistTrigger')
  const languagelistContainer = document.getElementById('languagelistContainer')

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
})