import '../globals'
import '../bulmahelpers'

import debug from 'debug'

import metainfo from './metainfo'
import orderlist from './orderlist'
import addorder from './addorder'

import { library, dom } from '@fortawesome/fontawesome-svg-core'

import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone'
import { faPeopleCarry } from '@fortawesome/free-solid-svg-icons/faPeopleCarry'
import { faBox } from '@fortawesome/free-solid-svg-icons/faBox'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import { faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons/faMoneyBillAlt'
import { faCartPlus } from '@fortawesome/free-solid-svg-icons/faCartPlus'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'

import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons/faCalendarAlt'
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock'
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment'

import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'

library.add(faExclamationTriangle, faUser, faCalendarAlt, faClock, faGithub, faPhone, faPeopleCarry, faBox, faSearch, faMoneyBillAlt, faComment, faCartPlus, faAngleDown)
dom.watch()

const logdebug = debug('home:debug')
const logerror = debug('home:error')
const loginfo = debug('home:info')
localStorage.debug += ' home:* '

loginfo('home, sweet home 👀🙀👻')

const trollModal = document.getElementById('trollModal')
const addOrderModal = document.getElementById('addOrderModal')
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
  // '/hobbit/getHobbitMenu'
  addorder.loadMenu('/davinci/getDaVinciMenu')

  btnOpenAddOrder.addEventListener('click', (e) => {
    addorder.setMealprice(0)
    addorder.resetChosenMeal()
    addorder.resetChosenExtras()
    addorder.resetInputName()
    addorder.showPrice()
    chosenMeal.textContent = i18next.t('addOrderModal.meals')
    addOrderModal.classList.add('is-active')
  })

  const lazyloadElemes = document.getElementsByClassName('lazyload')
  Array.from(lazyloadElemes).forEach((elem) => {
    const dataUrl = elem.getAttribute('data-src')
    elem.setAttribute('src', dataUrl)
  })
})
