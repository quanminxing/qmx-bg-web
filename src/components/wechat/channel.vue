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
      label: '频道配置',
      href: '',
      active: true
    }
  ];

  // table 数据
  let colNames = [ 'ID', '名称', '跳转链接', '链接属性', '状态', '排序', '备注' ]

  console.log('channel');


  export default {
    name: 'wechatChannel',
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
          editUrl: 'channelEdit',
          delUrl: '/api/channel/del'
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
      query('/api/channel', 'GET', { pageNum: 1, pageSize: 20 }).then((res) => {
        console.log(res);
        
      })
      .catch(err => {
        console.log(err);
        let data = []
        /* $.each(test, (index, item) => {
          data.push({
            id: item.id,
            name: item.name,
            url: item.url,
            type_id: urlProperty(item.type_id),
            is_show: isShow(item.is_show),
            weight: item.weight,
            comment: item.comment,
            origin: item
          })
        }) */
        // console.log(test);
        this.gridData.datas = data
      })
    }
  }
</script>

