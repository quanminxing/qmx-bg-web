import Vue from 'vue'
import Router from 'vue-router'
import wechatBanner from '@/components/wechat/banner'
import wechatBannerEdit from '@/components/wechat/banner.edit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/wechat/banner',
      name: 'banner',
      component: wechatBanner
    }, {
      path: '/wechat/banner/edit',
      name: 'bannerEdit',
      component: wechatBannerEdit
    }
  ]
})
