module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080,
    disableHostCheck: true,
    public: 'panf-dev.übersprung.de',
    overlay: {
      warnings: true,
      errors: true
    }
  },
  lintOnSave: true
}
