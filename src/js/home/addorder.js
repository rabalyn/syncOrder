import { library, dom } from '@fortawesome/fontawesome-svg-core'

import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faBox } from '@fortawesome/free-solid-svg-icons/faBox'
import { faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons/faMoneyBillAlt'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave'

import debug from 'debug'
const logdebug = debug('addorder:debug')
const loginfo = debug('addorder:info')
localStorage.debug += ' addorder:* '

library.add(faUser, faBox, faMoneyBillAlt, faAngleDown, faTimes, faSave)
dom.watch()

const syncOrder = (data) => socket.emit('POSTorder', data)

const addorder = {
  mealprice: 0,
  extraprice: 0,
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
        this.setMealprice(parseFloat(price))
        this.showPrice()
        return // exit function
      }

      const pricesmall = this.chosenMeal.dataset.pricesmall ? this.chosenMeal.dataset.pricesmall : null
      if(size === i18next.t('addOrderModal.normalsize') && pricesmall) {
        const smallLunchDiscount = this.isLunchTime() ? this.smallPizzaDiscount : 0
        this.setMealprice(parseFloat(this.pricesmall) - smallLunchDiscount)
        this.showPrice()
        return // exit function
      }

      const pricebig = this.chosenMeal.dataset.pricebig ? this.chosenMeal.dataset.pricebig : null
      if(size === i18next.t('addOrderModal.bigsize') && this.pricebig) {
        const normalLunchDiscount = this.isLunchTime() ? this.bigPizzaDiscount : 0
        this.setMealprice(parseFloat(pricebig) - normalLunchDiscount)
        this.showPrice()
        return // exit function
      }

      this.setMealprice(0)
      this.showPrice()
    })

    this.menulistTrigger.addEventListener('click', function(e) {
      addorder.menulistContainer.classList.toggle('is-active')
    })
    this.sizelistTrigger.addEventListener('click', function(e) {
      addorder.sizelistContainer.classList.toggle('is-active')
    })
    this.extralistTrigger.addEventListener('click', function(e) {
      addorder.extralistContainer.classList.toggle('is-active')
    })

    this.mealFilterInput.addEventListener('keyup', function(e) {
      const searchValue = mealFilterInput.value.toLowerCase()
      const meals = document.getElementsByName('mealEntry')
      Array.from(meals).forEach(meal => {
        meal.style.display = (meal.textContent.toLowerCase().indexOf(searchValue) > -1)
          ? ''
          : 'none'
      })
    })

    this.extraFilterInput.addEventListener('keyup', (e) => addorder.filterExtraInput())

    // hide menulist if clicked outside menulist
    document.addEventListener('click', (e) => hideOnClickOutside(addorder.menulistContainer))
    // hide sizelist if clicked outside sizelist
    document.addEventListener('click', (e) => hideOnClickOutside(addorder.sizelistContainer))
    sizeNormal.addEventListener('click', (e) => addorder.choosePizza(i18next.t('addOrderModal.normalsize')))
    sizeBig.addEventListener('click', (e) => addorder.choosePizza(i18next.t('addOrderModal.bigsize')))
    // hide extralist if clicked outside extralist
    document.addEventListener('click', (e) => hideOnClickOutside(addorder.extralistContainer))

    this.extraFilterInput.addEventListener('keyup', function(e) {
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
            addorder.setExtraprice(myPrice)
            addorder.showPrice()
            this.parentNode.parentNode.removeChild(this.parentNode)
            if(extraTags.childNodes.length === 0) {
              chosenExtras.textContent = i18next.t('addOrderModal.extras') + ', ' + i18next.t('addOrderModal.comments')
            }
          })
          tag.appendChild(deleteMe)
          extraTags.appendChild(tag)
          addorder.setExtraprice(tag.dataset.price)
          addorder.showPrice()
        } else if(filteredList.length === 0) {
          const input = extraFilterInput.value
          addorder.inputContainsNegativeChar(input)
              ? addorder.addTag('tag is-danger', 0)
              : addorder.addTag('tag is-light', 0)
        }

        addorder.extraFilterInput.value = ''
        addorder.filterExtraInput()
      }
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
      logdebug(addorder)
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
    //fetch('/getHobbitMenu')
    fetch('getDaVinciMenu')
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
            logdebug(this.dataset)
            if(this.dataset.pricesmall) {
              const size = addorder.chosenSize.textContent
              size === i18next.t('addOrderModal.normalsize')
                ? addorder.setMealprice(parseFloat(this.dataset.pricesmall) - smallLunchDiscount)
                : addorder.setMealprice(parseFloat(this.dataset.pricebig) - normalLunchDiscount)
            } else {
              addorder.setMealprice(parseFloat(this.dataset.price))
            }
            addorder.showPrice()
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
                  addorder.setExtraprice(myPrice)
                  addorder.showPrice()
                this.parentNode.parentNode.removeChild(this.parentNode)
                if(extraTags.childNodes.length === 0) {
                  addorder.chosenExtras.textContent = i18next.t('addOrderModal.extras') + ', ' + i18next.t('addOrderModal.comments')
                }
              })
              tag.appendChild(deleteMe)
              addorder.extraTags.appendChild(tag)
              addorder.setExtraprice(tag.dataset.price)
              addorder.showPrice()
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
                addorder.setExtraprice(myPrice)
                addorder.showPrice()
                this.parentNode.parentNode.removeChild(this.parentNode)
                if(extraTags.childNodes.length === 0) {
                  addorder.chosenExtras.textContent = i18next.t('addOrderModal.extras') + ', ' + i18next.t('addOrderModal.comments')
                }
              })
              tag.appendChild(deleteMe)
              addorder.extraTags.appendChild(tag)
              addorder.setExtraprice(tag.dataset.price)
              addorder.showPrice()
            }
            //resetChosenExtra()
            addorder.extralistContainer.classList.remove('is-active')
          })
        })
      })
      .catch(reason => logerror('could not fetch hobbit menu data: %o', reason))
  },
  setMealprice: function(price) {
    this.mealprice = parseFloat(price)
  },
  setExtraprice: function(price) {
    this.extraprice += parseFloat(price)
  },
  showPrice: function() {
    const price = parseFloat(this.mealprice) + parseFloat(this.extraprice)
    logdebug('price: %f, mealprice: %f, extraprice: %f', price, this.mealprice, this.extraprice)
    this.pricePreview.textContent = price >= 0 ? `${parseFloat(price).toFixed(2)}€` : `0.00€`
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
    this.extraprice = 0.00
    this.chosenExtras.innerHTML = ''
    this.chosenExtras.textContent = i18next.t('addOrderModal.extras') + ', ' + i18next.t('addOrderModal.comments')
  },
  resetInputName: function() {
    this.nameInput.value = ''
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
  
    if(price) {
      this.setMealprice(parseFloat(price))
      this.showPrice()
      return // exit function
    }

    const smallLunchDiscount = this.isLunchTime() ? this.smallPizzaDiscount : 0
    if(size === i18next.t('addOrderModal.normalsize') && pricesmall) {
      this.setMealprice(parseFloat(pricesmall) - smallLunchDiscount)
      this.showPrice()
      return // exit function
    }

    const normalLunchDiscount = this.isLunchTime() ? this.bigPizzaDiscount : 0
    if(size === i18next.t('addOrderModal.bigsize') && pricebig) {
      this.setMealprice(parseFloat(pricebig) - normalLunchDiscount)
      this.showPrice()
      return // exit function
    }

    this.setMealprice(0)
    this.showPrice()
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

export default addorder