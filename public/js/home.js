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

socket.on('GETpaied', (data) => {
    const x = document.getElementById(data.htmlid)
    x.value = data.paied
})

socket.on('GETorder', (data) => {
    $('#addOrderModal').modal('hide')
    document.getElementById('name').value = ''
    document.getElementById('meal').value = ''
    document.getElementById('dropdownMenuButton').innerHTML = 'Größe'
    addRow(data)
})

socket.on('FAILorder', (data) => {
    alert(data.text)
})

socket.on('initOrders', (orders) => {
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

function updateMetaInfo(id) {
    document.getElementById(id).addEventListener('focusout', (e) => {
        e.preventDefault()
        const text = document.getElementById(id).value
        socket.emit('syncMeta', {id: id, text: text})
    })
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

    const x = document.createElement('INPUT')
    x.setAttribute('data-name', order.name)
    x.setAttribute('id', htmlid)
    x.setAttribute('type', 'number')
    x.setAttribute('step', '0.10')
    x.setAttribute('value', '0')
    x.setAttribute('min', '0')
    x.setAttribute('max', '100')
    paied.appendChild(x)

    document.getElementById(htmlid).addEventListener('focusout', (e) => {
        e.preventDefault()
        const paied = document.getElementById(htmlid).value
        syncPaied({id: id, htmlid: htmlid, paied: paied})
    })
}

function initDateValue() {
    var dateControl = document.querySelector('input[type="date"]')
    dateControl.value = new Date().toISOString().substr(0, 10)
}

function initClearListButton() {
    document.getElementById('clearList').addEventListener('click', (e) => {
        e.preventDefault()
        $('#verifyClearListModal').modal('show')
    })
}

function initVerifyClearListButton() {
    document.getElementById('btnVerifyClearList').addEventListener('click', (e) => {
        e.preventDefault()
        syncClearList()
        $('#verifyClearListModal').modal('hide')
    })
}

$(document).ready(() => {
    initDateValue()
    initClearListButton()
    initVerifyClearListButton()

    setSizeLabel('sizeSmall', 'Klein')
    setSizeLabel('sizeBig', 'Groß')
    setSizeLabel('sizeNo', '--')
    updateMetaInfo('inputName')
    updateMetaInfo('inputCollector')
    updateMetaInfo('inputCollectTime')

    document.getElementById('saveOrder').addEventListener('click', (e) => {

        e.preventDefault()
        const name = document.getElementById('name').value
            ? document.getElementById('name').value
            : null
        const meal = document.getElementById('meal').value
            ? document.getElementById('meal').value
            : null
        const size = document.getElementById('dropdownMenuButton').innerHTML === 'Größe'
            ? document.getElementById('dropdownMenuButton').innerHTML
            : '--'
        const comment = document.getElementById('comment').value
            ? document.getElementById('comment').value
            : '--'


        if(!name) {
            $('#name').removeClass('is-valid')
            $('#name').addClass('is-invalid')
        } else {
            $('#name').removeClass('is-invalid')
            $('#name').addClass('is-valid')
        }

        if(!meal) {
            $('#meal').removeClass('is-valid')
            $('#meal').addClass('is-invalid')
        } else {
            $('#meal').removeClass('is-invalid')
            $('#meal').addClass('is-valid')
        }

        if(!name || !meal) {
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

})
