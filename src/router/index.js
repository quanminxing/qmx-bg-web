import Vue from 'vue'
import Router from 'vue-router'
import navbar from '@/components/mods/navbar'
import sidebar from '@/components/mods/sidebar'
import aceSetting from '@/components/mods/ace-setting'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'layout',
      components: {
        navbar,
        sidebar,
        aceSetting
      } 
    }
  ]
})
