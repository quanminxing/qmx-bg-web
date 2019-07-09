<template lang="pug">
  .main-content-inner
    breadcrumbs(v-bind:breadcrumbs='pagemenu')
    .page-content.row
      .page-main.col-xs-12
        .date-start.date-item
          label 开始日期：
          input.datepicker#start-date(type='text' readonly v-model='startDate')
        .date-end.date-item
          label 截止日期：
          input.datepicker#end-date(type='text' readonly v-model='endDate')
        .export.date-item
          button.btn.btn-success(@click='exportData') 导出
</template>

<script>
  import breadcrumbs from '../mods/breadcrumbs.vue';
  import { query, showToast } from '@/assets/js/common.js';

  const formatNumber = function(num) {
    num = num + '';

    return num[1] ? num : '0' + num;
  }
  const getDaysAgo = function(days) {
    
    let thisDate = new Date();
    let dateAgo = new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate() - days);

    console.log(dateAgo.getFullYear())
    console.log(dateAgo.getMonth())
    console.log(dateAgo.getDate())

    return `${dateAgo.getFullYear()}-${formatNumber(dateAgo.getMonth()+1)}-${formatNumber(dateAgo.getDate())}`
  }
  const domain = 'https://test.qmxpower.com'
  // const domain = 'https://admin.qmxpower.com'

  export default {
    data() {
      return {
        pagemenu: [
          {
            id: 1,
            label: '导出需求简表填写统计',
            href: '',
            active: true
          }
        ],
        startDate: getDaysAgo(30),
        endDate: getDaysAgo(0)
      }
    },
    components: {
      breadcrumbs
    },
    mounted() {
      let that = this
      $(function() {
        const setDatePicker = function(datepickerName, onClose) {
          $(datepickerName).datepicker({
            dateFormat: 'yy-mm-dd',
            dayNamesMin: ['一', '二', '三', '四', '五', '六', '七'],
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            showOtherMonths: true,
            selectOtherMonths: true,
            onClose
          })
        }

        setDatePicker('#start-date', date => {
          that.startDate = date
        })
        setDatePicker('#end-date', date => {
          that.endDate = date
        })


        // $('#start-date').datepicker({
        //   dateFormat: 'yy-mm-dd',
        //   dayNamesMin: ['一', '二', '三', '四', '五', '六', '七'],
        //   monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        //   showOtherMonths: true,
        //   selectOtherMonths: true,
        //   onClose: (e) => {
        //     console.log(e)
        //   }
        // })
      })

    },
    methods: {
      exportData() {
        let that = this;
        
        window.location.href = 'https://test.qmxpower.com/api/bill/getSaleReport?timeUp=' + that.endDate + '&timeDown=' + that.startDate
      }
    }
  }
</script>
<style>
  .date-item {
    display: inline-block;
    padding: 30px 50px 0 0;
  }
</style>
