import 'bootstrap/dist/css/bootstrap.min.css'
import fontawesome from '@fortawesome/fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import regular from '@fortawesome/fontawesome-free-regular'

import 'bootstrap'
import 'popper.js'
import $ from 'jquery'

import io from 'socket.io-client'
const socket = io()

function syncOrder(data) {
    socket.emit('POSTorder', data)
}

function syncPaied(data) {
    socket.emit('POSTpaied', data)
}

function syncClearList() {
    socket.emit('clearList', {})
}

socket.on('reload', () => {
    location.reload()
})

socket.on('trollProtection', (statusObj) => {
    $('#trollModal').modal('show')
})

socket.on('GETpaied', (data) => {
    const x = document.getElementById(data.htmlid)
    x.value = data.paied
})

socket.on('GETorder', (data) => {
    $('#addOrderModal').modal('hide')
    $('#name').removeClass('is-valid')
    $('#meal').removeClass('is-valid')
    document.getElementById('name').value = ''
    document.getElementById('meal').value = ''
    document.getElementById('dropdownMenuButton').innerHTML = 'Größe'
    addRow(data)
})

socket.on('FAILorder', (data) => {
    alert(data.text)
})

socket.on('initOrders', (orders) => {
    var table = document.getElementById('orderTable')   
    for(let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i)
    }

    orders.forEach(order => {
        addRow(order)
    })
})

socket.on('initMeta', (metadata) => {
    metadata.forEach(data => {
        updateMetaField(data)
    })
})

socket.on('initPaied', (paied) => {
    paied.forEach(pay => {
        const x = document.getElementById(pay.htmlid)
        x.value = pay.paied
    })
})

