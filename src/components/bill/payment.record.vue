<template lang="pug">
  .main-content-inner
    breadcrumbs(v-bind:breadcrumbs='pagemenu')
    .page-content.row
      .page-main.col-xs-12
        .grid
          .grid-header.row
            .col-xs-4
            //-
              label.page-size 显示
                select.input-sm(v-model='page.pageSize')
                  option(v-for='item in pageSizeRange' :value='item' :key='item + "pagerange"') {{item}}
                span 条
            .btn-group.col-xs-8.align-right
              span
                button.btn.btn-white.btn-info.margin-lr5#search-btn(@click='showModal("search")') 搜索 
                  i.ace-icon.fa.fa-search.bigger-120.blue
          .grid-content
            table.table.table-bordered.table-hover#simple-table
              thead
                tr
                  th.center(v-for='(col, colIndex) in colNames' :key='colIndex + "tableColName"') {{col}}
              tbody
                tr.center(v-for='(record, recordIndex) in records' :key='recordIndex + "pamentRecord"')
                  td(v-for='(recordValue, recordKey) in record.table' :key='recordKey + "recordValue"' :class='{pointer: recordKey === "handle" && recordValue !== "——", tobecheck: (recordKey === "verify" && recordValue === "待审核") ||(recordKey === "handle" && recordValue === "审核")}' @click='showModal(recordValue, record)') {{recordValue || '——'}}
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
          .modal-search-box.modal-box(:hidden='modal.type !== "search"')
            .modal-search-box-content
              .text.row
                .search-item.modal-item.col-sm-6.col-xs-12(v-if='!!searchItems.text' v-for='(textItem, index) in searchItems.text' :key='textItem.key + index')
                  label {{textItem.label}}: 
                  input(:type='textItem.type || "text"' v-model='modal.search[textItem.key]' :key='textItem.key + "search"')
              .select.row
                .search-item.modal-item.col-sm-6.col-xs-12(v-if='!!searchItems.select' v-for='(selectItem, index) in searchItems.select' :key='selectItem.key + index')
                  label {{selectItem.label}}: 
                  select(v-model='modal.search[selectItem.key]')
                    option(value='' selected disabled) --请选择--
                    option(v-for='(option, index) in selectItem.options' :key='"search" + index' :value='option') {{option}}
              .datetime.row
                .search-item.modal-item.col-xs-12
                  label 生成时间
                  input.datetimepicker#timestamp_start(type='text' readonly :value='modal.search.timestamp_start')
                  span.padding-lr30 ——
                  input.datetimepicker#timestamp_end(type='text' readonly :value='modal.search.timestamp_end')
              .search-btns.row
                button(type='reset').btn.btn-info.btn-sm.float-l(@click='reset') 重置
                button.btn.btn-default.btn-sm(@click='hideModal') 取消
                button.btn.btn-success.btn-sm(@click='search') 确定
          .check-box.modal-box(:hidden='modal.type !== "check"')
            .check-item.modal-item
              span.check-item-label 支付编号：
              span.check-item-value {{modal.check.serial}}
            .check-item.modal-item
              span.check-item-label 支付凭证：
              .check-item-value
                img.pay-voucher(:src='modal.check.voucher')
            .check-item.modal-item
              span.check-item-label(v-if='!!modal.check.verify_info') 不通过原因
              p.check-item-value.padding-tb10-lr30 {{modal.check.verify_info}}
            .check-btns.modal-btns
              button.btn(@click='hideModal') 关闭
          .verify-box.modal-box.pos-rel(:hidden='modal.type !== "verify"')
            .verify-item.modal-item
              span.verify-item-label 支付编号：
              span.verify-item-value {{modal.verify.serial}}
            .verify-item.modal-item
              span.verify-item-label 支付凭证：
              .verify-item-value
                img.pay-voucher(:src='modal.verify.voucher')
            .verify-item.modal-item
              span.verify-item-label 客户信息：
              .verify-item-value.custom-info.row
                .custom-info-item.col-xs-12.col-sm-6
                  span.custom-info-label 联系人：
                  span.custom-info-value {{modal.verify.name}}
                .custom-info-item.col-xs-12.col-sm-6
                  span.custom-info-label 商家名称：
                  span.custom-info-value {{modal.verify.business}}
                .custom-info-item.col-xs-12.col-sm-6
                  span.custom-info-label 联系电话：
                  span.custom-info-value {{modal.verify.phone}}
                .custom-info-item.col-xs-12.col-sm-6
                  span.custom-info-label 邮箱：
                  span.custom-info-value {{modal.verify.email}}
            .verify-item.modal-item.fz-16.red
              span.verify-item-label 应支付金额：
              span.verify-item-value {{modal.verify.price}}
            .verify-item.modal-item.flex-s-c
              span.verify-item-label 审核结果：
              label.verify-label
                input#id-button-borders.ace.ace-switch.ace-switch-5(type="checkbox" v-model='modal.verify.verify_status')
                span.lbl
              span {{modal.verify.verify_status ? '审核通过' : '审核不通过'}}
            .row.verify-item-wrap(:hidden='!modal.verify.verify_status')
              .verify-item.modal-item.col-xs-6
                  i.red * 
                  span.verify-item-label 付款时间：
                  input.verify-item-value#end_time(type='text' readonly v-model='modal.verify.end_time')
              .verify-item.modal-item.col-xs-6
                span.verify-item-label 第三方交易号：
                input.verify-item-value(type='text' v-model='modal.verify.third_id' style='min-width:250px;')
            .div(:hidden='modal.verify.verify_status')
              .verify-item.modal-item
                i.red * 
                span.verify-item-label 审核不通过原因：
                .verify-item-value.textarea
                  textarea(cols='60' rows='3' v-model='modal.verify.verify_info')
            .verify-tip.padding-tb10-lr30.align-center(v-if='!!modal.verify.tip')
              p.fz-16.red {{modal.verify.tip}}
            .verify-btns.modal-btns
              button.btn.btn-success(@click='verifyPayment') {{modal.verify.verify_status ? '审核通过提交' : '审核不通过提交'}}
              button.btn.btn-close(@click='hideModal') 关闭

