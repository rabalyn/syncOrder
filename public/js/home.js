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

socket.on('reload', () => location.reload())
socket.on('trollProtection', (statusObj) => document.getElementById('trollModal').style.display = '')
socket.on('FAILorder', (data) => alert(data.text))
socket.on('initMeta', (metadata) => metadata.forEach(data => updateMetaField(data)))
socket.on('initPaied', (paied) => paied.forEach(pay => document.getElementById(pay.htmlid).value = pay.paied))
socket.on('pushMeta', (data) => updateMetaField(data))
socket.on('GETpaied', (data) => {
    const x = document.getElementById(data.htmlid)
    x.value = data.paied
})

socket.on('GETorder', (data) => {
    document.getElementById('addOrderModal').classList.remove('is-active')
    document.getElementById('name').classList.remove('is-valid')
    document.getElementById('name').value = ''
    resetChosenMeal()
    document.getElementById('chosenMeal').textContent = 'Mahlzeiten'
    document.getElementById('chosenSize').value = 'Normal'
    document.getElementById('chosenSize').textContent = 'Normal'
    addRow(data)
})

socket.on('initOrders', (orders) => {
    logdebug('orders: %O', orders)
    const table = document.getElementById('orderTableBody')
    Array.from(table.rows).forEach((row, idx) => table.deleteRow(idx))
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
        document.getElementById('dropdownMenuButton').innerHTML = text
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
            logdebug(extra)
            const tag = document.createElement('span')
            parseFloat(extra.price) > 0
                ? tag.setAttribute('class', 'tag is-success')
                : tag.setAttribute('class', 'tag is-danger')
            tag.textContent = parseFloat(extra.price) > 0
                ? '+' + extra.name
                : '-' + extra.name
            extraTagList.appendChild(tag)
        })
    } catch (error) {
        logerror('could not parse extras: %O', error)
    }
    logdebug(extraTagList)
    const table = document.getElementById('orderTableBody')

    const row = table.insertRow(-1)
    row.setAttribute('scope', 'row')

    const id = row.insertCell(-1)
    const name = row.insertCell(-1)
    const meal = row.insertCell(-1)
    const size = row.insertCell(-1)
    const comment = row.insertCell(-1)
    const paied = row.insertCell(-1)

    logdebug(order)
    // Add some text to the new cells:
    id.textContent = order.tableId
    name.textContent = order.name
    meal.textContent = order.meal
    size.textContent = order.size
    comment.appendChild(extraTagList)
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

        syncPaied({ id: id, htmlid: htmlid, paied: paied })
    })
}

function initDateValue() {
    const dateControl = document.querySelector('input[type="date"]')
    dateControl.value = new Date().toISOString().substr(0, 10)
}

function initClearListButton() {
    document.getElementById('clearList').addEventListener('click', (e) => {
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
        const name = document.getElementById('name').value
            ? document.getElementById('name').value
            : null
        const meal = document.getElementById('chosenMeal').dataset
            ? document.getElementById('chosenMeal').dataset
            : null
        const size = document.getElementById('chosenSize').value
            ? document.getElementById('chosenSize').value
            : null
        const extrasContainer = document.getElementById('extraTags')
            ? document.getElementById('extraTags')
            : null
        const price = document.getElementById('pricePreview').value
            ? document.getElementById('pricePreview').value
            : null

        let extras = null
        if(extrasContainer) {
            extras = Array.from(extrasContainer.childNodes).map((extra) => extra.dataset)
            logdebug(extras)
        }
        if (!name) {
            document.getElementById('name').classList.add('is-danger')
        } else {
            document.getElementById('name').classList.remove('is-danger')
        }

        if (!meal.name) {
            document.getElementById('menulistTrigger').classList.add('is-danger')
        } else {
            document.getElementById('menulistTrigger').classList.remove('is-danger')
        }

        if (!name || !meal.name || !price) return

        const order = {
            name: name,
            meal: JSON.stringify(meal),
            size: size,
            extras: JSON.stringify(extras),
            price: price
        }

        syncOrder(order)
        $('#addOrderModal').modal('hide')
    })
}

const resetChosenMeal = () => Object.keys(document.getElementById('chosenMeal').dataset).forEach(attr => delete document.getElementById('chosenMeal').dataset[attr])

function formatPrice(price) {
  return price.toFixed(2).toLocaleString() + '€'
}

function getPriceString(mealObj) {
  let returnString = '<span hidden>'
  if(mealObj.pricesmall) returnString += '  Klein: ' + formatPrice(mealObj.pricesmall)
  if(mealObj.pricebig) returnString += ' Groß: ' + formatPrice(mealObj.pricebig)
  if(mealObj.price) returnString += ' Preis: ' + formatPrice(mealObj.price)

  returnString += '</span>'
  return returnString
}

function formatIngredients(meal) {
  if(meal.ingredients[0] !== '') return ' <span>(' + meal.ingredients.join(', ') + ')</span>'
  return ''
}

