<template lang="pug">
  .main-content-inner
    breadcrumbs(v-bind:breadcrumbs="pagemenu")
    .page-content.row
      .page-main.col-xs-12
        grid(v-bind='gridData' @search='searchList')
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
  let colNames = [ 'ID', '名称', '类目', '平台', '栏目', '功能', '风格','分类', '价格', '小程序展示', '播放量', '时长', '比例', '备注' ]

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
        key: 'category_id',
        value: -1,
        options: codeTransform('category')
      },{
        label: '平台',
        key: 'platform_id',
        value: -1,
        options: codeTransform('platform')
      },{
        label: '分类',
        key: 'classify_id',
        value: -1,
        options: codeTransform('classify')
      },{
        label: '功能',
        key: 'usage_id',
        value: -1,
        options: codeTransform('usage')
      },{
        label: '栏目',
        key: 'column_id',
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
  
  let searchData = {
    _search: false
  };
  let queryList = async function(vue, searchData) {
    // console.log(this);
    let queryData = {
      pageNum: vue.gridData.page.pageNum,
      pageSize: vue.gridData.page.pageSize,
    }

    if(searchData._search) {
      for(let key in searchData) {
        queryData[key] = searchData[key]
      }
    }

    query('/api/video/listAll', 'GET', queryData).then((res) => {
      console.log(res.data);
      let datas = [];
      
      res.data.forEach(item => {
        datas.push({
          id: item.id,
          name: item.name,
          category_id: item.category_name || '',
          platform_id: item.platform_name || '',
          column_id: item.column_name || '',
          usage_id: item.usage_name || '',
          style_id: item.style_name || '',
          classify_id: item.classify_name || '',
          price: item.price || '',
          is_show: codeTransform('displayState', item.is_show) || '不显示',
          work_id: item.work_id || 0,
          time: item.time,
          scale_id: item.scale_id || '',
          description: item.description || '',
          origin: item
        })
      });
      vue.gridData.datas = datas;
      vue.gridData.pageTotal = res.total;
    })
    .catch(err => {
      console.log(err);
      vue.$emit('toast', '网络异常，请刷新重试')
    })
  }

  

  export default {
    name: 'videos',
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
      queryList(this,searchData)
      // 视频相关信息
      
    },
    methods: {
      searchList() {
        console.log(this);
        searchData._search = true;
        
        let searchItems = this.gridData.searchItems;
        
        for(let type in searchItems) {
          let thisType = searchItems[type];
          thisType.forEach(item => {
            if(item.value === -1) {
              searchData[item.key] = null;
            } else {
              searchData[item.key] = item.value;
            }
            
          })
        }
        console.log(searchData);
        queryList(this, searchData)
      }
    },
    watch: {
      'gridData.page': {
        handler: function() {
          queryList(this, searchData)
        },
        deep: true
      }
    }
  }
</script>

