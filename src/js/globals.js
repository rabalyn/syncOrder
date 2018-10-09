import 'bulma/css/bulma.min.css'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import io from 'socket.io-client'
import i18next from './i18next'

const socket = io()
window.socket = socket
window.i18next = i18next

library.add(fas, far, fab)
dom.watch()