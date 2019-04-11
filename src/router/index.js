import Vue from 'vue'
import Router from 'vue-router'
import wechatBanner from '@/components/wechat/banner'
import wechatBannerEdit from '@/components/wechat/banner.edit'
import wechatChannel from '@/components/wechat/channel'
import wechatChannelEdit from '@/components/wechat/channel.edit'
import wechatPrices from '@/components/wechat/prices'
import wechatPricesEdit from '@/components/wechat/prices.edit'

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
    }, {
      path: '/wechat/channel',
      name: 'channel',
      component: wechatChannel
    }, {
      path: '/wechat/channel/edit',
      name: 'channelEdit',
      component: wechatChannelEdit
    }, {
      path: '/wechat/prices',
      name: 'prices',
      component: wechatPrices
    }, {
      path: '/wechat/prices/edit',
      name: 'pricesEdit',
      component: wechatPricesEdit
    }
  ]
})
