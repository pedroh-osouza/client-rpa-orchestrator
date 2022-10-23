const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      nodeIntegration: true,
      contextIsolation: false,
      builderOptions: {
        extraFiles: [{
          "from":"src/icons",
          "to":"src/icons",
          "filter": ["**/*"]
        }]
      }
    }
  },
  transpileDependencies: [
    'vuetify'
  ]
})
