import i18next from 'i18next'
import LngDetector from 'i18next-browser-languagedetector'

import deBundle from '../../../locales/de/translation.json'
import enBundle from '../../../locales/en/translation.json'

import debug from 'debug'
const logdebug = debug('i18n:debug')
const logerror = debug('i18n:error')
const loginfo = debug('i18n:info')
localStorage.debug += ' i18n:* '

const i18nextOptions = {
  fallbackLng: 'de',
  preload: ['de', 'en'],
  detection: {
    order: ['session', 'querystring', 'cookie'],
  
    // keys or params to lookup language from
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next'
  },
  resources: {
    de: { translation: deBundle },
    en: { translation: enBundle }
  }
}

i18next
  .use(LngDetector)
  .init(i18nextOptions, function(err) {
    if(err) logerror('i18next init failed: %O', err)

    logdebug('i18next language loaded: %s', i18next.language)
  })

module.exports = i18next