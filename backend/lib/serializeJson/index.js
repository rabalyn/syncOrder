import debug from 'debug'
const loginfo = debug ('serialization:info')
const logerror = debug('serialization:error')
const logdebug = debug('serialization:debug')

import path from 'path'
import fs from 'fs'

let config = null
let tableIdFilestorepath = null
let ordersFilestorepath = null
let metaFilestorepath = null
let paiedFilestorepath = null
let interval_in_ms = null

function saveState(tableId, orders, meta, paied) {
    logdebug('save state...')
    fs.writeFile(tableIdFilestorepath, tableId.toString(), (err) => {
      if(err) {
        logerror(err)
      }
    })
  
    saveJsonToFile(ordersFilestorepath, orders)
    saveJsonToFile(metaFilestorepath, meta)
    saveJsonToFile(paiedFilestorepath, paied)
}
  
function saveJsonToFile(path, data) {
    fs.writeFile(path, JSON.stringify(data), (err) => {
        if(err) {
        logerror(err)
        }
    })
}

module.exports.setConfig = (conf) => {
    config = conf
    tableIdFilestorepath = config.serialization.tableIdFilestorepath
    ordersFilestorepath = config.serialization.ordersFilestorepath
    metaFilestorepath = config.serialization.metaFilestorepath 
    paiedFilestorepath = config.serialization.paiedFilestorepath
    interval_in_ms = config.serialization.interval_in_ms
}

module.exports.sync = function sync(tableId, orders, meta, paied) {
    saveState(tableId, orders, meta, paied)
}