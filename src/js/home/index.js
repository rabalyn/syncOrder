import '../globals'
import '../bulmahelpers'

import debug from 'debug'
const logdebug = debug('home:debug')
const logerror = debug('home:error')
const loginfo = debug('home:info')
localStorage.debug += ' home:* '

loginfo('home, sweet home 👀🙀👻')

const syncOrder = (data) => socket.emit('POSTorder', data)
const syncPaied = (data) => socket.emit('POSTpaied', data)
const syncClearList = () => socket.emit('clearList', {})

const trollModal = document.getElementById('trollModal')
const addOrderModal = document.getElementById('addOrderModal')

const tableOrderBody = document.getElementById('orderTableBody')
const clearList = document.getElementById('clearList')
const btnOpenAddOrder = document.getElementById('btnOpenAddOrder')

socket.on('reload', () => location.reload())
socket.on('trollProtection', (statusObj) => trollModal.classList.add('is-active'))
socket.on('FAILorder', (data) => alert(data.text))
socket.on('initMeta', (metadata) => metadata.forEach(data => metainfo.updateMetaField(data)))
socket.on('initPaied', (paied) => {
  paied.forEach(pay => document.getElementById(pay.htmlid).value = pay.paied)
  orderlist.initSumPrepaid()
})
socket.on('pushMeta', (data) => metainfo.updateMetaField(data))
socket.on('GETpaied', (data) => {
  const x = document.getElementById(data.htmlid)
  x.value = data.paied
  orderlist.initSumPrepaid()
})

socket.on('GETorder', (data) => {
  chosenMeal.textContent = i18next.t('addOrderModal.meals')
  chosenSize.textContent = i18next.t('addOrderModal.normalsize')
  orderlist.addRow(data)
  addorder.initSumToPay()
})

socket.on('initOrders', (orders) => {
  Array.from(orderTableBody.rows).forEach((row, idx) => table.deleteRow(idx))
  orders.forEach(order => orderlist.addRow(order))
  addorder.initSumToPay()
})

const metainfo = {
  updateMetaField: function(data) {
    const id = data.id
    const text = data.text
    document.getElementById(id).value = text
  },
  _bindUpdateMetaInfo: function(e) {
    const id = e.target.id
    e.preventDefault()
    const text = document.getElementById(id).value
    socket.emit('syncMeta', { id: id, text: text })
  },
  updateMetaInfo: function(id) {
    document.getElementById(id).addEventListener('keyup', this._bindUpdateMetaInfo, false)
    document.getElementById(id).addEventListener('change', this._bindUpdateMetaInfo, false)
  },
  initDateValue: function() {
    const dateControl = document.querySelector('input[type="date"]')
    dateControl.value = new Date().toISOString().substr(0, 10)
  }
}

const orderlist = {
  addRow: function(order) {
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
  
    const row = tableOrderBody.insertRow(-1)
    row.setAttribute('scope', 'row')
  
    const id = row.insertCell(-1)
    const name = row.insertCell(-1)
    const meal = row.insertCell(-1)
    const size = row.insertCell(-1)
    const comment = row.insertCell(-1)
    const price = row.insertCell(-1)
    const paied = row.insertCell(-1)
  
    // Add some text to the new cells:
    id.textContent = order.tableId
    name.textContent = order.name
    meal.textContent = order.meal
    size.textContent = order.size
    comment.appendChild(extraTagList)
    price.textContent = order.price
    price.setAttribute('name', 'mealprice')
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
  
    const paiedChangeSync = (e) => {
      e.preventDefault()
      const inputField = document.getElementById(htmlid)
      const paied = inputField.value
      const syncObj = { id: id, htmlid: htmlid, paied: paied }
      syncPaied(syncObj)
    }

    document.getElementById(htmlid).addEventListener('keyup', (e) => {
      paiedChangeSync(e)
    })
  
    document.getElementById(htmlid).addEventListener('change', (e) => {
      paiedChangeSync(e)
    })
  },
  initClearListButton: function() {
    clearList.addEventListener('click', (e) => {
      e.preventDefault()
      document.getElementById('verifyClearListModal').classList.add('is-active')
    })
  },
  initVerifyClearListButton: function() {
    document.getElementById('btnVerifyClearList').addEventListener('click', (e) => {
      e.preventDefault()
      syncClearList()
      document.getElementById('verifyClearListModal').classList.remove('is-active')
    })
  },
  initSumPrepaid: function() {
    const sum = Array.from(document.querySelectorAll('input[type=number]')).reduce((p, input) => {
      return parseFloat(input.value) + p
    }, 0)
    document.getElementById('sumprepaid').textContent = sum.toFixed(2) + '€'
  }
}

