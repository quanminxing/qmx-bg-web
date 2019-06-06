<template lang="pug">
  .main-content-inner
    breadcrumbs(v-bind:breadcrumbs='pagemenu')
    .page-content.row
      .page-main.col-xs-12
        .header
          .title {{detail.sale_status}}
        .content
          .content-order.margin-top
            .content-heading 订单信息
            .content-body.row
              ul
                li.content-item(v-for='(orderItem, orderIndex) in order' :key='orderIndex + "order"' :class='orderItem.col')
                  span.label {{orderItem.label}}：
                  span.value {{orderItem.value}}
                  span.blue.revise(v-if='orderItem.revise' @click='showModal(orderItem)')
                    i.ace-icon.fa.fa-pencil  修改
          .content-customer.margin-top
            .content-heading 客户信息
            .content-body.row
              ul
                li.content-item(v-for='(customerItem, customerIndex) in customer' :key='customerIndex + "customer"' :class='customerItem.col')
                  span.label {{customerItem.label}}：
                  span.value {{customerItem.value}}
          .content-sale.margin-top
            .content-heading 销售信息
            .content-body.row
              ul
                li.content-item(v-for='(saleItem, saleIndex) in sale' :key='saleIndex + "sale"' :class='saleItem.col')
                  span.label {{saleItem.label}}：
                  span.value {{saleItem.value}}
                  span.revise(v-if='saleItem.revise' @click='showModal(saleItem)')
                    i.ace-icon.fa.fa-pencil  修改
          .content-video.margin-top
            .content-heading 视频信息
            .content-body.row
              ul
                li.content-item(v-for='(videoItem, videoIndex) in video' :key='videoIndex + "video"' :class='videoItem.col')
                  span.label {{videoItem.label}}：
                  span.value {{videoItem.value}}
          .content-pay.margin-top
            .content-heading 支付信息
            .content-body.row
              table.table.table-bordered.table-hover#simple-table
                tbody
                  tr.bgc-dceefc
                    th.center(v-for='thItem in payTh' :key='thItem + "payTh"') {{thItem}}
                  tr(v-for='(info, infoIndex) in payInfo' :key='infoIndex + "payInfo"')
                    td.center {{info.type}}
                    td.center {{info.timestamp}}
                    td.center {{info.price}}
                    td.center {{info.pay_status}}
                    td.center {{info.channel}}
                    td.center {{info.end_time}}
                    td.center {{info.third_id}}
                    td.center {{info.voucher}}
        .modal(@click.self='hideModal')
          .revise-wrap.modal-wrap
            .revise-cancel.close(@click='hideModal')
              i.ace-icon.fa.fa-times
            .revise-work-commnet.revise-content(v-if='modal.modalType === "workComment"')
              h4.title.align-center {{modal.workComment.title}}
              .content
                .margin 订单编号：{{detail.order_id}}
                .margin.align-center
                  textarea(v-model='modal.workComment.work_comment' style='width: 100%;  max-width: 100%; height: 200px')
            .revise-price.revise-content(v-if='modal.modalType === "price"')
              h4.title.align-center {{modal.price.title}}
              .content
                .margin 订单编号：{{detail.order_id}}
                .margin 订单价格： ￥{{modal.price.oldPrice}}
                .margin
                  label 修改后价格： ￥
                  input(type='number' min='1' v-model='modal.price.price')
                .margin.tips(v-if='modal.price.tips') {{modal.price.tips}}
            .revise-worker.revise-content(v-if='modal.modalType === "worker"')
              h4.title.align-center {{modal.worker.title}}
              .content
                .margin 订单编号：{{detail.order_id}}
                .margin 跟进销售：{{modal.worker.oldWorker.work_id}} {{modal.worker.oldWorker.worker_name}}
                .margin
                  label 修改后销售：
                  select(v-model='modal.worker.work_id')
                    option(v-for='(workerOption, workerIndex) in salers' :key='workerOption.value + "reviseWorker"' :value='workerOption.value') {{workerOption.value + " " + workerOption.key}}
                .margin.tips(v-if='modal.worker.tips') {{modal.worker.tips}}
            .revise-sale-status.revise-content(v-if='modal.modalType === "saleStatus"')
              h4.title.align-center {{modal.saleStatus.title}}
              .content
                .margin 订单编号：{{detail.order_id}}
                .margin 当前进度：{{modal.saleStatus.old_sale_status}}
                .margin 
                  label 修改后进度：
                  select(v-model='modal.saleStatus.sale_status')
                    option(v-for='(statusOption, statusIndex) in saleStatusList' :key='statusOption + "reviseStatus"' v-if='statusOption !== "已支付定金" && statusOption !== "已支付尾款" && statusOption !== "已支付全款"' :value='statusOption') {{statusOption}}
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
                .margin 订单编号：{{detail.order_id}}
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

  const queryInfo = function(queryData, that) {
    console.log(queryData)
    return new Promise(resolve => {
      query('/api/bill/detail', 'GET', queryData).then(res => {
        let data = res.data
        console.log(res)

        let detail = that.detail;
        for(let key in detail) {
          detail[key] = data[key] || '——'
        }

        let order = that.order;
        order.forEach(item => {
          item.value = data[item.key] !== '' ? data[item.key] : '——'
        })

        let customer = that.customer;
        customer.forEach(item => {
          item.value = data[item.key] || '——'
        })

        let sale = that.sale;
        sale.forEach(item => {
          item.value = data.work_id + '  ' + data.worker_name;
        })
        sale[0].revise = that.$props.user.position === "管理员" ? true : false

        let video = that.video;
        video.forEach(item => {
          item.value = data[item.key]
        })

        order[11].revise = detail.sale_status !== "退款完成" ? true : false
        
        if(detail.pay_status === "待付款" || detail.pay_status === "未付款") {
          order[4].revise = true
          order[5].revise = true
          order[6].revise = true
        } else {
          order[4].revise = false
          order[5].revise = false
          order[6].revise = false
        }

        order[6].revise = (detail.pay_status === "待付款" || detail.pay_status === "未付款") && detail.settle_status === '定金+尾款' ? true : false

        let payInfo = data.pay_info;
        payInfo.forEach(item => {
          item.pay_status = '已付款'
        });
        that.payInfo = payInfo;

        let workComment = that.modal.workComment;
        workComment.work_comment = data.work_comment || ''
        
        let price = that.modal.price;
        price.tips = '';
        price.oldPrice = data.price;
        price.price = ''

        let worker = that.modal.worker;
        worker.tips = '';
        worker.work_id = ''
        worker.oldWorker = {
          work_id: data.work_id,
          worker_name: data.worker_name
        }

        let saleStatus = that.modal.saleStatus;
        saleStatus.old_sale_status = data.trade_status;
        saleStatus.sale_status = '';
        saleStatus.refund_price = '';
        saleStatus.paid_price = data.paid_price;
        saleStatus.tips = '';

        let settleStatus = that.modal.settleStatus;
        settleStatus.tips = '';
        settleStatus.settle_status = data.settle_status || '全款'
        settleStatus.price = data.price || ''
        settleStatus.earnest_price = data.earnest_price || '',
        settleStatus.tail_price = (settleStatus.price - settleStatus.earnest_price).toFixed(2)
        settleStatus.tips = ''

        resolve();
        
      })
    })
  }
  const checkNum = function(num) {
    let newNum = ((num * 100) + '').split('.')[0] / 100;
    newNum = newNum === -0 ? 0.00 : newNum.toFixed(2)

    return newNum * 1
  }

  export default {
    name: 'orderEdit',
    props: ['user'],
    data() {
      return {
        pagemenu: [
          {
            id: 1,
            label: '订单管理',
            href: '/bill/order',
            active: false
          },{
            id: 2,
            label: '订单详情',
            href: '',
            active: true
          }
        ],
        detail: {
          id: '',
          order_id: '',
          sale_status: '',
          settle_status: '',
          pay_status: ''
        },
        order: [
          {
            label: '订单编号',
            key: 'order_id',
            value: '',
            revise: false,
            col: 'col-xs-3'
          },{
            label: '下单时间',
            key: 'order_time',
            value: '——',
            revise: false,
            col: 'col-xs-3'
          },{
            label: '完成时间',
            key: 'trade_time',
            value: '——',
            revise: false,
            col: 'col-xs-3'
          },{
            label: '订单来源',
            key: 'order_source',
            value: '宜拍小程序',
            revise: false,
            col: 'col-xs-3'
          },{
            label: '订单价格',
            key: 'price',
            value: '',
            revise: false,
            type: 'settleStatus',
            col: 'col-xs-3'
          },{
            label: '结算方式',
            key: 'settle_status',
            value: '（默认）全款',
            revise: false,
            type: 'settleStatus',
            col: 'col-xs-3'
          },{
            label: '定金金额',
            key: 'earnest_price',
            value: '——',
            revise: false,
            type: 'settleStatus',
            col: 'col-xs-3'
          },{
            label: '已付金额',
            key: 'paid_price',
            value: '——',
            revise: false,
            col: 'col-xs-3'
          },{
            label: '退款金额',
            key: 'refund_price',
            value: '——',
            revise: false,
            col: 'col-xs-3'
          },{
            label: '退款时间',
            key: 'refund_time',
            value: '——',
            revise: false,
            col: 'col-xs-9'
          },{
            label: '交易状态',
            key: 'trade_status',
            value: '',
            revise: false,
            col: 'col-xs-3'
          },{
            label: '销售进度',
            key: 'sale_status',
            value: '——',
            revise: true,
            type: 'saleStatus',
            col: 'col-xs-3'
          },{
            label: '支付状态',
            key: 'pay_status', 
            value: '',
            revise: false,
            col: 'col-xs-3'
          },{
            label: '买家留言',
            key: 'comment',
            value: '',
            revise: false,
            col: 'col-xs-12'
          },{
            label: '销售备注',
            key: 'work_comment',
            value: '',
            revise: true,
            type: 'workComment',
            col: 'col-xs-12'
          }
        ],
        customer: [
          {
            label: '联系人',
            key: 'name',
            value: '',
            col: 'col-xs-3'
          },{
            label: '商家名称',
            key: 'business',
            value: '',
            col: 'col-xs-9'
          },{
            label: '联系电话',
            key: 'phone',
            value: '',
            col: 'col-xs-3'
          },{
            label: '邮箱',
            key: 'email',
            value: '',
            col: 'col-xs-9'
          }
        ],
        sale: [
          {
            label: '跟进销售',
            key: 'worker_name',
            value: '',
            revise: false,
            type: 'worker',
            col: 'col-xs-12'
          }
        ],
        video: [
          {
            label: '关联视频',
            key: 'video_id',
            value: '',
            col: 'col-xs-3'
          },{
            label: '类目',
            key: 'category_name',
            value: '',
            col: 'col-xs-2'
          },{
            label: '平台',
            key: 'platform_name',
            value: '',
            col: 'col-xs-2'
          },{
            label: '栏目',
            key: 'column_name',
            value: '',
            col: 'col-xs-2'
          },{
            label: '视频比例',
            key: 'scale_id',
            value: '',
            col: 'col-xs-2'
          }
        ],
        payTh: ['付款项目', '生成时间', '应付金额', '支付状态', '支付方式', '付款时间', '第三方交易号', '支付凭证'],
        payInfo: [],
        saleStatusList: ['待沟通', '需求沟通中', '需求不可行', '需求已确认', '待支付定金', '已支付定金', '待支付全款', '已支付全款', '脚本策划中', '待确认脚本', '脚本修改中', '脚本已确认', '待寄送样品', '样品已寄到', '拍摄排期中', '拍摄中', '后期排期中', '后期制作中', '待确认样片', '样片修改中', '样片已确认', '待支付尾款', '已支付尾款', '等待成片', '成片已交付', '交易成功', '退款中', '退款完成'],
        salers: [],
        modal: {
          modalType: '',
          workComment: {
            title: '编辑销售备注',
            work_comment: ''
          },
          price: {
            title: '修改订单价格',
            oldPrice: '',
            price: '',
            tips: ''
          },
          worker: {
            title: '修改订单销售',
            oldWorker: {
              work_id: '',
              worker_name: ''
            },
            work_id: '',
            tips: ''
          },
          saleStatus: {
            title: '修改销售进度',
            old_sale_status: '',
            sale_status: '',
            paid_price: '',
            refund_price: '',
            tips: ''
          },
          settleStatus: {
            title: '修改结算方式、价格、定金',
            settle_status: '',
            price: '',
            earnest_price: '',
            tips: '',
            options: ['全款', '定金+尾款']
          }
        },
      }
    },
    components: {
      breadcrumbs
    },
    mounted() {
      $('body').scrollTop = 0;
      let id = this.$route.params.id;

      queryInfo({ id }, this);

      // 获取跟进销售
      query('/api/info/worker').then(res => {
        console.log('跟进销售')
        this.salers = res.data.map(item => {
          return {
            key: item.cname,
            value: item.id
          }
        })
      }).catch(err => {
        console.log('获取跟进销售出错')
      })

      $("body , html").animate({scrollTop:0},100);
    },
    methods: {
      
      //  显示 modal：搜索、备注等
      showModal(data) {
        let type = data.type;
        console.log(type)
        
        this.modal.modalType = type
        $('.modal').show();
      },

      // 隐藏 modal：取消搜索等
      hideModal() {
        $('.modal').hide()
      },

      // 修改
      revise(type) {
        console.log(type)

        const reviseType = {
          'workComment': () => {
            let data = this.modal.workComment
            let id = this.detail.id;
            query('/api/bill/workComment', 'POST', {
              id,
              work_comment: data.work_comment
            }).then(() => {
              queryInfo({ id }, this);
              this.hideModal()
            })
          },
          'price': () => {
            let data = this.modal.price;
            let id = this.detail.id;
            let price = checkNum(data.price)
            console.log(price)
            if(price <= 0) {
              data.tips = '订单价格必须大于0'
            } else {
              query('/api/bill/price', 'POST', {
                id,
                price
              }).then(() => {
                queryInfo({ id }, this);
                this.hideModal()
              }).catch(err => {
                console.log('修改出错')
                data.tips = err != 'error' ? err.err_message : '网络出错，请重试！';
              })
            }
            
          },
          'worker': () => {
            let data = this.modal.worker;
            let id = this.detail.id;
            query('/api/bill/work', 'POST', {
              id,
              work_id: data.work_id
            }).then(() => {
              queryInfo({ id }, this);
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
            let id = this.detail.id;
            let refundPrice = checkNum(data.refund_price)
            console.log(data.refund_price)
            if(data.sale_status === '退款完成') {
              if(data.refund_price === '') {
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
              id,
              sale_status: data.sale_status,
              refund_price: refundPrice || ''
            }).then(() => {
              queryInfo({ id }, this);
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
            let id = this.detail.id;
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
                data.tips = '操作失败，定金金额必须小于订单价格'

              return
              }
            }
            
            let settle = query('/api/bill/settleStatus', 'POST', {
              id,
              settle_status: data.settle_status,
              earnest_price: data.settle_status === '全款' ? '' : earnestPrice || '',
              price
            }).then(() => {
              queryInfo({ id }, this);
              this.hideModal()
            }).catch((err) => {
              console.log('修改出错')
              data.tips = err != 'error' ? err.err_message : '网络出错，请重试！';
            })
          }
        }
        reviseType[type]();
      },
    },
    watch: {
      'modal.settleStatus.earnest_price': function(val) {
        
        let settleStatus = this.modal.settleStatus;
        settleStatus.tail_price = (checkNum(settleStatus.price) - checkNum(val)).toFixed(2)
        if(checkNum(val) < 0) {
          settleStatus.tips = '操作失败，定金金额必须大于0'
        }else if(settleStatus.tail_price < 0) {
          settleStatus.tips = '操作失败，定金金额必须小于订单价格'
        }
      }
    }
  }
</script>

<style>
  li {
    list-style: none;
  }
  .bgc-dceefc {
    background-color: #dceefc;
  }
  .margin-top {
    margin: 30px 0 0 0;
  }
  .header {
    color: #169BD5;
    padding: 0 0 10px 0;
    border-bottom: 1px solid #169BD5;
    font-size: 20px;
  }
  .content-item {
    font-size: 14px;
    color: #333;
    line-height: 45px;
  }
  .content-heading {
    padding: 10px 0;
    font-size: 16px;
    font-weight: bold;
  }
  .content-item .label {
    padding: 0;
    background-color: transparent;
    color: #999;
    font-size: 14px;
  }
  .content-item .revise {
    padding: 0 15px;
    color: #169BD5;
    cursor: pointer;
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
