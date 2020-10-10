module.exports = {
  apps: [
    {
      name: 'panf-api',
      script: './src/index.js',
      watch: true,
      ignore_watch : ['node_modules', 'docker-data']
    }
  ]
}
