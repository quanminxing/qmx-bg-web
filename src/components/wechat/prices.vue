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
      label: '价格配置',
      href: '',
      active: true
    }
  ];

  // table 数据
  let colNames = [ 'ID', '名称', '价格上限', '价格下限', '状态', '排序' ]

  console.log('price');

  // 请求数据列表函数
  const queryList = async function(vue) {
    let queryData = {
      pageNum: vue.gridData.page.pageNum,
      pageSize: vue.gridData.page.pageSize,
    }

    query('/api/priceRange', 'GET', queryData).then(res => {
      res.data.forEach(item => {
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
      });
      vue.gridData.datas = data
    })
    .catch(err => {
      console.log(err);
      
    })
  } 
  

  export default {
    name: 'wechatBanner',
    data() {
      return {
        pagemenu,
        gridData: {
          pageSizeRange: [20, 30, 50, 100],
          pageTotal: 20,
          page: {
            pageSize: 20,
            pageNum: 1,
          },
          colNames,
          stickTop: false,
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
      
      queryList(this)
    }
  }
</script>

