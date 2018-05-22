import 'bulma/css/bulma.min.css'
import fontawesome from '@fortawesome/fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import regular from '@fortawesome/fontawesome-free-regular'
import brands from '@fortawesome/fontawesome-free-brands'

import debug from 'debug'
const logdebug = debug('home:debug')
const logerror = debug('home:error')
const loginfo = debug('home:info')
localStorage.debug += ' home:* '

import io from 'socket.io-client'
const socket = io()

loginfo('home, sweet home 👀🙀👻')

const syncOrder = (data) => socket.emit('POSTorder', data)
const syncPaied = (data) => socket.emit('POSTpaied', data)
const syncClearList = () => socket.emit('clearList', {})

const smallPizzaDiscount = 0.5
const bigPizzaDiscount = 1.0

const addOrderModal = document.getElementById('addOrderModal')
const trollModal = document.getElementById('trollModal')
const chosenMeal = document.getElementById('chosenMeal')
const chosenSize = document.getElementById('chosenSize')
const chosenExtras = document.getElementById('chosenExtras')
const nameInput = document.getElementById('name')
const tableOrderBody = document.getElementById('orderTableBody')
const menulistContainer = document.getElementById('menulistContainer')
const dropdownMenuButton = document.getElementById('dropdownMenuButton')
let extraTags = null
const clearList = document.getElementById('clearList')
const btnOpenAddOrder = document.getElementById('btnOpenAddOrder')
const menulistTrigger = document.getElementById('menulistTrigger')
const menulistContent = document.getElementById('menulistContent')
const sizelistTrigger = document.getElementById('sizelistTrigger')
const sizelistContainer = document.getElementById('sizelistContainer')
const extralistTrigger = document.getElementById('extralistTrigger')
const extralistContent = document.getElementById('extralistContent')
const extralistContainer = document.getElementById('extralistContainer')
const mealFilterInput = document.getElementById('mealFilterInput')
const extraFilterInput = document.getElementById('extraFilterInput')
const sizeNormal = document.getElementById('sizeNormal')
const sizeBig = document.getElementById('sizeBig')
const pricePreview = document.getElementById('pricePreview')

socket.on('reload', () => location.reload())
socket.on('trollProtection', (statusObj) => trollModal.style.display = '')
socket.on('FAILorder', (data) => alert(data.text))
socket.on('initMeta', (metadata) => metadata.forEach(data => updateMetaField(data)))
socket.on('initPaied', (paied) => paied.forEach(pay => document.getElementById(pay.htmlid).value = pay.paied))
socket.on('pushMeta', (data) => updateMetaField(data))
socket.on('GETpaied', (data) => {
  const x = document.getElementById(data.htmlid)
  x.value = data.paied
})

socket.on('GETorder', (data) => {
  addOrderModal.classList.remove('is-active')
  nameInput.classList.remove('is-valid')
  nameInput.value = ''
  resetChosenMeal()
  resetChosenExtras()
  chosenMeal.textContent = 'Mahlzeiten'
  chosenSize.textContent = 'Normal'
  addRow(data)
})

socket.on('initOrders', (orders) => {
  Array.from(orderTableBody.rows).forEach((row, idx) => table.deleteRow(idx))
  orders.forEach(order => addRow(order))
})

function updateMetaField(data) {
  const id = data.id
  const text = data.text
  document.getElementById(id).value = text
}

function setSizeLabel(id, text) {
  document.getElementById(id).addEventListener('click', (e) => {
    e.preventDefault()
    dropdownMenuButton.innerHTML = text
  })
}

function _bindUpdateMetaInfo(e) {
  const id = e.target.id
  e.preventDefault()
  const text = document.getElementById(id).value
  socket.emit('syncMeta', { id: id, text: text })
}

function updateMetaInfo(id) {
  document.getElementById(id).addEventListener('keyup', _bindUpdateMetaInfo, false)
  document.getElementById(id).addEventListener('change', _bindUpdateMetaInfo, false)
}

