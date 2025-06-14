// Deployment configuration for production
module.exports = {
  build: {
    commands: [
      'npm run build'
    ]
  },
  start: {
    command: 'NODE_ENV=production npm start',
    env: {
      NODE_ENV: 'production'
    }
  },
  port: 5000
};