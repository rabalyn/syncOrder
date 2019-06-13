import fs from 'fs'
import debug from 'debug'

const logerror = debug('panf:lib:serialization:error')
const logdebug = debug('panf:lib:serialization:debug')

let tableIdFilestorepath = null
let ordersFilestorepath = null
let metaFilestorepath = null
let paiedFilestorepath = null

function saveJsonToFile(path, data) {
  fs.writeFile(path, JSON.stringify(data), (err) => {
    if (err) {
      logerror(err)
    }
  })
}

function saveState(tableId, orders, meta, paied) {
  logdebug('save state...')
  logdebug('tableId: %o, orders: %o, meta: %o, paied: %o', tableId, orders, meta, paied)
  fs.writeFile(tableIdFilestorepath, tableId.toString(), (err) => {
    if (err) {
      logerror(err)
    }
  })

  saveJsonToFile(ordersFilestorepath, orders)
  saveJsonToFile(metaFilestorepath, meta)
  saveJsonToFile(paiedFilestorepath, paied)
}

module.exports.Serialize = function(config) {
  ({tableIdFilestorepath, ordersFilestorepath, metaFilestorepath, paiedFilestorepath} = config.serialization)

  return {
    sync: (tableId, orders, meta, paied) => {
      saveState(tableId, orders, meta, paied)
    }
  }
}
