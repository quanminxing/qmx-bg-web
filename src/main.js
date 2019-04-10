// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

console.log('mainjs');
console.log($('#sidebar'));


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  mounted() {
    console.log($('.grid'))
    this.$nextTick(function () {
      $('body').append('<script src="/static/ace/js/ace-elements.min.js"></script><script src="/static/ace/js/ace.min.js"></script><script src="/static/ace/js/jquery.dataTables.min.js"></script><script src="/static/ace/js/jquery.dataTables.bootstrap.min.js"></script>')
    })
  },
})


