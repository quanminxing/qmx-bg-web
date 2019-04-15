<template lang="pug">
  .main-content-inner
    breadcrumbs(v-bind:breadcrumbs="pagemenu")
    .page-content.row
      .page-main.col-xs-12
        grid(v-bind='gridData' @choosePagesize='choosePagesize' @search='searchList')
</template>

<script>
  import breadcrumbs from '../mods/breadcrumbs.vue'
  import grid from '../mods/grid.vue'
  import { query, codeTransform } from '@/assets/js/common.js'

  // 面包屑
  let pagemenu = [
    {
      id: 1,
      label: '视频管理',
      href: '',
      active: true
    }
  ];

  // table 数据
  let colNames = [ 'ID', '类目', '平台', '栏目', '功能', '风格','分类', '价格', '小程序展示', '播放量', '时长', '比例', '备注' ]

  let searchItems = {
    text: [
      {
        label: 'ID',
        placeholder: 'ID',
        key: 'id',
        value: ''
      },{
        label: '名称',
        placeholder: '名称',
        key: 'name',
        value: ''
      },{
        label: '价格上限',
        placeholder: '价格上限',
        key: 'max',
        value: ''
      },{
        label: '价格下限',
        placeholder: '价格下限',
        key: 'min',
        value: ''
      }
    ],
    select: [
      {
        label: '类目',
        name: 'category_id',
        value: -1,
        options: codeTransform('category')
      },{
        label: '平台',
        name: 'platform_id',
        value: -1,
        options: codeTransform('platform')
      },{
        label: '分类',
        name: 'classify_id',
        value: -1,
        options: codeTransform('classify')
      },{
        label: '功能',
        name: 'usage_id',
        value: -1,
        options: codeTransform('usage')
      },{
        label: '栏目',
        name: 'column_id',
        value: -1,
        options: codeTransform('column')
      }
    ]
  }

  // 测试数据
  let test = [
    {
      id: 1,
      name: '视频名称',
      category_id: '1',
      platform_id: '1',
      column_id: '1',
      time: '03:00',
      scale_id: '1',
      usage_id: '2',
      style_id: '3',
      price: '1200',
      classify_id: '3',
      is_wechat: 'true',
      format: 'MP4',
      brand: '品牌1',
      business: '商家1',
      demo_description: '样片说明',
      description: '备注',
      keystring: '颗粒度哒哒哒哒哒哒多多多多多多多多多',
      url: 'http://www.dddl.mp4',
      demo_pic: '详情图：img_url1,video_id1|img2_url2,video_id2|...',
      short_image: '',
      waterfall_image: '瀑布流封面'
    },
    {
      id: 3,
      name: '视频名称',
      category_id: '2',
      platform_id: '4',
      column_id: '3',
      time: '03:00',
      scale_id: '4',
      usage_id: '2',
      style_id: '3',
      price: '1200',
      classify_id: '3',
      is_wechat: 'true',
      format: 'MP4',
      brand: '品牌1',
      business: '商家1',
      demo_description: '样片说明',
      description: '备注',
      keystring: '颗粒度哒哒哒哒哒哒多多多多多多多多多',
      url: 'http://www.dddl.mp4',
      demo_pic: '详情图：img_url1,video_id1|img2_url2,video_id2|...',
      short_image: '视频缩略图',
      waterfall_image: '瀑布流封面'
    }
  ];

  
  

  let queryList = async function(vue, searchData) {
    // console.log(this);
    let queryData = {
      pageNum: vue.gridData.pageNum,
      pageSize: vue.gridData.pageSize,
      
    }
    query('/api/video/listAll', 'GET', queryData).then(res => {

    }).catch(err => {

    })
  }

  

  export default {
    name: 'videos',
    data() {
      return {
        pagemenu,
        gridData: {
          pageSize: 20,
          pageNum: 1,
          colNames,
          stickTop: true,
          datas: [],
          editUrl: 'videosEdit',
          delUrl: '/api/video/del',
          searchItems
        }
      }
    },
    components: {
      breadcrumbs,
      grid
    },
    mounted() {
      queryList()
      // 视频相关信息
      query('/api/video/listAll', 'GET', { pageNum: 1, pageSize: this.gridData.pageSize }).then((res) => {
        console.log(res);
        
      })
      .catch(err => {
        console.log(err);
        let data = []
        $.each(test, (index, item) => {
          data.push({
            id: item.id,
            name: item.name,
            category_id: codeTransform('category',item.category_id),
            platform_id: codeTransform('platform',item.platform_id),
            column_id: codeTransform('column', item.column_id),
            usage_id: codeTransform('usage', item.usage_id),
            style_id: codeTransform('style', item.style_id),
            classify_id: codeTransform('classify', item.classify_id),
            price: item.price,
            is_wechat: codeTransform('displayState', item.is_wechat),
            time: item.time,
            scale_id: codeTransform('scale', item.scale_id),
            // type_id: urlProperty(item.type_id),
            // is_show: isShow(item.is_show),
            comment: item.description,
            origin: item
          })
        })
        console.log(test);
        this.gridData.datas = data
      })
    },
    methods: {
      choosePagesize(pagesize) {
        this.pageSize = pagesize;
      },
      searchList() {
        query()
      }
    }
  }
</script>