const loadHobbitMenu = {
  now: () => {
    fetch('/getHobbitMenu')
      .then(res => res.json())
      .then(menudata => {
        window.hobbitmenu = menudata
        const menulist = document.getElementById('menulistContent')
        const extralist = document.getElementById('extralistContent')
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

                extralist.appendChild(extraitem)
              })
              return
          }
          const listheading = document.createElement('h4')
          listheading.setAttribute('class', 'dropdown-header')
          listheading.innerHTML = menuitem
          menulist.appendChild(listheading)

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

            menulist.appendChild(listitem)
          })
        })
      })
      .then(() => {
        const meals = document.getElementsByName('mealEntry')
        Array.from(meals).forEach(meal => {
          meal.addEventListener('click', function(e) {
            e.preventDefault()
            document.getElementById('chosenMeal').textContent = this.textContent
            resetChosenMeal()
            Object.keys(meal.dataset).forEach(attr => {
                document.getElementById('chosenMeal').dataset[attr] = meal.dataset[attr]
              })
            document.getElementById('menulistContainer').classList.remove('is-active')
            if(this.dataset.pricesmall) {
              const size = document.getElementById('chosenSize').value
              if(size === 'Normal') {
                setPrice(parseFloat(this.dataset.pricesmall) - 0.5)
              } else { // size === 'Groß'
                setPrice(parseFloat(this.dataset.pricebig) - 1)
              }
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
              e.preventDefault()
              if(document.getElementById('chosenExtras').textContent === 'Extras, Kommentare') {
                document.getElementById('chosenExtras').innerHTML = '<div class="tags" id="extraTags"></div>'
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
                  if(document.getElementById('extraTags').childNodes.length === 0) {
                    document.getElementById('chosenExtras').textContent = 'Extras, Kommentare'
                  }
                })
                tag.appendChild(deleteMe)
                document.getElementById('extraTags').appendChild(tag)
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
                  if(document.getElementById('extraTags').childNodes.length === 0) {
                    document.getElementById('chosenExtras').textContent = 'Extras, Kommentare'
                  }
                })
                tag.appendChild(deleteMe)
                document.getElementById('extraTags').appendChild(tag)
                updatePrice(tag.dataset.price)
              }
              //resetChosenExtra()
              document.getElementById('extralistContainer').classList.remove('is-active')
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

const setPrice = (price) => document.getElementById('pricePreview').value = price.toFixed(2) + '€'
const updatePrice = (toAdd) => {
  const oldPrice = parseFloat(document.getElementById('pricePreview').value)
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

document.addEventListener('DOMContentLoaded', () => {
  initNavbar()
  initModalDismissButtons('closeOrder', 'addOrderModal')
  initModalDismissButtons('closeClearList', 'verifyClearListModal')
  initDateValue()
  initClearListButton()
  initVerifyClearListButton()
  initOrder()

  loadHobbitMenu.now()

  document.getElementById('btnOpenAddOrder').addEventListener('click', (e) => {
    document.getElementById('addOrderModal').classList.add('is-active')
  })

  document.getElementById('menulistTrigger').addEventListener('click', (e) => {
    document.getElementById('menulistContainer').classList.toggle('is-active')
  })

  document.getElementById('sizelistTrigger').addEventListener('click', (e) => {
    document.getElementById('sizelistContainer').classList.toggle('is-active')
  })

  document.getElementById('extralistTrigger').addEventListener('click', (e) => {
    document.getElementById('extralistContainer').classList.toggle('is-active')
  })

  updateMetaInfo('inputDate')
  updateMetaInfo('inputName')
  updateMetaInfo('inputCollector')
  updateMetaInfo('inputCollectTime')

  document.getElementById('mealFilterInput').addEventListener('keyup', (e) => {
    const searchValue = document.getElementById('mealFilterInput').value.toLowerCase()
    const meals = document.getElementsByName('mealEntry')
    Array.from(meals).forEach(meal => {
      meal.style.display = (meal.textContent.toLowerCase().indexOf(searchValue) > -1)
        ? ''
        : 'none'
    })
  })

  document.getElementById('chosenSize').addEventListener('change', function(e) {
    e.preventDefault()
    const size = this.textContent
    const price = document.getElementById('chosenMeal').dataset.price
      ? document.getElementById('chosenMeal').dataset.price
      : null
    const pricesmall = document.getElementById('chosenMeal').dataset.pricesmall
      ? document.getElementById('chosenMeal').dataset.pricesmall
      : null
    const pricebig = document.getElementById('chosenMeal').dataset.pricebig
      ? document.getElementById('chosenMeal').dataset.pricebig
      : null

    if(price) return setPrice(parseFloat(price))
    if(size === 'Normal' && pricesmall) return setPrice(parseFloat(pricesmall) - 0.5)
    if(size === 'Groß' && pricebig) return setPrice(parseFloat(pricebig) - 1.0)

    setPrice(0)
  })

  document.getElementById('extraFilterInput').addEventListener('keyup', (e) => {
    const searchValue = document.getElementById('extraFilterInput').value.toLowerCase()
    const extras = document.getElementsByName('extraEntry')
    Array.from(extras).forEach(extra => {
      extra.style.display = (extra.textContent.toLowerCase().indexOf(searchValue) > -1)
        ? ''
        : 'none'
    })
  })

  // hide menulist if clicked outside menulist
  document.addEventListener('click', (e) => hideOnClickOutside(document.getElementById('menulistContainer')))
  // hide sizelist if clicked outside sizelist
  document.addEventListener('click', (e) => hideOnClickOutside(document.getElementById('sizelistContainer')))
  document.getElementById('sizeNormal').addEventListener('click', (e) => {
    document.getElementById('chosenSize').value = 'Normal'
    document.getElementById('chosenSize').textContent = 'Normal'
    document.getElementById('sizelistContainer').classList.remove('is-active')
    const size = document.getElementById('chosenSize').textContent
    const price = document.getElementById('chosenMeal').dataset.price
      ? document.getElementById('chosenMeal').dataset.price
      : null
    const pricesmall = document.getElementById('chosenMeal').dataset.pricesmall
      ? document.getElementById('chosenMeal').dataset.pricesmall
      : null
    const pricebig = document.getElementById('chosenMeal').dataset.pricebig
      ? document.getElementById('chosenMeal').dataset.pricebig
      : null

    if(price) return setPrice(parseFloat(price))
    if(size === 'Normal' && pricesmall) return setPrice(parseFloat(pricesmall) - 0.5)
    if(size === 'Groß' && pricebig) return setPrice(parseFloat(pricebig) - 1.0)

    setPrice(0)
  })
  document.getElementById('sizeBig').addEventListener('click', (e) => {
    document.getElementById('chosenSize').value = 'Groß'
    document.getElementById('chosenSize').textContent = 'Groß'
    document.getElementById('sizelistContainer').classList.remove('is-active')
    const size = document.getElementById('chosenSize').textContent
    const price = document.getElementById('chosenMeal').dataset.price
      ? document.getElementById('chosenMeal').dataset.price
      : null
    const pricesmall = document.getElementById('chosenMeal').dataset.pricesmall
      ? document.getElementById('chosenMeal').dataset.pricesmall
      : null
    const pricebig = document.getElementById('chosenMeal').dataset.pricebig
      ? document.getElementById('chosenMeal').dataset.pricebig
      : null

    if(price) return setPrice(parseFloat(price))
    if(size === 'Normal' && pricesmall) return setPrice(parseFloat(pricesmall) - 0.5)
    if(size === 'Groß' && pricebig) return setPrice(parseFloat(pricebig) - 1.0)

    setPrice(0)
  })
  // hide extralist if clicked outside extralist
  document.addEventListener('click', (e) => hideOnClickOutside(document.getElementById('extralistContainer')))

  document.getElementById('extraFilterInput').addEventListener('keyup', function(e) {
    if(e.which === 13) {
      const extralist = document.getElementById('extralistContent').childNodes
      const filteredList = Array.from(extralist).filter(entry => entry.style && entry.style.display !== 'none')
      if(filteredList.length === 1) {
        if(document.getElementById('chosenExtras').textContent === 'Extras, Kommentare') {
          document.getElementById('chosenExtras').innerHTML = '<div class="tags" id="extraTags"></div>'
        }
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
            if(document.getElementById('extraTags').childNodes.length === 0) {
            document.getElementById('chosenExtras').textContent = 'Extras, Kommentare'
            }
        })
        tag.appendChild(deleteMe)
        document.getElementById('extraTags').appendChild(tag)
        updatePrice(tag.dataset.price)
      } else if(filteredList.length === 0) {
        const input = document.getElementById('extraFilterInput').value
        if(input.indexOf('-') !== -1 || input.indexOf('ohne') !== -1) {
            if(document.getElementById('chosenExtras').textContent === 'Extras, Kommentare') {
              document.getElementById('chosenExtras').innerHTML = '<div class="tags" id="extraTags"></div>'
            }
            const tag = document.createElement('span')
            tag.textContent = input
            tag.setAttribute('class', 'tag is-danger')
            tag.dataset.name = input
            tag.dataset.price = '0'
            const deleteMe = document.createElement('button')
            deleteMe.setAttribute('class', 'delete is-small')
            deleteMe.addEventListener('click', function(e) {
                this.parentNode.parentNode.removeChild(this.parentNode)
                if(document.getElementById('extraTags').childNodes.length === 0) {
                document.getElementById('chosenExtras').textContent = 'Extras, Kommentare'
                }
            })
            tag.appendChild(deleteMe)
            document.getElementById('extraTags').appendChild(tag)
        }
      }
    }
  })
})
