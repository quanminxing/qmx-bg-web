<template lang="pug">
  .main-content.vh.position-relative
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
      label: '价格配置',
      href: '',
      active: true
    }
  ];

  // table 数据
  let colNames = [ 'ID', '名称', '价格上限', '价格下限', '状态', '排序' ]

  console.log('price');

  // 测试数据
  let test = [
    {
      id: 15,
      name: null,
      max: null,
      min: null,
      is_show: 1,
      oper: "edit",
      timestamp: "2019-04-01 12:57",
      weight: 1,
      channel_ids: [],
      comment: ''
    },
    {
      id: 14,
      name: 'null',
      max: null,
      min: null,
      is_show: 1,
      oper: "edit",
      timestamp: "2019-04-01 12:56",
      weight: 1,
      channel_ids: [1,3],
      comment: "小程序业务介绍"
    }
  ];
  

  export default {
    name: 'wechatBanner',
    data() {
      return {
        pagemenu,
        gridData: {
          colNames,
          datas: [],
          editUrl: 'pricesEdit',
          delUrl: '/api/priceRange/del'
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
      query('/api/priceRange', 'GET', {pageNum: 1, pageSize: 20}).then((res) => {
        console.log(res);
        
      })
      .catch(err => {
        console.log(err);
        let data = []
        $.each(test, (index, item) => {
          item.oper = 'edit';
          data.push({
            id: item.id,
            name: item.name,
            max: item.max,
            min: item.min,
            is_show: isShow(item.is_show),
            weight: item.weight,
            origin: item
          })
        })
        console.log(test);
        this.gridData.datas = data
      })
    }
  }
</script>

