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
  let colNames = [ 'ID', '名称', '跳转链接', '链接属性', '状态' ];

  // 请求数据列表函数
  const queryList = async function(vue) {
    let queryData = {
      pageNum: vue.gridData.page.pageNum,
      pageSize: vue.gridData.page.pageSize,
    }

    query('/api/banner/listAll', 'GET', queryData).then(res => {
      console.log(res);
        let data = []

        res.data.forEach(item => {
          let is_show = item.is_show === 1 ? '显示' : '不显示'
          item.oper = 'edit';
          data.push({
            id: item.id,
            url_name: item.url_name,
            url: item.url,
            type_id: urlProperty(item.type_id),
            is_show: is_show,
            origin: item
          })
        });
        vue.gridData.datas = data
    })
    .catch(err => {
      console.log(err);
      
    })
  };

  export default {
    name: 'wechatBanner',
    data() {
      return {
        pagemenu,
        stickTop: false,
        gridData: {
          pageSizeRange: [20, 30, 50, 100],
          pageTotal: 20,
          page: {
            pageSize: 20,
            pageNum: 1,
          },
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
      
      queryList(this)
    },
    watch: {
      'gridData.page': {
        handler: function() {
          queryList(this)
        },
        deep: true
      }
    }
  }
</script>

