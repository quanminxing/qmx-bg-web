<template lang="pug">
  .main-content-inner
    breadcrumbs(v-bind:breadcrumbs="pagemenu")
    .page-content.row
      .page-main.col-xs-12
        grid(v-bind='gridData')
</template>

<script>
  import breadcrumbs from '../mods/breadcrumbs.vue'
  import grid from '../mods/grid.vue'
  import { query, isShow, urlProperty } from '@/assets/js/common.js'

  // 面包屑
  let pagemenu = [
    {
      id: 1,
      label: '小程序配置',
      href: '',
    },
    {
      id: 2,
      label: 'banner配置',
      href: '',
      active: true
    }
  ];

  // table 数据
  let colNames = [ 'ID', '名称', '跳转链接', '链接属性', '状态' ]

  console.log('banner');

  // 测试数据
  let test = [
    {
      id: 15,
      img_name: null,
      img_url: "https://file.qmxpower.com/image/banner-%E4%B8%8B%E5%8D%95%E6%B5%81%E7%A8%8B.png",
      is_show: 1,
      oper: "edit",
      timestamp: "2019-04-01 12:57",
      type_id: 1,
      url: "/pages/find/flow",
      url_name: "小程序下单流程",
      work_id: null
    },
    {
      id: 14,
      img_name: null,
      img_url: "https://file.qmxpower.com/image/banner-%E4%B8%9A%E5%8A%A1%E4%BB%8B%E7%BB%8D2.png",
      is_show: 1,
      oper: "edit",
      timestamp: "2019-04-01 12:56",
      type_id: 1,
      url: "/pages/find/business",
      url_name: "小程序业务介绍",
      work_id: null
    }
  ];
  

  export default {
    name: 'wechatBanner',
    data() {
      return {
        pagemenu,
        stickTop: false,
        gridData: {
          colNames,
          datas: [],
          editUrl: 'bannerEdit',
          delUrl: '/api/banner/del'
        }
      }
    },
    components: {
      breadcrumbs,
      grid
    },
    mounted() {
      console.log(query);
      console.log(this);
      query('/api/banner/all', 'GET').then((res) => {
        console.log(res);
        
      })
      .catch(err => {
        console.log(err);
        let data = []
        $.each(test, (index, item) => {
          item.oper = 'edit';
          data.push({
            id: item.id,
            url_name: item.url_name,
            url: item.url,
            type_id: urlProperty(item.type_id),
            is_show: isShow(item.is_show),
            origin: item
          })
        })
        console.log(test);
        this.gridData.datas = data
      })

      console.log('banner mouted');
      this.$nextTick(function() {
        console.log('banner nextTick');
        
      })
    }
  }
</script>

