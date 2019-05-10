<template lang="pug">
  .main-content-inner
    breadcrumbs(v-bind:breadcrumbs='pagemenu')
    .page-content.row
      .page-main.col-xs-12
        .grid
          .grid-header.align-right
            .btn-group
              button.btn.btn-white.btn-info.margin-lr5#search-btn(@click='search') 搜索 
                i.ace-icon.fa.fa-search.bigger-120.blue
          .grid-content
            table.table.table-bordered.table-hover#simple-table(v-for='(order, orderIndex) in orders' :key='order.id')
              tbody
                tr.bgc-d5e3ef
                  td.align-middle(colspan='9')
                    .col-xs-3 订单编号：{{order.id}}
                    .col-xs-3 下单时间：{{order.order_time}}
                    .col-xs-3 退款完成时间：{{order.refund_time}}
                    .col-xs-3.align-right 交易状态：{{order.trade_status}}
                tr.bgc-dceefc
                  th.center.align-middle(v-for='(colName, index) in colNames' :key='index + "order"') {{colName}}
                tr.center
                  td.align-middle
                    p {{order.name}}
                    p {{order.business}}
                  td.align-middle
                    p {{order.phone}}
                    p {{order.email}}
                  td.align-middle
                    p {{order.video_id}}
                    p {{order.video_name}}
                  td.align-middle
                    p ￥{{order.price}}
                      span.blue.padding.pointer(v-if='order.pay_status === "代付款"')
                        i.ace-icon.fa.fa-pencil.bigger-120
                  td.align-middle
                    p {{order.pay_status}}
                  td.align-middle
                    p {{order.refund_price}}
                  td.align-middle
                    p
                      span.padding {{order.work_id}}
                      span.padding {{order.worker_name}}
                      span.blue.padding.pointer
                        i.ace-icon.fa.fa-pencil.bigger-120
                  td.align-middle
                    p {{order.trade_status}}
                      span.blue.padding.pointer
                        i.ace-icon.fa.fa-pencil.bigger-120
                  td.align-middle
                    router-link(:to='{name: "orderEdit"}') 查看详情
                    


</template>