</template>

<script>
  import breadcrumbs from '../mods/breadcrumbs.vue';
  import { query, codeTransform, showToast } from '@/assets/js/common.js';

  let queryData = {
    _search: false,
    pageSize: 20,
    pageNum: 1
  }
  
  const initDatetimepicker = function(selector, onClose, defaultValue='') {
    $(selector).datetimepicker({
      dateFormat: 'yy-mm-dd',
      timeFormat: 'HH:mm:ss',
      defaultValue,
      stepHour: 1,
      stepMinute: 1,
      stepSecond: 1,
      timeText: '时间',
      hourText: '时',
      minuteText: '分',
      secondText: '秒',
      monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
      dayNamesMin: ['一', '二', '三', '四', '五', '六', '日'],
      showOtherMonths: true,
      selectOtherMonths: true,
      onClose,
    })
  }

  const queryList = function(queryData, ctx) {
    console.log(queryData)
    return new Promise((resolve, reject) => {
      query('/api/pay/listAll', 'GET', queryData).then(res => {
        ctx.pageTotal = res.total;
        let resData = res.data;
        let records = resData.map(item => {
          return {
            table: {
              serial: item.serial,
              order_id: item.order_id,
              type: item.type,
              timestamp: item.timestamp,
              price: `￥${item.price}`,
              verify: item.verify,
              channel: item.channel,
              end_time: item.end_time,
              third_id: item.third_id,
              handle: item.verify === '待审核' ? '审核' : (!!item.verify ? '查看' : '——')
            },
            pay_id: item.id,
            voucher: item.voucher,
            verify_info: item.verify_info,
            name: item.name,
            business: item.business,
            phone: item.phone,
            email: item.email
          }
        })
        ctx.records = records;

        resolve()

      }).catch(err => {
        console.log(err)
        ctx.$emit('toast', '网络异常，请稍后重试！', 2000)
        reject()
      })
    })
  }

  export default {
    name: 'paymentRecord',
    components: {
      breadcrumbs
    },
    props: ['user'],
    data() {
      return {
        test: '',
        pagemenu: [
          {
            id: 1,
            label: '支付记录列表',
            href: '',
            active: true
          }
        ],
        searchItems: {
          text: [
            {
              label: '支付编号',
              placeholder: '支付编号',
              key: 'pay_serial',
              value: '',
              type: ''
            },{
              label: '订单编号',
              placeholder: '订单编号',
              key: 'order_id',
              value: ''
            }
          ],
          select: [
            {
              label: '审核状态',
              name: 'verify',
              key: 'pay_verify',
              value: '',
              options: ['待审核', '审核未通过', '审核通过']
            },{
              label: '支付方式',
              name: 'channel',
              key: 'pay_channel',
              value: '',
              options: ['对公付款', '微信支付']
            }
          ]
        },
        pageTotal: 20,
        page: {
          pageSize: queryData.pageSize,
          pageNum: queryData.pageNum,
        },
        colNames: ['支付编号', '关联订单', '付款项目', '生成时间', '付款金额', '审核状态', '支付方式', '付款时间', '第三方交易号', '操作'],
        records: [],
        modal: {
          type: 'search',
          search: {
            pay_serial: '',
            order_id: '',
            pay_verify: '',
            pay_channel: '',
            timestamp_start: '',
            timestamp_end: ''
          },
          check: {
            serial: '',
            voucher: '',
            verify_info: ''
          },
          verify: {
            pay_id: '',
            serial: '',
            voucher: '',
            name: '',
            business: '',
            phone: '',
            email: '',
            price: '',
            verify: '',
            verify_status: '',
            end_time: '',
            third_id: '',
            verify_info: '',
            tip: ''
          }
        }
      }
    },
    mounted() {
      const vue = this;
      $(function() {
        initDatetimepicker('#timestamp_start', date => {
          console.log(date)
          vue.modal.search.timestamp_start = date
        })
        initDatetimepicker('#timestamp_end', (date, obj) => {
          console.log(obj)
          vue.modal.search.timestamp_end = date
        })
      })

      // 获取订单列表
      queryList(queryData, this)
    },
    methods: {
      showModal(type, data) {
        const types = ['search', '审核', '查看']
        
        if(!!types.find(item => item === type)) {
          const typesChange = {
            search: 'search',
            '审核': 'verify',
            '查看': 'check'
          }
          type = typesChange[type];

          this.modal.type = type
          if(type !== 'search' && !!data) {
            
            const modal = {
              check: (data) => {
                this.modal[type] = {
                  serial: data.table.serial || '',
                  voucher: data.voucher || '',
                  verify_info: data.verify_info || ''
                }
              },
              verify: (data) => {
                let tableData = data.table
                let verifyModal= this.modal
                verifyModal.verify = {
                  pay_id: data.pay_id || '',
                  serial: tableData.serial || '',
                  voucher: data.voucher || '',
                  name: data.name || '',
                  business: data.business || '',
                  phone: data.phone || '',
                  email: data.email || '',
                  price: tableData.price || '',
                  verify: tableData.verify || '',
                  verify_status: tableData.verify === '审核未通过' ? false : true,
                  end_time: tableData.end_time || '',
                  third_id: tableData.third_id || '',
                  verify_info: data.verify_info || '',
                  tip: ''
                }
                $(function() {
                  initDatetimepicker('#end_time', (date, obj) => {
                    // console.log(verify)
                    verifyModal.verify.end_time = date
                    console.log(date)
                  })
                })
                
              },
            }

            modal[type](data)
          }
          
          $('.modal').show()
        }
        
      },
      hideModal() {
        $('.modal').hide()
      },
      search() {
        let searchValue = this.modal.search;
        let timestamp_start = '1995-01-01 00:00:00';
        let timestamp_end = '2119-01-01 00:00:00'
        queryData._search = true;

        for(let key in searchValue) {
          if(!!searchValue[key]) {
            if(key === 'timestamp_start' && !!searchValue[key]) {
              timestamp_start = searchValue[key]
            } else if(key === 'timestamp_end' && !!searchValue[key]) {
              timestamp_end = searchValue[key]
            } else {
              queryData[key] = searchValue[key]
            }
            
          }
        }
        queryData.timestamp = `${timestamp_start},${timestamp_end}`
        
        // console.log(searchValue)
        // 搜索订单列表
        console.log('搜索')
        queryList(queryData, this).then(() => {
          console.log('999999999999999999999999')
          this.hideModal()
        })
      },
      reset() {
        this.modal.search = {
          pay_serial: '',
          order_id: '',
          pay_verify: '',
          pay_channel: '',
          timestamp_start: '',
          timestamp_end: ''
        }
        queryData = {
          _search: false,
          pageSize: 20,
          pageNum: 1
        }
        console.log(queryData)
      },
      verifyPayment() {
        let values = this.modal.verify;
        if(values.verify_status && !values.end_time) {
          values.tip = '请选择付款时间后再提交！'
          return false
        }
        if(!values.verify_status && !values.verify_info) {
          values.tip = '请填写审核不通过原因！'
          return false
        }

        let postData = {}
        if(values.verify_status) {
          postData = {
            pay_id: values.pay_id,
            verify: '审核通过',
            end_time: values.end_time,
            third_id: values.third_id
          }
        } else {
          postData = {
            pay_id: values.pay_id,
            verify: '审核未通过',
            verify_info: values.verify_info
          }
        }
        query('/api/pay/verify', 'POST', postData).then(res => {
          // 刷新订单列表
          queryList(queryData, this)
          this.$emit('toast', '提交成功！', 2000)
          this.hideModal()
        }).catch(err => {
          console.log(err)
          if(err.httpStatus === 200 && err.status === 500) {
            console.log('重复审核')
            values.tip = err.err_message;
          } else {
            this.$emit('toast', '网络异常，请稍后重试', 2000)
          }
        })
      },
      prevPage() {
        if(this.page.pageNum > 1) {
          --this.page.pageNum
        }
      },
      nextPage() {
        if(this.page.pageNum * this.page.pageSize < this.pageTotal) {
          ++this.page.pageNum
        }
      },
    },
    watch: {
      'page': {
        handler: function() {
          queryData.pageNum = this.page.pageNum;
          queryList(queryData, this)
        },
        deep: true
      }
    }
  }
