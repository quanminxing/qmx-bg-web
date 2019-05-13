<template lang="pug">
  .main-content-inner
    breadcrumbs(v-bind:breadcrumbs='pagemenu')
    .page-content.row
      .page-main.col-xs-12
        .grid
          .grid-header.align-right
            .btn-group
              button.btn.btn-white.btn-info.margin-lr5#search-btn(@click='showSearch') 搜索 
                i.ace-icon.fa.fa-search.bigger-120.blue
          .grid-content
            table.table.table-bordered.table-hover#simple-table(v-for='(order, orderIndex) in orders' :key='order.id')
              tbody
                tr.bgc-d5e3ef
                  td.align-middle(colspan='9')
                    .col-xs-3 订单编号：{{order.id}}
                    .col-xs-3 下单时间：{{order.order_time}}
                    .col-xs-3 退款完成时间：{{order.refund_time || '——'}}
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
                      span.blue.padding.pointer(v-if='order.pay_status === "待付款"')
                        i.ace-icon.fa.fa-pencil.bigger-120
                  td.align-middle
                    p {{order.pay_status}}
                  td.align-middle
                    p {{order.refund_price || '——'}}
                  td.align-middle
                    p
                      span.padding {{order.work_id}}
                      span.padding {{order.worker_name}}
                      span.blue.padding.pointer
                        i.ace-icon.fa.fa-pencil.bigger-120
                  td.align-middle
                    p {{order.trade_status}}
                      span.blue.padding.pointer(v-if='order.trade_status !== "交易完成"')
                        i.ace-icon.fa.fa-pencil.bigger-120
                  td.align-middle
                    router-link(:to='{name: "orderEdit"}') 查看详情
                tr
                  td.align-middle(colspan='3') 买家留言：{{order.comment}}
                  td.align-middle(colspan='6') 销售备注：{{order.work_comment}}
                    span.blue.padding.pointer
                      i.ace-icon.fa.fa-pencil.bigger-120
          .grid-footer
            ul.pager
              li.pointer(:class='{disabled: page.pageNum <= 1}')
                a(@click='prevPage')
                  i.ace-icon.fa.fa-angle-double-left
              li.space 第 {{page.pageNum}} 页
              li.space 共 {{Math.ceil(pageTotal / page.pageSize)}} 页
              li(:class='{disabled: page.pageNum >= Math.ceil(pageTotal / page.pageSize)}')
                a.pointer(@click='nextPage')
                  i.ace-icon.fa.fa-angle-double-right
        .modal(@click.self='hideModal' style='display:block;')
          .search-wrap.modal-wrap(v-if='modal.modalType === "search"')
            .row.search-header
              p 搜索
            .row.search-content
              .search-item.search-text.col-sm-6.col-xs-12(v-if='searchItems.text' v-for='(textItem, textIndex) in searchItems.text' :key='textItem.label + "searchText"')
                label {{textItem.label}}:
                input(:type='textItem.type || "text"' v-model='textItem.value')
              .search-item.col-xs-12.order-time
                label 下单时间：
                input(type='datetime-local', name='order-time-start' v-model='searchItems.order_time.start')
                span.padding  — — 
                input(type='datetime-local', name='order-time-end' v-model='searchItems.order_time.end')
              .search-item.search-select.col-sm-6.col-xs-12(v-if='searchItems.select' v-for='(selectItem, selectIndex) in searchItems.select' :key='selectItem.label + "searchSelect"')
                label {{selectItem.label}}:
                select(v-model='selectItem.value')
                  option.hide(value='') --请选择--
                  option(v-for='(option, optionIndex) in selectItem.options' :key='optionIndex + "searchSelectOption"' :value='option.value || option') {{option.value ? option.value + " " + option.key : option}}
            .row.search-footer.align-right
              button(type='reset').btn.btn-info.btn-sm.float-l 重置
              button.btn.btn-default.btn-sm(@click='hideModal') 取消
              button.btn.btn-success.btn-sm(@click='search') 确定
          .revise-wrap.modal-wrap(v-if='modal.modalType !== "search"')
            .revise-cancel.close(@click='hideModal')
              i.ace-icon.fa.fa-times
            .revise-work-commnet.revise-content(v-if='modal.modalType === "workComment"')
              h3.title.align-center {{modal.workComment.title}}
              .content
                .margin 订单编号：{{modal.workComment.id}}
                .margin.align-center
                  textarea(v-model='modal.workComment.work_comment' style='width: 100%;  max-width: 100%; height: 200px')
            .revise-price.revise-content(v-if='modal.modalType === "price"')
              h3.title.align-center {{modal.price.title}}
              .content
                .margin 订单编号：{{modal.price.id}}
                .margin 订单价格： ￥{{modal.price.oldPrice}}
                .margin
                  label 修改后价格： ￥
                  input(type='number' min='0')
                .margin.tips(v-if='modal.tradeStatus.tips') {{modal.price.tips}}
            .revise-worker.revise-content(v-if='modal.modalType === "worker"')
              h3.title.align-center {{modal.worker.title}}
              .content
                .margin 订单编号：{{modal.worker.id}}
                .margin 跟进销售：{{modal.worker.oldWorker.work_id}} {{modal.worker.oldWorker.worker_name}}
                .margin
                  label 修改后销售：
                  select(v-model='modal.worker.work_id')
                    option(v-for='(workerOption, workerIndex) in searchItems.select[2].options' :key='workerOption.value + "reviseWorker"' :value='workerOption.value') {{workerOption.value + " " + workerOption.key}}
                .margin.tips(v-if='modal.price.tips') 操作失败：{{modal.price.tips}}
            .revise-trade-status.revise-content(v-if='modal.modalType === "tradeStatus"')
              h3.title.align-center {{modal.tradeStatus.title}}
              .content
                .margin 订单编号：{{modal.tradeStatus.id}}
                .margin 交易状态：{{modal.tradeStatus.old_trade_status}}
                .margin 
                  label 修改后交易状态：
                  select(v-model='modal.tradeStatus.trade_status')
                    option(v-for='(statusOption, statusIndex) in searchItems.select[0].options' :key='statusOption + "reviseStatus"' :value='statusOption') {{statusOption}}
                div(v-if='modal.tradeStatus.trade_status === "退款完成"')
                  .margin 订单金额： ￥{{modal.tradeStatus.price}}
                  .margin
                    label 退款金额： ￥
                    input(type='number' min='0' v-model='modal.tradeStatus.refund_price')
                  .margin.tip 注意：完成退款后，订单信息将无法再修改，请仔细确认清楚后再提交！
                .margin.tips(v-if='modal.tradeStatus.tips') 操作失败：{{modal.tradeStatus.tips}}
            .revise-btns.align-center
              button.btn.btn-success.btn-sm(@click='revise(modal.modalType)') 提交
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
        ],
        modal: {
          modalType: 'tradeStatus',
          workComment: {
            title: '',
            id: '',
            work_comment: ''
          },
          price: {
            title: '',
            id: '',
            oldPrice: '',
            price: '',
            tips: 'lllllll哒哒哒哒哒哒多多多多多多多多多多多多多多多'
          },
          worker: {
            title: '',
            id: '',
            oldWorker: {
              work_id: '',
              worker_name: ''
            },
            work_id: ''
          },
          tradeStatus: {
            title: '',
            id: '',
            old_trade_status: '',
            trade_status: '',
            price: '',
            refund_price: '',
            tips: ''
          }
        },
        searchItems: {
          text: [
            {
              label: '订单ID',
              placeholder: 'id',
              key: 'id',
              value: '',
              type: ''
            },{
              label: '联系电话',
              placeholder: '联系电话',
              key: 'phone',
              value: '',
              type: 'text'
            },{
              label: '联系人',
              placeholder: '联系人姓名',
              key: 'name',
              value: '',
              type: 'text'
            },{
              label: '商家名称',
              placeholder: '商家名称',
              key: 'business',
              value: '',
              type: 'text'
            }
          ],
          select: [
            {
              label: '交易状态',
              name: '',
              key: 'trade_status',
              value: '',
              options: ['进行中', '待付款', '待确认', '待寄送', '交易成功', '退款中', '退款完成', '交易关闭']
            },{
              label: '支付状态',
              name: '',
              key: 'pay_status',
              value: '',
              options: ['未付款', '已付款']
            },{
              label: '跟进销售',
              name: '',
              key: 'datetime-local',
              value: '',
              options: []
            }
          ],
          order_time: {
            start: '',
            end: ''
          }
        },
        pageTotal: 20,
        page: {
          pageSize: 20,
          pageNum: 1,
        }
      }
    },
    components: {
      breadcrumbs
    },
    methods: {
      // 搜索
      search() {},
      // 显示搜索
      showSearch() {
        this.modal.modalType = 'search'
        $('.modal').show();
      },
      // 隐藏 modal：取消搜索等
      hideModal() {
        $('.modal').hide()
      },
      // 搜索
      search() {

      },
      // 修改
      revise(type) {
        console.log('tradeStatustradeStatustradeStatustradeStatustradeStatus')
        console.log(type)
      },

    },
    mounted() {
      // 获取跟进销售
      query('/api/info/worker').then(res => {
        console.log('跟进销售')
        this.searchItems.select[2].options = res.data.map(item => {
          return {
            key: item.cname,
            value: item.id
          }
        })
      }).catch(err => {

      })
    },
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
  .modal {
    background-color: rgba(0, 0, 0, .3);
  }
  .modal-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    padding: 30px;
    background-color: #fff;
    transform: translate(-50%, -50%);
  }
  .revise-wrap {
    width: 40%;
  }
  .search-header {
    border-bottom: 1px solid #eee;
    margin-bottom: 15px;
  }
  .search-content label {
    padding: 0 5px 0 0;
  }
  .search-content .search-item {
    margin: 10px 0;
  }
  .search-footer {
    margin-top: 15px;
  }
  .search-footer button {
    margin: 0 5px;
  }
  .modal .float-l {
    float: left;
  }
  .modal .revise-cancel {
    position: absolute;
    top: 15px;
    right: 15px;
  }
  .modal .revise-wrap label {
    padding: 0 5px 0 0;
  }
  .modal .margin {
    margin: 10px 0;
  }
  .modal .revise-btns {
    margin: 30px 0 0 0;
  }
  .modal .revise-wrap .tips {
    margin: 5px 0;
    color: rgb(206, 13, 13);
  }
  .modal .revise-wrap .tip {
    margin: 5px 0;
    color: rgb(3, 95, 3);
  }

</style>
