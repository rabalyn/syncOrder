module.exports = {
  apps: [
    {
      name: 'panf-dev',
      script: './app.js',
      watch: ['lib', 'app.js', 'routes', 'src/locales', 'ecosystem.config.js'],
      interpreter: 'babel-node',
      env: {
        NODE_ENV: 'development',
        DEBUG: 'panf:*'
      },
      env_production: {
        NODE_ENV: 'production',
        DEBUG: 'panf:*'
      }
    }
  ]
}
