<template lang='pug'>
  .grid
    .grid-header.row
      .col-xs-4
        label.page-size 显示
          select.input-sm(v-model='pagesize')
            option(v-for='item in [20, 30, 50, 100]' :value='item') {{item}}
          span 条
      .tbn-group.col-xs-8
        button.btn.btn-white.btn-info.margin-lr5#search-btn(@click='clickSearch') 搜索 
          i.ace-icon.fa.fa-search.bigger-120.blue
        router-link(:to='{name: editUrl, params: { oper: "add" }}') 
          button.btn.btn-info.btn-sm 添加 
            i.ace-icon.fa.fa-print.align-top.bigger-120.icon-on-right
    .grid-content
      table.table.table-bordered.table-hover#simple-table
        thead
          tr
            th.center
              label.pos-rel
                input.ace(type='checkbox')
                span.lbl
            th.center(v-for='(colName, index) in colNames' :key='index') {{colName}}
            th.center 操作
        tbody
          tr(v-for='(data, index) in datas' :key='index')
            td.center
              label.pos-rel
                input.ace(type='checkbox')
                span.lbl
            td.center(v-for='(value, key) in data' :key='key' v-if='key !== "origin"') {{value}}
            td.center
              div.btn-group
                router-link.blue.space(:to='{name: editUrl, params: data.origin}')
                  i.ace-icon.fa.fa-pencil.bigger-120
                a.red.space.pointer(@click='delData(data.id, data.index, delUrl)')
                  i.ace-icon.fa.fa-trash-o.bigger-120
                a.red.space.pointer(v-if='!!stickTop' @click='toTop')
                  i.ace-icon.far.fa-arrow-alt-to-top.bigger-120
    .grid-footer
      ul.pager
        li.disabled
          a(href='#')
            i.ace-icon.fa.fa-angle-double-left
        li.space 第 {{}} 页
        li.space 共 {{}} 页
        li
          a(href='#')
            i.ace-icon.fa.fa-angle-double-right
    .search-box
      .search-box-content
        .search-item(v-if='!!searchItems' v-for='(searchItem, index) in searchItems' :key='searchItem.name + index')
          label {{searchItem.label}}
          input(type='text' v-model='searchItem.value' :key='searchItem.name + "search"')
</template>

<script>
  import { query } from '@/assets/js/common.js'

  console.log(query);
  

  export default {
    name: 'grid',
    props: [ 'colNames', 'datas', 'editUrl', 'delUrl', 'stickTop', 'searchItems' ],
    data() {
      return {
        pagesize: 20
      }
    },
    watch: {
      pagesize: function(val) {
        this.$emit('choosePagesize', val)
      }
    },
    methods: {
      // 删除记录
      delData(dataId, dataIndex, url) {
        // console.log(id);
        query(url, 'POST', { id: dataId })
        .then(() => {
          console.log(url)

          this.$props.datas.splice(dataIndex, 1)
        })
        .catch((err) => {
          console.log(err);
        })
      },
      clickSearch() {
        $('.search-box').toggleClass('show')
      },
      // 置顶
      toTop() {

      }
    },
    computed: {
    },
    mounted() {
      let active_class = 'active';
      $('th input[type=checkbox], td input[type=checkbox]').prop('checked', false);
      $('#simple-table > thead > tr > th input[type=checkbox]').eq(0).on('click', function(){
        let th_checked = this.checked;//checkbox inside "TH" table header
        
        $(this).closest('table').find('tbody > tr').each(function(){
          let row = this;
          if(th_checked) $(row).addClass(active_class).find('input[type=checkbox]').eq(0).prop('checked', true);
          else $(row).removeClass(active_class).find('input[type=checkbox]').eq(0).prop('checked', false);
        });
      });
      $('#simple-table').on('click', 'td input[type=checkbox]' , function(){
        let $row = $(this).closest('tr');
        if($row.is('.detail-row ')) return;
        if(this.checked) $row.addClass(active_class);
        else $row.removeClass(active_class);
      });
    }
  }
</script>

<style>
  .grid-header .page-size select {
    display: inline-block;
    width: auto;
    margin: 0 5px;
  }
  .grid-header {
    padding: 12px;
  }
  .tbn-group {
    text-align: right;
  }
  .show {
    display: block;
  }
  .hide {
    display: none;
  }
  .search-box {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
  }
  .search-box-content {
    width: 68%;
    margin: 200px auto;
    padding: 50px 30px;
    background-color: #f5f5f5;
  }
</style>
