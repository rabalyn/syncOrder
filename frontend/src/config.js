const config = {}

config.server = {}
config.server.baseUrl = 'https://panf-dev.übersprung.de'
config.server.apiUrl = `${config.server.baseUrl}/api`
config.server.socketIOPath = '/panf_dev/'

module.exports = config