</script>

<style>
  .ui-datepicker {
    width: auto;
  }
  .grid-header {
    margin: 15px 0;
  }
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .1);
  }
  .modal-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    padding: 30px;
    background-color: #fafafa;
  }
  .modal-item {
    padding: 5px;
  }
  .search-item label, .modal-item .label {
    width: 80px;
    padding: 0 5px 0 0; 
    text-align: right;
  }
  .search-btns {
    padding: 10px 0 0 0;
    text-align: right;
  }
  .search-btns button {
    margin: 0 15px;
  }
  .verify-item-wrap {
    margin: 0;
  }
  .float-l {
    float: left;
  }
  .pointer {
    cursor: pointer;
    color: skyblue;
  }
  .tobecheck {
    color: green;
  }
  .custom-info {
    padding-top: 10px;
  }
  .custom-info-item {
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .inline-block {
    display: inline-block;
    padding: 0 15px;
  }
  .padding-lr30 {
    padding: 0 30px;
  }
  .pay-voucher {
    max-width: 60%;
    max-height: 200px;
    padding: 10px 0 0 0;
  }
  .verify-item-label, .check-item-label {
    font-weight: bold;
    font-size: 15px;
  }
  .custom-info {
    padding: 10px 30px 0 30px;
  }
  .textarea {
    margin: 10px 30px;
  }
  .textarea textarea {
    max-width: 100%;
  }
  .verify-label {
    padding: 0 15px;
  }
  .flex-s-c {
    display: flex;
    align-items: center;
  }
  .padding-tb10-lr30 {
    padding: 10px 30px;
  }
  .modal-btns {
    padding: 30px 0 0 0;
    text-align: center;
  }
  .fz-16 {
    font-size: 16px;
  }
  .btn-close {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
