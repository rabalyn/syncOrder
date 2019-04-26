import debug from 'debug'
const loginfo = debug ('panf:serialization:info')
const logerror = debug('panf:serialization:error')
const logdebug = debug('panf:serialization:debug')

import path from 'path'
import fs from 'fs'

let config = null
let tableIdFilestorepath = null
let ordersFilestorepath = null
let metaFilestorepath = null
let paiedFilestorepath = null
let interval_in_ms = null

function saveState (tableId, orders, meta, paied) {
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
  
function saveJsonToFile (path, data) {
  fs.writeFile(path, JSON.stringify(data), (err) => {
    if (err) {
      logerror(err)
    }
  })
}

module.exports.Serialize = function (config) {
  tableIdFilestorepath = config.serialization.tableIdFilestorepath
  ordersFilestorepath = config.serialization.ordersFilestorepath
  metaFilestorepath = config.serialization.metaFilestorepath 
  paiedFilestorepath = config.serialization.paiedFilestorepath
  interval_in_ms = config.serialization.interval_in_ms

  return {
    sync: (tableId, orders, meta, paied) => {
      saveState(tableId, orders, meta, paied)
    }
  }
}