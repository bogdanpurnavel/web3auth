module.exports = {
  publicPath:'/',
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
  transpileDependencies: [
    'quasar',
  ],
  devServer: {
    disableHostCheck: true,
    port: 9898,
    public: '0.0.0.0:8080'
  }
}