const addorder = {
  smallPizzaDiscount: 0.5,
  bigPizzaDiscount: 1.0,
  chosenMeal: document.getElementById('chosenMeal'),
  chosenSize: document.getElementById('chosenSize'),
  chosenExtras: document.getElementById('chosenExtras'),
  nameInput: document.getElementById('name'),
  menulistContainer: document.getElementById('menulistContainer'),
  extraTags: null,
  menulistTrigger: document.getElementById('menulistTrigger'),
  menulistContent: document.getElementById('menulistContent'),
  sizelistTrigger: document.getElementById('sizelistTrigger'),
  sizelistContainer: document.getElementById('sizelistContainer'),
  extralistTrigger: document.getElementById('extralistTrigger'),
  extralistContent: document.getElementById('extralistContent'),
  extralistContainer: document.getElementById('extralistContainer'),
  mealFilterInput: document.getElementById('mealFilterInput'),
  extraFilterInput: document.getElementById('extraFilterInput'),
  sizeNormal: document.getElementById('sizeNormal'),
  sizeBig: document.getElementById('sizeBig'),
  pricePreview: document.getElementById('pricePreview'),
  initialize: function() {
    this.chosenSize.addEventListener('change', function(e) {
      e.preventDefault()
      const size = this.textContent
      const price = this.chosenMeal.dataset.price ? this.chosenMeal.dataset.price : null
      
      if(price) {
        return this.setPrice(parseFloat(price))
      }

      const pricesmall = this.chosenMeal.dataset.pricesmall ? this.chosenMeal.dataset.pricesmall : null
      if(size === i18next.t('addOrderModal.normalsize') && pricesmall) {
        const smallLunchDiscount = this.isLunchTime() ? this.smallPizzaDiscount : 0
        return this.setPrice(parseFloat(this.pricesmall) - smallLunchDiscount)
      }

      const pricebig = this.chosenMeal.dataset.pricebig ? this.chosenMeal.dataset.pricebig : null
      if(size === i18next.t('addOrderModal.bigsize') && this.pricebig) {
        const normalLunchDiscount = this.isLunchTime() ? this.bigPizzaDiscount : 0
        return this.setPrice(parseFloat(pricebig) - normalLunchDiscount)
      }

      this.setPrice(0)
    })
  },
  resetChosenMeal: function() {
    Object.keys(this.chosenMeal.dataset).forEach(function(attr) {
      delete addorder.chosenMeal.dataset[attr]
    })
  },
  formatPrice: function(price) {
    return price.toFixed(2).toLocaleString() + '€'
  },
  formatIngredients: function(meal) {
    return (meal.ingredients[0] !== '') ? ' <span>(' + meal.ingredients.join(', ') + ')</span>' : ''
  },
  isLunchTime: function() {
    return (new Date().getHours() < 17) ? true : false
  },
  getPriceString: function(mealObj) {
    let returnString = '<span hidden>'
    if(mealObj.pricesmall) returnString += ' ' + i18next.t('addOrderModal.normalsize') + ' ' + this.formatPrice(mealObj.pricesmall)
    if(mealObj.pricebig) returnString   += ' ' + i18next.t('addOrderModal.bigsize') + ' ' + this.formatPrice(mealObj.pricebig)
    if(mealObj.price) returnString      += ' ' + i18next.t('addOrderModal.price') + ': ' + this.formatPrice(mealObj.price)

    returnString += '</span>'
    return returnString
  },
  initOrder: function() {
    document.getElementById('saveOrder').addEventListener('click', function(e) {
      e.preventDefault()
      const name = addorder.nameInput.value
          ? addorder.nameInput.value
          : null
      const meal = addorder.chosenMeal.dataset
          ? addorder.chosenMeal.dataset
          : null
      const size = addorder.chosenSize.textContent
          ? addorder.chosenSize.textContent
          : null
      const extrasContainer = addorder.extraTags
          ? addorder.extraTags
          : null
      const price = addorder.pricePreview.textContent
          ? addorder.pricePreview.textContent
          : null
  
      let extras = (extrasContainer) 
        ? Array.from(extrasContainer.childNodes).map((extra) => extra.dataset)
        : null
  
      if(!name) {
        addorder.nameInput.classList.add('is-danger')
      } else {
        addorder.nameInput.classList.remove('is-danger')
      }
  
      if(!meal.name) {
        addorder.menulistTrigger.classList.add('is-danger')
      } else {
        addorder.menulistTrigger.classList.remove('is-danger')
      }
  
      if(!name || !meal.name || !price) return
  
      const order = {
        name: name,
        meal: JSON.stringify(meal),
        size: size,
        extras: JSON.stringify(extras),
        price: price
      }
  
      addOrderModal.classList.remove('is-active')
      addorder.nameInput.classList.remove('is-valid')
      addorder.nameInput.value = ''
      addorder.resetChosenMeal()
      addorder.resetChosenExtras()
      syncOrder(order)
    })
  },
  loadHobbitMenu: function() {
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

              extraitem.innerHTML = extra.name + ' ' + this.getPriceString(extra)

              this.extralistContent.appendChild(extraitem)
            })
            return
          }

          const listheading = document.createElement('h4')
          listheading.setAttribute('class', 'dropdown-header')
          listheading.innerHTML = menuitem
          this.menulistContent.appendChild(listheading)

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
            
            listitem.innerHTML += this.getPriceString(meal)

            const tooltipInfo = document.createElement('span')
            tooltipInfo.setAttribute('class', 'tooltiptext')
            tooltipInfo.innerHTML = this.formatIngredients(meal)
            listitem.appendChild(tooltipInfo)

            this.menulistContent.appendChild(listitem)
          })
        })
      })
      .then(() => {
        const meals = document.getElementsByName('mealEntry')
        Array.from(meals).forEach(meal => {
          meal.addEventListener('click', function(e) {
            e.preventDefault()
            addorder.chosenMeal.textContent = this.textContent
            addorder.resetChosenMeal()
            Object.keys(meal.dataset).forEach(attr => addorder.chosenMeal.dataset[attr] = meal.dataset[attr])
            addorder.menulistContainer.classList.remove('is-active')
            const smallLunchDiscount = addorder.isLunchTime() ? addorder.smallPizzaDiscount : 0
            const normalLunchDiscount = addorder.isLunchTime() ? addorder.bigPizzaDiscount : 0
            if(this.dataset.pricesmall) {
              const size = addorder.chosenSize.textContent
              size === i18next.t('addOrderModal.normalsize')
                ? addorder.setPrice(parseFloat(this.dataset.pricesmall) - addorder.smallLunchDiscount)
                : addorder.setPrice(parseFloat(this.dataset.pricebig) - addorder.normalLunchDiscount)
            } else {
              addorder.setPrice(parseFloat(this.dataset.price))
            }
          })
        })
      })
      .then(() => {
        const extras = document.getElementsByName('extraEntry')
        Array.from(extras).forEach(extra => {
          extra.addEventListener('click', function(e) {
            e.preventDefault()
            addorder.initChosenExtras()
            addorder.extraFilterInput.value = ''
            addorder.filterExtraInput()
            if(addorder.chosenExtras.textContent === i18next.t('addOrderModal.extras') + ', ' + i18next.t('addOrderModal.comments')) {
              addorder.chosenExtras.innerHTML = '<div class="tags" id="extraTags"></div>'
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
                  addorder.updatePrice(myPrice)
                this.parentNode.parentNode.removeChild(this.parentNode)
                if(extraTags.childNodes.length === 0) {
                  addorder.chosenExtras.textContent = i18next.t('addOrderModal.extras') + ', ' + i18next.t('addOrderModal.comments')
                }
              })
              tag.appendChild(deleteMe)
              addorder.extraTags.appendChild(tag)
              addorder.updatePrice(tag.dataset.price)
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
                addorder.updatePrice(myPrice)
                this.parentNode.parentNode.removeChild(this.parentNode)
                if(extraTags.childNodes.length === 0) {
                  addorder.chosenExtras.textContent = i18next.t('addOrderModal.extras') + ', ' + i18next.t('addOrderModal.comments')
                }
              })
              tag.appendChild(deleteMe)
              addorder.extraTags.appendChild(tag)
              addorder.updatePrice(tag.dataset.price)
            }
            //resetChosenExtra()
            addorder.extralistContainer.classList.remove('is-active')
          })
        })
      })
      .catch(reason => logerror('could not fetch hobbit menu data: %o', reason))
  },
  setPrice: function(price) {
    this.pricePreview.textContent = price.toFixed(2) + '€'
  },
  updatePrice: function(toAdd) {
    const oldPrice = parseFloat(pricePreview.textContent)
    const newPrice = parseFloat(toAdd) + oldPrice
    this.setPrice(newPrice)
  },
  inputContainsNegativeChar: function(input) {
    (input.indexOf('-') !== -1 || input.indexOf('ohne') !== -1)
  },
  initChosenExtras: function() {
    if(this.chosenExtras.textContent === i18next.t('addOrderModal.extras') + ', ' + i18next.t('addOrderModal.comments')) {
      this.chosenExtras.innerHTML = '<div class="tags" id="extraTags"></div>'
    }
    this.extraTags = document.getElementById('extraTags')
  },
  resetChosenExtras: function() {
    this.chosenExtras.innerHTML = ''
    this.chosenExtras.textContent = i18next.t('addOrderModal.extras') + ', ' + i18next.t('addOrderModal.comments')
  },
  addTag: function(tagClass, price) {
    this.initChosenExtras()
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
      if(addorder.extraTags.childNodes.length === 0) {
        addorder.chosenExtras.textContent = i18next.t('addOrderModal.extras') + ', ' + i18next.t('addOrderModal.comments')
      }
    })
    tag.appendChild(deleteMe)
    addorder.extraTags.appendChild(tag)
  },
  choosePizza: function(size) {
    this.chosenSize.textContent = size
    this.sizelistContainer.classList.remove('is-active')
    const price = this.chosenMeal.dataset.price
      ? this.chosenMeal.dataset.price
      : null
    const pricesmall = this.chosenMeal.dataset.pricesmall
      ? this.chosenMeal.dataset.pricesmall
      : null
    const pricebig = this.chosenMeal.dataset.pricebig
      ? this.chosenMeal.dataset.pricebig
      : null
  
    if(price) return this.setPrice(parseFloat(price))
    const smallLunchDiscount = this.isLunchTime() ? this.smallPizzaDiscount : 0
    if(size === i18next.t('addOrderModal.normalsize') && pricesmall) {
      return this.setPrice(parseFloat(pricesmall) - smallLunchDiscount)
    }

    const normalLunchDiscount = this.isLunchTime() ? this.bigPizzaDiscount : 0
    if(size === i18next.t('addOrderModal.bigsize') && pricebig) {
      return this.setPrice(parseFloat(pricebig) - normalLunchDiscount)
    }

    this.setPrice(0)
  },
  filterExtraInput: function() {
    const searchValue = extraFilterInput.value.toLowerCase()
    const extras = document.getElementsByName('extraEntry')
    Array.from(extras).forEach(extra => {
      extra.style.display = (extra.textContent.toLowerCase().indexOf(searchValue) > -1)
        ? ''
        : 'none'
    })
  },
  initSumToPay: function() {
    const sum = Array.from(document.getElementsByName('mealprice')).reduce((prevValue, priceNode) => {
      return parseFloat(priceNode.textContent) + prevValue
    }, 0)
    document.getElementById('sumtopay').textContent = sum.toFixed(2) + '€'
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbar()
  initModalDismissButtons('closeOrder', 'addOrderModal')
  initModalDismissButtons('closeClearList', 'verifyClearListModal')
  initModalDismissButtons('closeTroll', 'trollModal')

  metainfo.initDateValue()
  metainfo.updateMetaInfo('inputDate')
  metainfo.updateMetaInfo('inputName')
  metainfo.updateMetaInfo('inputCollector')
  metainfo.updateMetaInfo('inputCollectTime')

  orderlist.initClearListButton()
  orderlist.initVerifyClearListButton()

  addorder.initialize()
  addorder.initOrder()
  addorder.loadHobbitMenu()

  btnOpenAddOrder.addEventListener('click', (e) => {
    addorder.setPrice(0)
    addorder.resetChosenMeal()
    chosenMeal.textContent = 'Mahlzeiten'
    addOrderModal.classList.add('is-active')
  })

  menulistTrigger.addEventListener('click', (e) => menulistContainer.classList.toggle('is-active'))
  sizelistTrigger.addEventListener('click', (e) => sizelistContainer.classList.toggle('is-active'))
  extralistTrigger.addEventListener('click', (e) => extralistContainer.classList.toggle('is-active'))

  mealFilterInput.addEventListener('keyup', (e) => {
    const searchValue = mealFilterInput.value.toLowerCase()
    const meals = document.getElementsByName('mealEntry')
    Array.from(meals).forEach(meal => {
      meal.style.display = (meal.textContent.toLowerCase().indexOf(searchValue) > -1)
        ? ''
        : 'none'
    })
  })

  extraFilterInput.addEventListener('keyup', (e) => addorder.filterExtraInput())

  // hide menulist if clicked outside menulist
  document.addEventListener('click', (e) => hideOnClickOutside(menulistContainer))
  // hide sizelist if clicked outside sizelist
  document.addEventListener('click', (e) => hideOnClickOutside(sizelistContainer))
  sizeNormal.addEventListener('click', (e) => addorder.choosePizza(i18next.t('addOrderModal.normalsize')))
  sizeBig.addEventListener('click', (e) => addorder.choosePizza(i18next.t('addOrderModal.bigsize')))
  // hide extralist if clicked outside extralist
  document.addEventListener('click', (e) => hideOnClickOutside(extralistContainer))

  extraFilterInput.addEventListener('keyup', function(e) {
    if(e.which === 13) { // 13 === return
      const extralist = document.getElementById('extralistContent').childNodes
      const filteredList = Array.from(extralist).filter(entry => entry.style && entry.style.display !== 'none')
      if(filteredList.length === 1) {
        addorder.initChosenExtras()
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
          addorder.updatePrice(myPrice)
          this.parentNode.parentNode.removeChild(this.parentNode)
          if(extraTags.childNodes.length === 0) {
            chosenExtras.textContent = i18next.t('addOrderModal.extras') + ', ' + i18next.t('addOrderModal.comments')
          }
        })
        tag.appendChild(deleteMe)
        extraTags.appendChild(tag)
        addorder.updatePrice(tag.dataset.price)
      } else if(filteredList.length === 0) {
        const input = extraFilterInput.value
        inputContainsNegativeChar(input)
            ? addTag('tag is-danger', 0)
            : addTag('tag is-light', 0)
      }

      extraFilterInput.value = ''
      addorder.filterExtraInput()
    }
  })
})
