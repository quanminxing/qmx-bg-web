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

/*
  let grid_data = [ 
    {id:"1",name:"Desktop Computer",note:"note",stock:"Yes",ship:"FedEx", sdate:"2007-12-03"},
    {id:"2",name:"Laptop",note:"Long text ",stock:"Yes",ship:"InTime",sdate:"2007-12-03"},
    {id:"3",name:"LCD Monitor",note:"note3",stock:"Yes",ship:"TNT",sdate:"2007-12-03"},
    {id:"4",name:"Speakers",note:"note",stock:"No",ship:"ARAMEX",sdate:"2007-12-03"},
    {id:"5",name:"Laser Printer",note:"note2",stock:"Yes",ship:"FedEx",sdate:"2007-12-03"},
    {id:"6",name:"Play Station",note:"note3",stock:"No", ship:"FedEx",sdate:"2007-12-03"},
    {id:"7",name:"Mobile Telephone",note:"note",stock:"Yes",ship:"ARAMEX",sdate:"2007-12-03"},
    {id:"8",name:"Server",note:"note2",stock:"Yes",ship:"TNT",sdate:"2007-12-03"},
    {id:"9",name:"Matrix Printer",note:"note3",stock:"No", ship:"FedEx",sdate:"2007-12-03"},
    {id:"10",name:"Desktop Computer",note:"note",stock:"Yes",ship:"FedEx", sdate:"2007-12-03"},
    {id:"11",name:"Laptop",note:"Long text ",stock:"Yes",ship:"InTime",sdate:"2007-12-03"},
    {id:"12",name:"LCD Monitor",note:"note3",stock:"Yes",ship:"TNT",sdate:"2007-12-03"},
    {id:"13",name:"Speakers",note:"note",stock:"No",ship:"ARAMEX",sdate:"2007-12-03"},
    {id:"14",name:"Laser Printer",note:"note2",stock:"Yes",ship:"FedEx",sdate:"2007-12-03"},
    {id:"15",name:"Play Station",note:"note3",stock:"No", ship:"FedEx",sdate:"2007-12-03"},
    {id:"16",name:"Mobile Telephone",note:"note",stock:"Yes",ship:"ARAMEX",sdate:"2007-12-03"},
    {id:"17",name:"Server",note:"note2",stock:"Yes",ship:"TNT",sdate:"2007-12-03"},
    {id:"18",name:"Matrix Printer",note:"note3",stock:"No", ship:"FedEx",sdate:"2007-12-03"},
    {id:"19",name:"Matrix Printer",note:"note3",stock:"No", ship:"FedEx",sdate:"2007-12-03"},
    {id:"20",name:"Desktop Computer",note:"note",stock:"Yes",ship:"FedEx", sdate:"2007-12-03"},
    {id:"21",name:"Laptop",note:"Long text ",stock:"Yes",ship:"InTime",sdate:"2007-12-03"},
    {id:"22",name:"LCD Monitor",note:"note3",stock:"Yes",ship:"TNT",sdate:"2007-12-03"},
    {id:"23",name:"Speakers",note:"note",stock:"No",ship:"ARAMEX",sdate:"2007-12-03"}
  ];
  const style_delete_form = function() {
    let buttons = form.next().find('.EditButton .fm-button');
    buttons.addClass('btn btn-sm btn-white btn-round').find('[class*="-icon"]').hide();//ui-icon, s-icon
    buttons.eq(0).addClass('btn-danger').prepend('<i class="ace-icon fa fa-trash-o"></i>');
    buttons.eq(1).addClass('btn-default').prepend('<i class="ace-icon fa fa-times"></i>')
  };
  const beforeDeleteCallback = function(e) {
    let form =$(e[0]);

    if(form.data('styled')) return false;

    form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />');
    style_delete_form(form);
    form.data('styled', true);
  };
  
  jQuery(function($) {
    let $grid_selector = $("#grid-table");
    let $pager_selector = $("#grid-pager");
    
    // resize to fit page size
    $(window).on('resize.jqGrid', function () {
      $grid_selector.jqGrid( 'setGridWidth', $('.page-content').width() );
    })

    $grid_selector.jqGrid({
      data: grid_data,
      datatype: 'local',
      height: 350,
      colNames: ['ID', '名称', '跳转链接', '链接属性', '状态', '操作'],
      colModal: [
        // {
        //   name: '',
        //   index: '',
        //   width: 40,
        //   fixed: true,
        //   sortable: true,
        //   formatter: 'action',
        //   formatoptions: {
        //     keys: true,
        //     delOptions: {
        //       recreateForm: true,
        //       beforeShowForm: beforeDeleteCallback
        //     }
        //   }
        // },
        {
          name: 'id',
          index: 'id',
          width: 40,
          sorttype: 'int',

        },
        {
          name: 'url-name',
          index: 'url-name',
          width: 120,
        },
        {
          name: 'url',
          index: 'url',
          width: 150,
        },
        {
          name: 'type_id',
          index: 'type_id',
          width: 70
        },
        {
          name: 'is_show',
          index: 'is_show',
          width: 50
        },
        {
          name: 'operate',
          index: '',
          width: 60,
          fixed: true,
          sortable: true,
          formatter: 'action',
          formatoptions: {
            keys: true,
            delOptions: {
              recreateForm: true,
              beforeShowForm: beforeDeleteCallback
            }
          }
        }
      ],
      rowNum: 20,
      rowList: [10, 20, 50],
      pager: '#grid-pager',
      altRows: true,
      multiselect: true,
      multiboxonly: true,
      loadComplete() {
        // 服务器响应时执行
      }
    })

    $(window).triggerHandler('resize.jqGrid');

    // 底部按钮
    $grid_selector.jqGrid('navGrid', '#grid-pager', {
      add: true,
      addicon : 'ace-icon fa fa-plus-circle purple',
      del: true,
			delicon : 'ace-icon fa fa-trash-o red',
    }, {
      //delete record form
      recreateForm: true,
      beforeShowForm : function(e) {
        var form = $(e[0]);
        if(form.data('styled')) return false;
        
        form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
        style_delete_form(form);
        
        form.data('styled', true);
      },
      onClick : function(e) {
        //alert(1);
      }
    },)


  })
*/
  

  export default {
    name: 'bannerSetting',
    data() {
      return {
        pagemenu,
        gridData: {
          colNames,
          datas: [],
          editUrl: '/wechat/banner/edit'
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
          data.push({
            id: item.id,
            url_name: item.url_name,
            url: item.url,
            type_id: urlProperty(item.type_id),
            is_show: isShow(item.is_show)
          })
        })
        console.log(test);
        this.gridData.datas = data
      })
    }
  }
</script>