<script>
  import breadcrumbs from '../mods/breadcrumbs.vue';
  import { query, codeTransform } from '@/assets/js/common.js';

  let pagemenu = [
    {
      id: 1,
      label: '订单管理',
      href: '',
      active: true
    }
  ]

  export default {
    name: 'order',
    data() {
      return {
        pagemenu,
        colNames: ['买家信息','联系方式','关联视频','订单价格','付款状态','退款金额','跟进销售','交易状态','操作'],
        orders: [
          {"id":466,"name":"周星","work_id":15,"price":"618","status":0,"business":"商家","scale":null,"channel":null,"timestamp":"2019-05-10 15:52","phone":"18667044623","category_id":77,"platform_id":31,"column_id":36,"video_id":642,"comment":"三条","email":"sam@aitenw.com","video_name":"综合展示","video_url":"https://file.qmxpower.com/video/Fri%20Apr%2019%202019%2020%3A19%3A13%20GMT%2B0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)%E7%BB%BC%E5%90%88%E5%B1%95%E7%A4%BA%E7%B1%BB%E8%A7%86%E9%A2%91.mp4","video_short_image":"https://file.qmxpower.com/image/Fri%20Apr%2019%202019%2020%3A22%3A26%20GMT%2B0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)%E5%B0%81%E9%9D%A2","video_time":"00:30","worker_name":"汪涛","worker_id":15},{"id":465,"name":"程光辉","work_id":19,"price":"318","status":0,"business":"杭州北鼻象商贸有限公司","scale":null,"channel":null,"timestamp":"2019-05-10 11:46","phone":"13738010360","category_id":76,"platform_id":31,"column_id":36,"video_id":636,"comment":"","email":"13738010360@163.com","video_name":"外观展示","video_url":"https://file.qmxpower.com/video/Fri%20Apr%2019%202019%2019%3A22%3A31%20GMT%2B0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)%E5%A4%96%E8%A7%82%E5%B1%95%E7%A4%BA%E7%B1%BB%E8%A7%86%E9%A2%91.mp4","video_short_image":"https://file.qmxpower.com/image/Fri%20Apr%2019%202019%2019%3A21%3A11%20GMT%2B0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)%E5%B0%81%E9%9D%A2.jpg","video_time":"00:30","worker_name":"陈婷婷","worker_id":19},{"id":464,"name":"程光辉","work_id":19,"price":"318","status":0,"business":"杭州北鼻象商贸有限公司","scale":null,"channel":null,"timestamp":"2019-05-10 11:43","phone":"13738010360","category_id":76,"platform_id":31,"column_id":36,"video_id":636,"comment":"","email":"13738010360@163.com","video_name":"外观展示","video_url":"https://file.qmxpower.com/video/Fri%20Apr%2019%202019%2019%3A22%3A31%20GMT%2B0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)%E5%A4%96%E8%A7%82%E5%B1%95%E7%A4%BA%E7%B1%BB%E8%A7%86%E9%A2%91.mp4","video_short_image":"https://file.qmxpower.com/image/Fri%20Apr%2019%202019%2019%3A21%3A11%20GMT%2B0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)%E5%B0%81%E9%9D%A2.jpg","video_time":"00:30","worker_name":"陈婷婷","worker_id":19},{"id":463,"name":"艺宣","work_id":16,"price":"518","status":0,"business":"汇网","scale":null,"channel":null,"timestamp":"2019-05-09 11:16","phone":"13567189550","category_id":96,"platform_id":31,"column_id":36,"video_id":639,"comment":"待样品完善","email":"1127381613@qq.com","video_name":"场景展示","video_url":"https://file.qmxpower.com/video/Fri%20Apr%2019%202019%2019%3A55%3A14%20GMT%2B0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)%E5%9C%BA%E6%99%AF%E6%BC%94%E7%BB%8E%E7%B1%BB%E8%A7%86%E9%A2%91.mp4","video_short_image":"https://file.qmxpower.com/image/Fri%20Apr%2019%202019%2019%3A53%3A18%20GMT%2B0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)%E5%B0%81%E9%9D%A2.jpg","video_time":"00:30","worker_name":"李超","worker_id":16},{"id":462,"name":"艺宣","work_id":16,"price":"318","status":0,"business":"汇网","scale":null,"channel":null,"timestamp":"2019-05-09 11:14","phone":"13567189550","category_id":77,"platform_id":31,"column_id":36,"video_id":633,"comment":"产品还未全部到齐，待收集齐开拍","email":"1127381613@qq.com","video_name":"外观展示","video_url":"https://file.qmxpower.com/video/Fri%20Apr%2019%202019%2019%3A12%3A48%20GMT%2B0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)%E5%A4%96%E8%A7%82%E5%B1%95%E7%A4%BA%E7%B1%BB%E8%A7%86%E9%A2%91.mp4","video_short_image":"https://file.qmxpower.com/image/Fri%20Apr%2019%202019%2019%3A14%3A18%20GMT%2B0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)%E5%B0%81%E9%9D%A2.jpg","video_time":"00:30","worker_name":"李超","worker_id":16},{"id":461,"name":"测试使用","work_id":20,"price":"","status":0,"business":"测试","scale":null,"channel":null,"timestamp":"2019-05-08 18:43","phone":"13253314257","category_id":0,"platform_id":0,"column_id":0,"video_id":0,"comment":"","email":"13253314257@163.com","video_name":null,"video_url":null,"video_short_image":null,"video_time":null,"worker_name":"卢先锋","worker_id":20},{"id":460,"name":"测试使用","work_id":21,"price":"618","status":0,"business":"测试","scale":null,"channel":null,"timestamp":"2019-05-08 18:40","phone":"13253314257","category_id":74,"platform_id":31,"column_id":36,"video_id":643,"comment":"","email":"13253314257@163.com","video_name":"综合展示","video_url":"https://file.qmxpower.com/video/Fri%20Apr%2019%202019%2020%3A25%3A17%20GMT%2B0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)%E7%BB%BC%E5%90%88%E5%B1%95%E7%A4%BA%E7%B1%BB%E8%A7%86%E9%A2%91.mp4","video_short_image":"https://file.qmxpower.com/image/Fri%20Apr%2019%202019%2020%3A27%3A54%20GMT%2B0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)%E5%B0%81%E9%9D%A2","video_time":"00:30","worker_name":"徐珍珍","worker_id":21},{"id":459,"name":"测试下单","work_id":0,"price":"768","status":0,"business":"测试","scale":null,"channel":null,"timestamp":"2019-05-08 18:39","phone":"13640972721","category_id":74,"platform_id":31,"column_id":36,"video_id":648,"comment":"","email":"123@qq.com","video_name":"演员表演","video_url":"https://file.qmxpower.com/video/Fri%20Apr%2019%202019%2020%3A46%3A50%20GMT%2B0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)%E6%A8%A1%E7%89%B9%E8%A1%A8%E6%BC%94%E7%B1%BB%E8%A7%86%E9%A2%91.mp4","video_short_image":"https://file.qmxpower.com/image/Fri%20Apr%2019%202019%2020%3A45%3A36%20GMT%2B0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)%E5%B0%81%E9%9D%A2","video_time":"00:30","worker_name":null,"worker_id":null},{"id":458,"name":"李松","work_id":8,"price":"768","status":0,"business":"商家","scale":null,"channel":null,"timestamp":"2019-05-08 18:29","phone":"13640972721","category_id":77,"platform_id":31,"column_id":36,"video_id":634,"comment":"","email":"abc@123.com","video_name":"演员表演","video_url":"https://file.qmxpower.com/video/Fri%20Apr%2019%202019%2019%3A34%3A54%20GMT%2B0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)%E6%BC%94%E5%91%98%E8%A1%A8%E6%BC%94%E7%B1%BB%E8%A7%86%E9%A2%91.mp4","video_short_image":"https://file.qmxpower.com/image/Fri%20Apr%2019%202019%2019%3A15%3A50%20GMT%2B0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)%E5%B0%81%E9%9D%A2.jpg","video_time":"0:30","worker_name":"admin111","worker_id":8},{"id":457,"name":"测试使用","work_id":15,"price":"768","status":0,"business":"测试","scale":null,"channel":null,"timestamp":"2019-05-08 16:27","phone":"13253314257","category_id":74,"platform_id":31,"column_id":36,"video_id":615,"comment":"","email":"13253314257@163.com","video_name":"Dior粉底液","video_url":"https://file.qmxpower.com/video/1556272516000MZ-TB-TT-17%E7%B2%89%E5%BA%95%E6%B6%B2.mp4","video_short_image":"https://file.qmxpower.com/image/1556272498000MZ-TB-TT-17%E7%B2%89%E5%BA%95%E6%B6%B2.jpg","video_time":"00:30","worker_name":"汪涛","worker_id":15}
        ]
      }
    },
    components: {
      breadcrumbs
    },
    methods: {
      // 搜索
      search() {},
    },
    mounted() {},
  }
</script>

<style>
  .padding {
    padding: 0 5px;
  }
  .bgc-d5e3ef {
    background-color: #f5f5f5;
  }
  .bgc-dceefc {
    background-color: #dceefc;
  }
  .pointer {
    cursor: pointer;
  }

  .grid-header {
    padding: 0 0 15px 0;
  }
</style>