function addRow(order) {
  const extraTagList = document.createElement('div')
  extraTagList.setAttribute('class', 'tags')
  try {
    const extras = JSON.parse(order.extras)
    extras.forEach((extra) => {
      const tag = document.createElement('span')
      parseFloat(extra.price) > 0
        ? tag.setAttribute('class', 'tag is-success')
        : tag.setAttribute('class', 'tag is-danger')
      tag.textContent = extra.name
      extraTagList.appendChild(tag)
    })
  } catch (error) {
    //no extra specified for this order
    //logerror('could not parse extras: %O', error)
  }
  logdebug(extraTagList)

  const row = tableOrderBody.insertRow(-1)
  row.setAttribute('scope', 'row')

  const id = row.insertCell(-1)
  const name = row.insertCell(-1)
  const meal = row.insertCell(-1)
  const size = row.insertCell(-1)
  const comment = row.insertCell(-1)
  const price = row.insertCell(-1)
  const paied = row.insertCell(-1)

  logdebug(order)
  // Add some text to the new cells:
  id.textContent = order.tableId
  name.textContent = order.name
  meal.textContent = order.meal
  size.textContent = order.size
  comment.appendChild(extraTagList)
  price.textContent = order.price
  const htmlid = order.name + order.meal + order.size
  const maxVal = 100
  
  const x = document.createElement('input')
  x.setAttribute('data-name', order.name)
  x.setAttribute('id', htmlid)
  x.setAttribute('class', 'input')
  x.setAttribute('type', 'number')
  x.setAttribute('step', '0.10')
  x.setAttribute('value', '0')
  x.setAttribute('min', '0')
  x.setAttribute('max', maxVal)
  paied.appendChild(x)

  document.getElementById(htmlid).addEventListener('keyup', (e) => {
    e.preventDefault()
    const inputField = document.getElementById(htmlid)
    const paied = inputField.value
    const syncObj = { id: id, htmlid: htmlid, paied: paied }
    syncPaied(syncObj)
  })

  document.getElementById(htmlid).addEventListener('change', (e) => {
    e.preventDefault()
    const inputField = document.getElementById(htmlid)
    const paied = inputField.value
    const syncObj = { id: id, htmlid: htmlid, paied: paied }
    syncPaied(syncObj)
  })
}

function initDateValue() {
  const dateControl = document.querySelector('input[type="date"]')
  dateControl.value = new Date().toISOString().substr(0, 10)
}

function initClearListButton() {
  clearList.addEventListener('click', (e) => {
    e.preventDefault()
    document.getElementById('verifyClearListModal').classList.add('is-active')
  })
}

function initVerifyClearListButton() {
  document.getElementById('btnVerifyClearList').addEventListener('click', (e) => {
    e.preventDefault()
    syncClearList()
    document.getElementById('verifyClearListModal').style.display = 'none'
  })
}

function initOrder() {
  document.getElementById('saveOrder').addEventListener('click', (e) => {
    e.preventDefault()
    const name = nameInput.value
        ? nameInput.value
        : null
    const meal = chosenMeal.dataset
        ? chosenMeal.dataset
        : null
    const size = chosenSize.textContent
        ? chosenSize.textContent
        : null
    const extrasContainer = extraTags
        ? extraTags
        : null
    const price = pricePreview.textContent
        ? pricePreview.textContent
        : null

    let extras = (extrasContainer) 
      ? Array.from(extrasContainer.childNodes).map((extra) => extra.dataset)
      : null

    if(!name) {
      nameInput.classList.add('is-danger')
    } else {
      nameInput.classList.remove('is-danger')
    }

    if(!meal.name) {
      menulistTrigger.classList.add('is-danger')
    } else {
      menulistTrigger.classList.remove('is-danger')
    }

    if(!name || !meal.name || !price) return

    const order = {
      name: name,
      meal: JSON.stringify(meal),
      size: size,
      extras: JSON.stringify(extras),
      price: price
    }

    syncOrder(order)
  })
}

const resetChosenMeal = () => Object.keys(chosenMeal.dataset).forEach(attr => delete chosenMeal.dataset[attr])
const formatPrice = (price) => price.toFixed(2).toLocaleString() + '€'
const formatIngredients = (meal) => (meal.ingredients[0] !== '') ? ' <span>(' + meal.ingredients.join(', ') + ')</span>' : ''
const isLunchTime = () => (new Date().getHours() < 17) ? true : false

