// PM2 Configuration für Mushroom Manager
module.exports = {
  apps: [
    {
      name: 'mushroom-manager',
      script: 'node',
      args: 'dev-server.js',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}