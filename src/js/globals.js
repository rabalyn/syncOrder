import 'bulma/css/bulma.min.css'

import { library, dom } from '@fortawesome/fontawesome-svg-core'

import { faMagic } from '@fortawesome/free-solid-svg-icons/faMagic'
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt'
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'

import io from 'socket.io-client'
import i18next from './i18next'

const socket = io()
window.socket = socket
window.i18next = i18next

library.add(faMagic, faFileAlt, faPhone, faTrashAlt, faAngleDown)
dom.watch()