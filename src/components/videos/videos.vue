<template lang="pug">
  .main-content-inner
    breadcrumbs(v-bind:breadcrumbs="pagemenu")
    .page-content.row
      .page-main.col-xs-12
        grid(v-bind='gridData' @search='searchList' @toTop='toTop')
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
  let colNames = [ 'ID', '线下视频库号', '名称', '类目', '平台', '栏目', '功能', '风格','分类', '价格', '小程序展示','模特', '场景', '关联视频', '时长', '比例', '备注', '置顶' ]

  let searchItems = {
    text: [
      {
        label: 'ID',
        placeholder: 'ID',
        key: 'id',
        value: '',
        type: 'number'
      },{
        label: '名称',
        placeholder: '名称',
        key: 'name',
        value: ''
      },{
        label: '价格上限',
        placeholder: '价格上限',
        key: 'max',
        value: '',
        type: 'number'
      },{
        label: '价格下限',
        placeholder: '价格下限',
        key: 'min',
        value: '',
        type: 'number'
      },{
        label: '线下视频库号',
        placeholder: '线下视频库号',
        key: 'local_id',
        value: '',
        type: 'text'
      }
    ],
    select: [
      {
        label: '类目',
        name: 'category',
        key: 'category_id',
        value: -1,
        options: []
      },{
        label: '平台',
        name: 'platform',
        key: 'platform_id',
        value: -1,
        options: []
      },{
        label: '分类',
        name: 'classify',
        key: 'classify_id',
        value: -1,
        options: []
      },{
        label: '功能',
        name: 'usage',
        key: 'usage_id',
        value: -1,
        options: []
      },{
        label: '栏目',
        name: 'column',
        key: 'column_id',
        value: -1,
        options: []
      },
      {
        label: '模特',
        name: 'model',
        key: 'is_model',
        value: -1,
        options: [
          {
            id: 1,
            name: '有'
          },
          {
            id: 0,
            name: '无'
          }
        ]
      },
      {
        label: '场景',
        name: 'sence',
        key: 'sence',
        value: -1,
        options: [
          {
            id: '室内',
            name: '室内'
          },
          {
            id: '室外',
            name: '室外'
          },
          {
            id: '棚拍',
            name: '棚拍'
          }
        ]
      },
      {
        label: '关联视频',
        name: 'related',
        key: 'related_id',
        value: -1,
        options: []
      }
    ]
  }
  
  let searchData = {
    _search: false
  };
  // 请求数据列表函数
  let queryList = async function(vue, searchData) {
    
    let queryData = {
      pageNum: vue.gridData.page.pageNum,
      pageSize: vue.gridData.page.pageSize,
    }

    if(searchData._search) {
      let min = '';
      let max = '';
      console.log(searchData)
      for(let key in searchData) {
        if(key === 'min') {
          min = searchData[key]
        } else if(key === 'max') {
          max = searchData[key]
        } else {
          queryData[key] = searchData[key]
        }
      }
      if((min !== '') || (max !== '')) {
        queryData.price = `${min},${max}`
      }
      
      console.log(queryData.price);
      
      
    }

    console.log(queryData);
    

    query('/api/video/listAll', 'GET', queryData).then((res) => {
      console.log(res.data);
      let datas = [];
      let resData = res.data;
      console.log(res.total)
      resData.forEach(item => {
        item.oper = 'edit';
        datas.push({
          id: item.id || item.video_id,
          local_id: item.local_id || '——',
          name: item.name,
          category_id: item.categroy_name || '',
          platform_id: item.platform_name || '',
          column_id: item.column_name || '',
          usage_id: item.usage_name || '',
          style_id: item.style_name || '',
          classify_id: item.classify_name || '',
          price: item.price || '',
          is_wechat: item.is_wechat === 1 ? '显示' : '不显示',
          is_model: item.is_model ? '有' : '无',
          sence: item.sence || '其他',
          related_id: item.related_id ? item.related_id + ' - ' + item.related_name : '——',
          time: item.time,
          scale_id: item.scale_id || '',
          description: item.description || '',
          is_top: item.is_top,
          origin: item
        })
      });
      vue.gridData.datas = datas;
      vue.gridData.datas.uv = resData.uv
      vue.gridData.pageTotal = res.total || 1;
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

      // 请求列表数据
      queryList(this,searchData).catch(err => {
        console.log(err);
        
      })

      // 搜索数据
      query('/api/info/operateVideo' , 'GET').then(res => {
        console.log(res.data);
        
        let selecItems = this.gridData.searchItems.select;
        selecItems.forEach(item => {
          let optionData = res.data[item.name]
          if(!!optionData && optionData.length > 0) {
            item.options = optionData
          }
          
        })
      }).catch(err => {
        console.log(err)
      })

      // 搜索关联视频数据
      query('/api/video/listAll', 'GET', {_search: true, classify_id: 2, pageSize: 1000, sidx: 'id', sord: 'desc'}).then(res => {
        console.log('关联视频：标准模板客片')
        let searchSelect = this.gridData.searchItems.select;
        console.log(searchSelect)
        searchSelect.forEach(item => {
          if(item.key === 'related_id') {
            let datas = res.data
            let options = []
            datas.forEach(data => {
              options.push({
                id: data.id,
                name: data.id + '—' + data.name
              })
            })
            item.options = options
          }
        })
      }).catch(err => {
        console.log(err)
        console.log('获取关联视频出错')
      })
    },
    methods: {
      searchList() {
        console.log(this);
        searchData = {
          _search: true
        };
        
        let searchItems = this.gridData.searchItems;
        
        for(let type in searchItems) {
          let thisType = searchItems[type];
          thisType.forEach(item => {
            if(item.value !== -1 && item.value !== null && item.value !== undefined && item.value !== '') {
              if(item.key === 'is_model') {
                searchData.model = item.value ? true : false
              } else {
                searchData[item.key] = item.value;
              }
            }
            
          })
        }
        this.gridData.page.pageNum = 1
        console.log(searchData);
        queryList(this, searchData)
      },
      toTop(queryData) {
        console.log(queryData)
        query('/api/video/top', 'POST', queryData).then(res => {
          console.log('置顶成功')
          console.log(res)
          queryList(this, searchData)
        }).catch(err => {
          console.log('置顶失败')
          console.log(err)
        })
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
<style>
.modal-backdrop {
  display: none;
}
.modal {
  z-index: 9999 !important;
}
.modal-dialog {
  margin: 70px auto;
}
</style>