function getPriceString(mealObj) {
  let returnString = '<span hidden>'
  if(mealObj.pricesmall) returnString += '  Klein: ' + formatPrice(mealObj.pricesmall)
  if(mealObj.pricebig) returnString += ' Groß: ' + formatPrice(mealObj.pricebig)
  if(mealObj.price) returnString += ' Preis: ' + formatPrice(mealObj.price)

  returnString += '</span>'
  return returnString
}

const loadHobbitMenu = {
  now: () => {
    fetch('/getHobbitMenu')
      .then(res => res.json())
      .then(menudata => {
        window.hobbitmenu = menudata
        Object.keys(menudata).forEach(menuitem => {
          if(menuitem === 'Extras') {
              hobbitmenu[menuitem].forEach((extra) => {
                const extraitem = document.createElement('a')
                extraitem.setAttribute('class', 'dropdown-item')
                extraitem.setAttribute('name', 'extraEntry')
                extraitem.dataset.category = menuitem
                Object.keys(extra).forEach(attr => {
                  extraitem.dataset[attr] = extra[attr]
                })

                extraitem.innerHTML = extra.name + ' ' + getPriceString(extra)

                extralistContent.appendChild(extraitem)
              })
              return
          }
          const listheading = document.createElement('h4')
          listheading.setAttribute('class', 'dropdown-header')
          listheading.innerHTML = menuitem
          menulistContent.appendChild(listheading)

          hobbitmenu[menuitem].forEach(meal => {
            const listitem = document.createElement('a')
            listitem.setAttribute('class', 'dropdown-item')
            listitem.setAttribute('name', 'mealEntry')
            listitem.dataset.category = menuitem
            Object.keys(meal).forEach(attr => {
              listitem.dataset[attr] = meal[attr]
            })

            listitem.innerHTML += menuitem === 'Pizzen'
              ? meal.number + ' ' + meal.name
              : meal.name
            
            listitem.innerHTML += getPriceString(meal)

            const tooltipInfo = document.createElement('span')
            tooltipInfo.setAttribute('class', 'tooltiptext')
            tooltipInfo.innerHTML = formatIngredients(meal)
            listitem.appendChild(tooltipInfo)

            menulistContent.appendChild(listitem)
          })
        })
      })
      .then(() => {
        const meals = document.getElementsByName('mealEntry')
        Array.from(meals).forEach(meal => {
          meal.addEventListener('click', function(e) {
            e.preventDefault()
            chosenMeal.textContent = this.textContent
            resetChosenMeal()
            Object.keys(meal.dataset).forEach(attr => {
                chosenMeal.dataset[attr] = meal.dataset[attr]
              })
            menulistContainer.classList.remove('is-active')
            const smallLunchDiscount = isLunchTime() ? smallPizzaDiscount : 0
            const normalLunchDiscount = isLunchTime() ? bigPizzaDiscount : 0
            if(this.dataset.pricesmall) {
              const size = chosenSize.textContent
              size === 'Normal'
                ? setPrice(parseFloat(this.dataset.pricesmall) - smallLunchDiscount)
                : setPrice(parseFloat(this.dataset.pricebig) - normalLunchDiscount)
            } else {
              setPrice(parseFloat(this.dataset.price))
            }
          })
        })
      })
      .then(() => {
        const extras = document.getElementsByName('extraEntry')
        Array.from(extras).forEach(extra => {
          extra.addEventListener('click', function(e) {
            initChosenExtras()
            extraFilterInput.value = ''
            filterExtraInput()
            logdebug(extraTags)
            e.preventDefault()
            if(chosenExtras.textContent === 'Extras, Kommentare') {
              chosenExtras.innerHTML = '<div class="tags" id="extraTags"></div>'
              const tag = document.createElement('span')
              tag.textContent = this.textContent
              tag.setAttribute('class', 'tag is-success')
              Object.keys(this.dataset).forEach(attr => {
                tag.dataset[attr] = this.dataset[attr]
              })
              const deleteMe = document.createElement('button')
              deleteMe.setAttribute('class', 'delete is-small')
              deleteMe.addEventListener('click', function(e) {
                  const myPrice = parseFloat(this.parentNode.dataset.price) * -1
                  updatePrice(myPrice)
                this.parentNode.parentNode.removeChild(this.parentNode)
                if(extraTags.childNodes.length === 0) {
                  chosenExtras.textContent = 'Extras, Kommentare'
                }
              })
              tag.appendChild(deleteMe)
              extraTags.appendChild(tag)
              updatePrice(tag.dataset.price)
            } else {
              const tag = document.createElement('span')
              tag.textContent = this.textContent
              tag.setAttribute('class', 'tag is-success')
              Object.keys(this.dataset).forEach(attr => {
                tag.dataset[attr] = this.dataset[attr]
              })
              const deleteMe = document.createElement('button')
              deleteMe.setAttribute('class', 'delete is-small')
              deleteMe.addEventListener('click', function(e) {
                const myPrice = parseFloat(this.parentNode.dataset.price) * -1
                updatePrice(myPrice)
                this.parentNode.parentNode.removeChild(this.parentNode)
                if(extraTags.childNodes.length === 0) {
                  chosenExtras.textContent = 'Extras, Kommentare'
                }
              })
              tag.appendChild(deleteMe)
              extraTags.appendChild(tag)
              updatePrice(tag.dataset.price)
            }
            //resetChosenExtra()
            extralistContainer.classList.remove('is-active')
          })
        })
      })
      .catch(reason => logerror('could not fetch hobbit menu data: %o', reason))
  }
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

function initModalDismissButtons(elemName, modalId) {
  const closeModalButtons = document.getElementsByName(elemName)
  Array.from(closeModalButtons).forEach(elem => {
    elem.addEventListener('click', (e) => {
      document.getElementById(modalId).classList.remove('is-active')
    })
  })
}

const setPrice = (price) => pricePreview.textContent = price.toFixed(2) + '€'
const updatePrice = (toAdd) => {
  const oldPrice = parseFloat(pricePreview.textContent)
  const newPrice = parseFloat(toAdd) + oldPrice
  setPrice(newPrice)
}

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

function inputContainsNegativeChar(input) {
  return (input.indexOf('-') !== -1 || input.indexOf('ohne') !== -1)
}

function initChosenExtras() {
  if(chosenExtras.textContent === 'Extras, Kommentare') {
    chosenExtras.innerHTML = '<div class="tags" id="extraTags"></div>'
  }
  extraTags = document.getElementById('extraTags')
}

function resetChosenExtras() {
  chosenExtras.innerHTML = ''
  chosenExtras.textContent = 'Extras, Kommentare'
}

function addTag(tagClass, price) {
  initChosenExtras()
  const input = extraFilterInput.value
  const tag = document.createElement('span')
  tag.textContent = input
  tag.setAttribute('class', tagClass)
  tag.dataset.name = input
  tag.dataset.price = price
  const deleteMe = document.createElement('button')
  deleteMe.setAttribute('class', 'delete is-small')
  deleteMe.addEventListener('click', function(e) {
    this.parentNode.parentNode.removeChild(this.parentNode)
    if(extraTags.childNodes.length === 0) {
      chosenExtras.textContent = 'Extras, Kommentare'
    }
  })
  tag.appendChild(deleteMe)
  extraTags.appendChild(tag)
}

function choosePizza(size) {
  chosenSize.textContent = size
  sizelistContainer.classList.remove('is-active')
  const price = chosenMeal.dataset.price
    ? chosenMeal.dataset.price
    : null
  const pricesmall = chosenMeal.dataset.pricesmall
    ? chosenMeal.dataset.pricesmall
    : null
  const pricebig = chosenMeal.dataset.pricebig
    ? chosenMeal.dataset.pricebig
    : null

  if(price) return setPrice(parseFloat(price))
  const smallLunchDiscount = isLunchTime() ? smallPizzaDiscount : 0
  const normalLunchDiscount = isLunchTime() ? bigPizzaDiscount : 0
  if(size === 'Normal' && pricesmall) return setPrice(parseFloat(pricesmall) - smallLunchDiscount)
  if(size === 'Groß' && pricebig) return setPrice(parseFloat(pricebig) - normalLunchDiscount)

  setPrice(0)
}

function filterExtraInput() {
  const searchValue = extraFilterInput.value.toLowerCase()
  const extras = document.getElementsByName('extraEntry')
  Array.from(extras).forEach(extra => {
    extra.style.display = (extra.textContent.toLowerCase().indexOf(searchValue) > -1)
      ? ''
      : 'none'
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbar()
  initModalDismissButtons('closeOrder', 'addOrderModal')
  initModalDismissButtons('closeClearList', 'verifyClearListModal')
  initDateValue()
  initClearListButton()
  initVerifyClearListButton()
  initOrder()

  loadHobbitMenu.now()

  btnOpenAddOrder.addEventListener('click', (e) => {
    setPrice(0)
    resetChosenMeal()
    chosenMeal.textContent = 'Mahlzeiten'
    addOrderModal.classList.add('is-active')
  })

  menulistTrigger.addEventListener('click', (e) => menulistContainer.classList.toggle('is-active'))
  sizelistTrigger.addEventListener('click', (e) => sizelistContainer.classList.toggle('is-active'))
  extralistTrigger.addEventListener('click', (e) => extralistContainer.classList.toggle('is-active'))

  updateMetaInfo('inputDate')
  updateMetaInfo('inputName')
  updateMetaInfo('inputCollector')
  updateMetaInfo('inputCollectTime')

  mealFilterInput.addEventListener('keyup', (e) => {
    const searchValue = mealFilterInput.value.toLowerCase()
    const meals = document.getElementsByName('mealEntry')
    Array.from(meals).forEach(meal => {
      meal.style.display = (meal.textContent.toLowerCase().indexOf(searchValue) > -1)
        ? ''
        : 'none'
    })
  })

  chosenSize.addEventListener('change', function(e) {
    e.preventDefault()
    const size = this.textContent
    const price = chosenMeal.dataset.price
      ? chosenMeal.dataset.price
      : null
    const pricesmall = chosenMeal.dataset.pricesmall
      ? chosenMeal.dataset.pricesmall
      : null
    const pricebig = chosenMeal.dataset.pricebig
      ? chosenMeal.dataset.pricebig
      : null

    if(price) return setPrice(parseFloat(price))

    const smallLunchDiscount = isLunchTime() ? smallPizzaDiscount : 0
    const normalLunchDiscount = isLunchTime() ? bigPizzaDiscount : 0
    if(size === 'Normal' && pricesmall) return setPrice(parseFloat(pricesmall) - smallLunchDiscount)
    if(size === 'Groß' && pricebig) return setPrice(parseFloat(pricebig) - normalLunchDiscount)

    setPrice(0)
  })

  extraFilterInput.addEventListener('keyup', (e) => filterExtraInput())

  // hide menulist if clicked outside menulist
  document.addEventListener('click', (e) => hideOnClickOutside(menulistContainer))
  // hide sizelist if clicked outside sizelist
  document.addEventListener('click', (e) => hideOnClickOutside(sizelistContainer))
  sizeNormal.addEventListener('click', (e) => choosePizza('Normal'))
  sizeBig.addEventListener('click', (e) => choosePizza('Groß'))
  // hide extralist if clicked outside extralist
  document.addEventListener('click', (e) => hideOnClickOutside(extralistContainer))

  extraFilterInput.addEventListener('keyup', function(e) {
    if(e.which === 13) { // 13 === return
      const extralist = document.getElementById('extralistContent').childNodes
      const filteredList = Array.from(extralist).filter(entry => entry.style && entry.style.display !== 'none')
      if(filteredList.length === 1) {
        initChosenExtras()
        const lastEntry = filteredList[0]
        const tag = document.createElement('span')
        tag.textContent = lastEntry.textContent
        tag.setAttribute('class', 'tag is-success')
        Object.keys(lastEntry.dataset).forEach(attr => {
          tag.dataset[attr] = lastEntry.dataset[attr]
        })
        const deleteMe = document.createElement('button')
        deleteMe.setAttribute('class', 'delete is-small')
        deleteMe.addEventListener('click', function(e) {
          const myPrice = parseFloat(this.parentNode.dataset.price) * -1
          updatePrice(myPrice)
          this.parentNode.parentNode.removeChild(this.parentNode)
          if(extraTags.childNodes.length === 0) {
            chosenExtras.textContent = 'Extras, Kommentare'
          }
        })
        tag.appendChild(deleteMe)
        extraTags.appendChild(tag)
        updatePrice(tag.dataset.price)
      } else if(filteredList.length === 0) {
        const input = extraFilterInput.value
        inputContainsNegativeChar(input)
            ? addTag('tag is-danger', 0)
            : addTag('tag is-light', 0)
      }

      extraFilterInput.value = ''
      filterExtraInput()
    }
  })
})
