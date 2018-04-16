const socket = io()

function syncOrder(data) {
    socket.emit('POSTorder', data)
}

socket.on('GETorder', (data) => {
    addRow(data)
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
    const table = document.getElementById("orderTable")

    var row = table.insertRow(1)

    var name = row.insertCell(-1)
    var meal = row.insertCell(-1)
    var size = row.insertCell(-1)
    var comment = row.insertCell(-1)
    var paied = row.insertCell(-1)

    // Add some text to the new cells:
    name.innerHTML = order.name
    meal.innerHTML = order.meal
    size.innerHTML = order.size
    comment.innerHTML = order.comment
    var x = document.createElement("INPUT");
    x.setAttribute("type", "text");
    x.setAttribute("value", "Hello World!");
    paied.appendChild(x);
}

function initDateValue() {
    var dateControl = document.querySelector('input[type="date"]')
    dateControl.value = new Date().toISOString().substr(0, 10)
}

$(document).ready(() => {
    initDateValue()

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
        const size = document.getElementById('dropdownMenuButton').innerHTML
        const comment = document.getElementById('comment').value
            ? document.getElementById('comment').value
            : '--'

        if(!name || !meal) {
            console.log('order incomplete!')
            return
        }

        const order = {
            name: name,
            meal: meal,
            size: size,
            comment: comment
        }
        console.log(order)
        syncOrder(order)
        $('#saveOrder').modal('hide')
    })

})