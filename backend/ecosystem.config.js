module.exports = {
  apps: [
    {
      name: 'panf-dev',
      script: './app.js',
      watch: ['lib', 'app.js', 'routes', 'src/locales', 'ecosystem.config.js'],
      interpreter: 'node_modules/.bin/babel-node',
      env: {
        NODE_ENV: 'development',
        DEBUG: 'panf:*'
      },
      // eslint-disable-next-line camelcase
      env_production: {
        NODE_ENV: 'production',
        DEBUG: 'panf:*'
      }
    }
  ]
}
