import Vue from 'vue'
import Router from 'vue-router'
import bannerSetting from '@/components/bannerSetting'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/banner/setting',
      name: 'bannerSetting',
      component: bannerSetting
    }, {
      path: '/banner/edit',
      name: 'bannerEdit',
    }
  ]
})
