<template lang="pug">
  .main-content-inner
    breadcrumbs(v-bind:breadcrumbs='pagemenu')
    .page-content.row
      .page-main.col-xs-12
        .grid
          .grid-header.align-right
            .btn-group
              button.btn.btn-white.btn-info.margin-lr5#search-btn(@click='showModal("search")') 搜索 
                i.ace-icon.fa.fa-search.bigger-120.blue
          .grid-content
            table.table.table-bordered.table-hover#simple-table(v-for='(order, orderIndex) in orders' :key='order.id')
              tbody
                tr.bgc-d5e3ef
                  td.align-middle(colspan='12')
                    .col-xs-3 订单编号：{{order.order_id}}
                    .col-xs-2 下单时间：{{order.order_time}}
                    .col-xs-3 退款完成时间：{{order.refund_time || '——'}}
                    .col-xs-2 退款金额：{{order.refund_price || '——'}}
                    .col-xs-2.align-right 交易状态：
                      span.c-169BD5(:class='[order.trade_status === "交易成功" ? "c-green" : ""]') {{order.trade_status}}
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
                    p {{order.settle_status}}
                      span.blue.padding.pointer(v-if='order.pay_status === "待付款" || order.pay_status === "未付款"' @click='showModal("settleStatus", order)')
                        i.ace-icon.fa.fa-pencil.bigger-120
                  td.align-middle
                    p {{order.pay_status || '——'}}
                  td.align-middle
                    p {{order.price === '' ? '——' : '￥' + order.price}}
                      span.blue.padding.pointer(v-if='order.pay_status === "待付款" || order.pay_status === "未付款"' @click='showModal("settleStatus", order)')
                        i.ace-icon.fa.fa-pencil.bigger-120
                  td.align-middle
                    p {{order.earnest_price === '' ? '——' : '￥' + order.earnest_price}}
                      span.blue.padding.pointer(v-if='(order.pay_status === "待付款" || order.pay_status === "未付款") && order.settle_status === "定金+尾款"' @click='showModal("settleStatus", order)')
                        i.ace-icon.fa.fa-pencil.bigger-120
                  td.align-middle
                    p {{order.paid_price === '' ? '——' : '￥' + order.paid_price}}
                  td.align-middle
                    p {{order.sale_status === '退款完成' && order.refund_price !== '' ? order.refund_price : '——'}}
                  td.align-middle
                    p
                      span.padding {{order.work_id || '——'}}
                      span.padding {{order.worker_name || ''}}
                      span.blue.padding.pointer(v-if='user.position === "管理员"' @click='showModal("worker", order)')
                        i.ace-icon.fa.fa-pencil.bigger-120
                  td.align-middle
                    p {{order.sale_status}}
                      span.blue.padding.pointer(v-if='order.sale_status !== "退款完成"' @click='showModal("saleStatus", order)')
                        i.ace-icon.fa.fa-pencil.bigger-120
                  td.align-middle
                    router-link(:to='{name: "orderEdit", params: {id: order.id}}') 查看详情
                  
                tr
                  td.td-width.align-middle(colspan='5') 买家留言：{{order.comment}}
                  td.align-middle(colspan='7') 销售备注：{{order.work_comment}}
                    span.blue.padding.pointer(@click='showModal("workComment", order)')
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
        .modal(@click.self='hideModal')
          .search-wrap.modal-wrap(v-if='modal.modalType === "search"')
            .row.search-header
              p 搜索
            .row.search-content
              .search-item.search-text.col-sm-6.col-xs-12(v-if='searchItems.text' v-for='(textItem, textIndex) in searchItems.text' :key='textItem.label + "searchText"')
                label {{textItem.label}}:
                input(:type='textItem.type || "text"' v-model='textItem.value' :placeholder='textItem.placeholder')
              .search-item.col-xs-12.order-time
                label 下单时间：
                input(type='date' name='order-time-start' v-model='searchItems.order_time.start')
                span.padding  — — 
                input(type='date', name='order-time-end' v-model='searchItems.order_time.end')
              .search-item.search-select.col-sm-6.col-xs-12(v-if='searchItems.select' v-for='(selectItem, selectIndex) in searchItems.select' :key='selectItem.label + "searchSelect"')
                label {{selectItem.label}}:
                select(v-model='selectItem.value')
                  option.hide(value='') --请选择--
                  option(v-for='(option, optionIndex) in selectItem.options' :key='optionIndex + "searchSelectOption"' :value='option.value || option') {{option.value ? option.value + " " + option.key : option}}
            .row.search-footer.align-right
              button.btn.btn-info.btn-sm.float-l(@click='resetSearch') 重置
              button.btn.btn-default.btn-sm(@click='hideModal') 取消
              button.btn.btn-success.btn-sm(@click='search') 确定
          .revise-wrap.modal-wrap(v-if='modal.modalType !== "search"')
            .revise-cancel.close(@click='hideModal')
              i.ace-icon.fa.fa-times
            .revise-work-commnet.revise-content(v-if='modal.modalType === "workComment"')
              h4.title.align-center {{modal.workComment.title}}
              .content
                .margin 订单编号：{{modal.workComment.order_id}}
                .margin.align-center
                  textarea(v-model='modal.workComment.work_comment' style='width: 100%;  max-width: 100%; height: 200px')
            .revise-price.revise-content(v-if='modal.modalType === "price"')
              h4.title.align-center {{modal.price.title}}
              .content
                .margin 订单编号：{{modal.price.order_id}}
                .margin 订单价格： ￥{{modal.price.oldPrice}}
                .margin
                  label 修改后价格： ￥
                  input(type='number' min='1' v-model='modal.price.price')
                .margin.tips(v-if='modal.price.tips') {{modal.price.tips}}
            .revise-worker.revise-content(v-if='modal.modalType === "worker"')
              h4.title.align-center {{modal.worker.title}}
              .content
                .margin 订单编号：{{modal.order_id}}
                .margin 跟进销售：{{modal.worker.oldWorker.work_id}} {{modal.worker.oldWorker.worker_name}}
                .margin
                  label 修改后销售：
                  select(v-model='modal.worker.work_id')
                    option(v-for='(workerOption, workerIndex) in searchItems.select[3].options' :key='workerIndex + "reviseWorker"' :value='workerOption.value') {{workerOption.value + " " + workerOption.key}}
                .margin.tips(v-if='modal.worker.tips') {{modal.worker.tips}}
            .revise-sale-status.revise-content(v-if='modal.modalType === "saleStatus"')
              h4.title.align-center {{modal.saleStatus.title}}
              .content
                .margin 订单编号：{{modal.saleStatus.order_id}}
                .margin 当前进度：{{modal.saleStatus.old_sale_status}}
                .margin 
                  label 修改后进度：
                  select(v-model='modal.saleStatus.sale_status')
                    option(v-for='(statusOption, statusIndex) in searchItems.select[1].options' :key='statusOption + "reviseStatus"' v-if='statusOption !== "已支付定金" && statusOption !== "已支付尾款" && statusOption !== "已支付全款"' :value='statusOption') {{statusOption}}
                div(v-if='modal.saleStatus.sale_status === "退款完成"')
                  .margin 已付金额： ￥{{modal.saleStatus.paid_price}}
                  .margin
                    label 退款金额： ￥
                    input(type='number' min='0' v-model='modal.saleStatus.refund_price')
                  .margin.tip 注意：完成退款后，订单信息将无法再修改，请仔细确认清楚后再提交！
                .margin.tips(v-if='modal.saleStatus.tips') {{modal.saleStatus.tips}}
            .revise-settle-status.revise-content(v-if='modal.modalType === "settleStatus"')
              h4.title.align-center {{modal.settleStatus.title}}
              .content
                .margin 订单编号：{{modal.settleStatus.order_id}}
                .margin
                  label 结算方式：
                  select(v-model='modal.settleStatus.settle_status')
                    option(v-for='(statusOption, statusIndex) in modal.settleStatus.options' :key='statusOption + "settleStatus"' :value='statusOption') {{statusOption}}
                .margin
                  label 订单价格： ￥
                  input(type='number' min='1' v-model='modal.settleStatus.price')
                .margin(v-if='modal.settleStatus.settle_status === "定金+尾款"')
                  label 定金金额： ￥
                  input(type='number' min='1' v-model='modal.settleStatus.earnest_price')
                .margin(v-if='modal.settleStatus.settle_status === "定金+尾款"')
                  label 尾款金额： ￥ {{modal.settleStatus.tail_price}}
                .margin.tips(v-if='modal.settleStatus.tips') {{modal.settleStatus.tips}}
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

  let searchData = {
    _search: false
  }

  const queryOrders = function(vue, searchData) {
    
    let queryData = {};
    if(searchData._search) {
      queryData = searchData;
    }
    queryData.pageNum = vue.page.pageNum;
    queryData.pageSize = vue.page.pageSize;

    console.log('请求参数')
    console.log(queryData)

    return query('/api/bill', 'GET', queryData).then(res => {
          console.log('搜索结果')
          vue.pageTotal = res.total;
          vue.orders = res.data;
        }).catch(err => {
          console.log('搜索结果出错')
        })
  }
  const checkNum = function(num) {
    let newNum = ((num * 100) + '').split('.')[0] / 100;
    newNum = newNum === -0 ? 0.00 : newNum.toFixed(2)

    return newNum * 1
  }
  
  export default {
    name: 'order',
    props: ['user'],
    data() {
      return {
        
        pagemenu,
        colNames: ['买家信息','联系方式','关联视频','结算方式','付款状态','订单价格','定金金额','已付金额','退款金额','跟进销售','销售进度','操作'],
        orders: [],
        modal: {
          modalType: '',
          workComment: {
            title: '编辑销售备注',
            id: '',
            order_id: '',
            work_comment: ''
          },
          price: {
            title: '修改订单价格',
            id: '',
            order_id: '',
            oldPrice: '',
            price: '',
            tips: ''
          },
          worker: {
            title: '修改订单销售',
            id: '',
            order_id: '',
            oldWorker: {
              work_id: '',
              worker_name: ''
            },
            work_id: '',
            tips: ''
          },
          saleStatus: {
            title: '修改销售进度',
            id: '',
            order_id: '',
            old_sale_status: '',
            sale_status: '',
            paid_price: '',
            refund_price: '',
            tips: ''
          },
          settleStatus: {
            title: '修改结算方式、价格、定金',
            id: '',
            order_id: '',
            settle_status: '',
            price: '',
            earnest_price: '',
            tips: '',
            options: ['全款', '定金+尾款']
          }
        },
        searchItems: {
          text: [
            {
              label: '订单编号',
              placeholder: '订单编号',
              key: 'order_id',
              value: '',
              type: ''
            },{
              label: '账号',
              placeholder: '账号',
              key: 'phone',
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
              label: '销售进度',
              name: '',
              key: 'sale_status',
              value: '',
              options: ['待沟通', '需求沟通中', '需求不可行', '需求已确认', '待支付定金', '已支付定金', '待支付全款', '已支付全款', '脚本策划中', '待确认脚本', '脚本修改中', '脚本已确认', '待寄送样品', '样品已寄到', '拍摄排期中', '拍摄中', '后期排期中', '后期制作中', '待确认样片', '样片修改中', '样片已确认', '待支付尾款', '已支付尾款', '等待成片', '成片已交付', '交易成功', '退款中', '退款完成']
            },{
              label: '支付状态',
              name: '',
              key: 'pay_status',
              value: '',
              options: ['未付款', '已支付定金', '已支付尾款', '已支付全款']
            },{
              label: '跟进销售',
              name: '',
              key: 'work_id',
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
      //  显示 modal：搜索、备注等
      showModal(type, data) {
        console.log(type)
        
        this.modal.modalType = type
        $('.modal').show();

        if(!!this.modal[type] && data) {
          console.log(this.modal[type].id)
          console.log(data.id)

          this.modal[type].id = data.id
          this.modal[type].order_id = data.order_id
          console.log('workerndk6666666666666666666666')
          let modal = {
            workComment: () => {
              let modalData = this.modal.workComment;

              modalData.work_comment = data.work_comment || ''
            },
            price: () => {
              let modalData = this.modal.price;

              modalData.tips = '';
              modalData.oldPrice = data.price;
              modalData.price = ''
            },
            worker: () => {
              console.log('workerndk6666666666666666666666')
              let modalData = this.modal.worker;

              modalData.tips = '';
              modalData.work_id = ''
              modalData.oldWorker = {
                work_id: data.work_id,
                worker_name: data.worker_name
              }
              console.log('workerndk6666666666666666666666')
            },
            saleStatus: () => {
              let modalData = this.modal.saleStatus;

              modalData.old_sale_status = data.sale_status;
              modalData.sale_status = '';
              modalData.refund_price = '';
              modalData.paid_price = data.paid_price;
              modalData.tips = '';
            },
            settleStatus: () => {
              let modalData = this.modal.settleStatus;

              modalData.tips = '';
              modalData.settle_status = data.settle_status || '全款'
              modalData.price = data.price || ''
              modalData.earnest_price = data.earnest_price || 0,
              modalData.tail_price = (modalData.price - modalData.earnest_price).toFixed(2)
              modalData.tips = ''
            }
          }
          console.log('workerndk6666666666666666666666')
          modal[type]();
        }
      },

      // 隐藏 modal：取消搜索等
      hideModal() {
        $('.modal').hide()
      },

      // 搜索
      search() {
        this.page.pageNum = 1;

        let text = this.searchItems.text;
        let select = this.searchItems.select;
        let order_time = this.searchItems.order_time;

        console.log(text)
        console.log(select)
        console.log(order_time)

        searchData = {
          _search: true
        }

        text.forEach(item => {
          let value = item.value.trim();
          if(!!value) {
            searchData[item.key] = value;
          }
        })
        select.forEach(item => {
          console.log(item)
          let value = item.value;
          if(!!value) {
            searchData[item.key] = value;
          }
        })
        if(!!order_time.start || !!order_time.end) {

          let start = order_time.start || '3010-01-01'
          let end = order_time.end || '3090-01-01'
          searchData.order_time = start + ',' + end

          console.log(searchData.order_time)
        }

        queryOrders(this, searchData).then(() => {
          
          $(window).scrollTop(0);
          $('.modal').hide();
        });
      },

      // 重置搜索
      resetSearch() {
        searchData = {
          _search: false
          
        }
        this.searchItems.text.forEach(item => {
          item.value = ''
        })
        this.searchItems.select.forEach(item => {
          item.value = ''
        })
        this.searchItems.order_time = {
          start: '',
          end: ''
        }
      },

      // 修改
      revise(type) {
        const reviseType = {
          'workComment': () => {
            let data = this.modal.workComment
            query('/api/bill/workComment', 'POST', {
              id: data.id,
              work_comment: data.work_comment
            }).then(() => {
              queryOrders(this, searchData)
              this.hideModal()
            })
          },
          'price': () => {
            let data = this.modal.price;
            let price = checkNum(data.price)
            console.log(price)
            if(price <= 0) {
              data.tips = '订单价格必须大于0'
            } else {
              query('/api/bill/price', 'POST', {
                id: data.id,
                price
              }).then(() => {
                queryOrders(this, searchData)
                this.hideModal()
              }).catch(err => {
                console.log('修改出错')
                data.tips = err != 'error' ? err.err_message : '网络出错，请重试！';
              })
            }
            
          },
          'worker': () => {
            let data = this.modal.worker;
            query('/api/bill/work', 'POST', {
              id: data.id,
              work_id: data.work_id
            }).then(() => {
              queryOrders(this, searchData)
              this.hideModal()

            }).catch(err => {
              console.log(err)
              console.log('修改出错')
              this.modal.worker.tips = err != 'error' ? err.err_message : '网络出错，请重试！';
            })
          },
          'saleStatus': () => {
            // checkNum(this)
            let data = this.modal.saleStatus;
            let refundPrice = checkNum(data.refund_price)
            console.log(data.refund_price)
            if(data.sale_status === '退款完成') {
              if(data.refund_price === '') {
                console.log(data.refund_price)
                console.log(data.refund_price === '')
                this.modal.saleStatus.tips = '请输入退款金额'
                return
              } else if (refundPrice < 0) {
                this.modal.saleStatus.tips = '请输入合理的退款金额'
                return
              } else if(refundPrice > checkNum(data.paid_price)) {
                this.modal.saleStatus.tips = '退款金额不能大于已付金额'
                return
              }
            }

            console.log(refundPrice)

            query('/api/bill/saleStatus', 'POST', {
              id: data.id,
              sale_status: data.sale_status,
              refund_price: refundPrice || 0
            }).then(() => {
              queryOrders(this, searchData)
              this.hideModal()
            }).catch(err => {
              console.log('修改出错')

              if(err == 'error') {

              }
              this.modal.saleStatus.tips = err != 'error' ? err.err_message : '网络出错，请重试！';
            })
          },
          'settleStatus': () => {
            let data = this.modal.settleStatus;
            let earnestPrice = checkNum(data.earnest_price);
            let price = checkNum(data.price);

            if(price <= 0) {
              data.tips = '操作失败，订单价格必须大于0'

              return
            } else if(data.settle_status !== '全款') {
              if(earnestPrice <= 0) {
                data.tips = '操作失败，定金金额必须大于0'

              return
              } else if(earnestPrice > price) {
                data.tips = '操作失败，定金金额必须小于订单价格.'

              return
              }
            }

            earnestPrice = data.settle_status === '全款' ? '' : earnestPrice
            let settle = query('/api/bill/settleStatus', 'POST', {
              id: data.id,
              settle_status: data.settle_status,
              earnest_price: data.settle_status === '全款' ? '' : earnestPrice || '',
              price
            }).then((res) => {
              console.log(res)
              queryOrders(this, searchData)
              this.hideModal()
            }).catch((err) => {
              console.log(err)
              console.log('修改出错')
              data.tips = err != 'error' ? err.err_message : '网络出错，请重试！';
            })
          }
        }
        reviseType[type]();
      },

      // 分页
      prevPage() {
        console.log('上一页')
        if(this.page.pageNum > 1) {
          --this.page.pageNum;
        }
      },
      nextPage() {
        console.log('下一页')
        if(this.page.pageNum * this.page.pageSize < this.pageTotal) {
          ++this.page.pageNum
        }
      },
    },
    mounted() {
      // 获取订单列表
      queryOrders(this, this.page);

      // 获取跟进销售
      query('/api/info/worker').then(res => {
        console.log('跟进销售')
        console.log(res)
        this.searchItems.select[3].options = res.data.map(item => {

          return {
            key: item.cname,
            value: item.id
          }
        })
      }).catch(err => {
        console.log('获取跟进销售出错')
      })
    },
    watch: {
      page: {
        handler: function() {
          console.log('上、下一页')
          queryOrders(this, searchData).then(() => {
            
            $(window).scrollTop(0);
          })
        },
        deep: true
      },
      'modal.settleStatus': {
        handler: function(val) {
          
          let settleStatus = this.modal.settleStatus;

          settleStatus.tail_price = (checkNum(settleStatus.price) - checkNum(settleStatus.earnest_price)).toFixed(2)
        },
        deep: true
      }
    }
  }
</script>

<style>
  .padding {
    padding: 0 5px;
  }
  .td-width {
    width: 35%;
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
  .c-169BD5 {
    color: #169BD5;
  }
  .c-green {
    color: green;
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
  .revise-wrap .title {
    padding: 0 0 15px 0;
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
  .modal-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    background: #fff;
    transform: translate(-50%, -50%);
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
