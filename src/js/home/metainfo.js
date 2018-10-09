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

export default metainfo