socket.on('pushMeta', (data) => {
    updateMetaField(data)
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
    const table = document.getElementById('orderTable')

    const row = table.insertRow(-1)

    const id = row.insertCell(-1)
    const name = row.insertCell(-1)
    const meal = row.insertCell(-1)
    const size = row.insertCell(-1)
    const comment = row.insertCell(-1)
    const paied = row.insertCell(-1)

    // Add some text to the new cells:
    id.innerHTML = order.tableId
    name.innerHTML = order.name
    meal.innerHTML = order.meal
    size.innerHTML = order.size
    comment.innerHTML = order.comment
    const htmlid = order.name + order.meal + order.size
    const maxVal = 100
    
    const inputGroup = document.createElement('div')
    inputGroup.setAttribute('class', 'input-group')
    const inputPrepend = document.createElement('div')
    inputPrepend.setAttribute('class', 'input-group-prepend')
    const currencySpan = document.createElement('span')
    currencySpan.setAttribute('class', 'input-group-text')
    currencySpan.innerHTML = '€'
    inputPrepend.appendChild(currencySpan)
    
    const x = document.createElement('input')
    x.setAttribute('data-name', order.name)
    x.setAttribute('id', htmlid)
    x.setAttribute('class', 'form-control')
    x.setAttribute('type', 'number')
    x.setAttribute('step', '0.10')
    x.setAttribute('value', '0')
    x.setAttribute('min', '0')
    x.setAttribute('max', maxVal)
    inputGroup.appendChild(inputPrepend)
    inputGroup.appendChild(x)
    paied.appendChild(inputGroup)

    document.getElementById(htmlid).addEventListener('keyup', (e) => {
        e.preventDefault()
        const inputField = document.getElementById(htmlid)
        const paied = inputField.value

        syncPaied({ id: id, htmlid: htmlid, paied: paied })
    })
}

function initDateValue() {
    var dateControl = document.querySelector('input[type="date"]')
    dateControl.value = new Date().toISOString().substr(0, 10)
}

function initClearListButton() {
    $('#clearList').on('click', (e) => {
      e.preventDefault()
      $('#verifyClearListModal').modal('show')
    })
}

function initVerifyClearListButton() {
    $('#btnVerifyClearList').on('click', (e) => {
        e.preventDefault()
        syncClearList()
        $('#verifyClearListModal').modal('hide')
    })
}

function initOrder() {
    $('#saveOrder').on('click', (e) => {
        e.preventDefault()
        const name = document.getElementById('name').value
            ? document.getElementById('name').value
            : null
        const meal = document.getElementById('menubutton').value
            ? document.getElementById('menubutton').value
            : null
        const size = document.getElementById('dropdownMenuButton').innerText.includes('Größe')
            ? '--'
            : document.getElementById('dropdownMenuButton').innerHTML
        const comment = document.getElementById('comment').value
            ? document.getElementById('comment').value
            : '--'


        if (!name) {
            $('#name').removeClass('is-valid')
            $('#name').addClass('is-invalid')
        } else {
            $('#name').removeClass('is-invalid')
            $('#name').addClass('is-valid')
        }

        if (!meal) {
            $('#meal').removeClass('is-valid')
            $('#meal').addClass('is-invalid')
        } else {
            $('#meal').removeClass('is-invalid')
            $('#meal').addClass('is-valid')
        }

        if (!name || !meal) {
            return
        }

        const order = {
            name: name,
            meal: meal,
            size: size,
            comment: comment
        }

        syncOrder(order)
    })
}

const loadHobbitMenu = {
  now: () => {
    fetch('/getHobbitMenu')
      .then(res => res.json())
      .then(menudata => {
        window.hobbitmenu = menudata
        const menulist = document.getElementById('menulist')
        Object.keys(menudata).forEach(menuitem => {
          if(menuitem === 'Extras') return
          const listheading = document.createElement('h4')
          listheading.setAttribute('class', 'dropdown-header')
          listheading.innerHTML = menuitem
          menulist.appendChild(listheading)

          hobbitmenu[menuitem].forEach(meal => {
            const listitem = document.createElement('div')
            listitem.setAttribute('class', 'dropdown-item tooltip')
            listitem.dataset.category = menuitem
            Object.keys(meal).forEach(attr => {
              listitem.dataset[attr] = meal[attr]
            })

            function formatPrice(price) {
              return price.toFixed(2).toLocaleString() + '€'
            }

            function getPriceString(mealObj) {
              let returnString = '<small>'
              if(mealObj.pricesmall) returnString += '  Klein: ' + formatPrice(mealObj.pricesmall)
              if(mealObj.pricebig) returnString += ' Groß: ' + formatPrice(mealObj.pricebig)
              if(mealObj.price) returnString += ' Preis: ' + formatPrice(mealObj.price)

              returnString += '</small>'
              return returnString
            }
            
            listitem.innerHTML += menuitem === 'Pizzen'
              ? meal.number + ' ' + meal.name
              : meal.name
            
            listitem.innerHTML += getPriceString(meal)

            function formatIngredients(mealObj) {
              if(meal.ingredients[0] !== '') return 'Zutaten: ' + meal.ingredients.join(', ')
              return ''
            }

            const tooltipInfo = document.createElement('span')
            tooltipInfo.setAttribute('class', 'tooltiptext')
            tooltipInfo.innerHTML = formatIngredients(meal)
            listitem.appendChild(tooltipInfo)

            console.log(listitem)
            menulist.appendChild(listitem)
          })
        })
      })
      .catch(reason => console.error('could not fetch hobbit menu data: %o', reason))
  }
}

$(document).ready(() => {
    loadHobbitMenu.now()

    initDateValue()
    initClearListButton()
    initVerifyClearListButton()
    initOrder()

    setSizeLabel('sizeSmall', 'Klein')
    setSizeLabel('sizeBig', 'Groß')
    setSizeLabel('sizeNo', '--')
    updateMetaInfo('inputDate')
    updateMetaInfo('inputName')
    updateMetaInfo('inputCollector')
    updateMetaInfo('inputCollectTime')

    $("#myInput").on("keyup", function () {
      var value = $(this).val().toLowerCase();
      $(".dropdown-menu div").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      })
    })

    $(".dropdown-menu").on('click', 'div', function () {
      console.log(this)
      $("#menubutton:first-child").text($(this).text())
      $("#menubutton:first-child").val($(this).text())
    })
})
