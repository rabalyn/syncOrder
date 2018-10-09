const syncPaied = (data) => socket.emit('POSTpaied', data)
const tableOrderBody = document.getElementById('orderTableBody')
const syncClearList = () => socket.emit('clearList', {})
const clearList = document.getElementById('clearList')

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

export default orderlist