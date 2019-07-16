<template lang='pug'>
  .grid
    .grid-header.row
      .col-xs-4
        label.page-size 显示
          select.input-sm(v-model='page.pageSize')
            option(v-for='item in pageSizeRange' :value='item' :key='item + "pagerange"') {{item}}
          span 条
      .btn-group.col-xs-8.align-right
        span
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
            td.center(v-for='(value, key) in data' :key='key' v-if='key !== "origin"' @click='key==="is_top" ? toTop(data) : ""' :class='key==="is_top" ? "blue pointer" : ""') {{key === 'is_top' ? (value ? '取消置顶' : '置顶'): value}}
            td.center
              div.btn-group
                router-link.blue.space(:to='{name: editUrl, params: data.origin}')
                  i.ace-icon.fa.fa-pencil.bigger-120
                a.red.space.pointer(@click='delData(data.id, index, delUrl, $event)')
                  i.ace-icon.fa.fa-trash-o.bigger-120
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
    .search-box(v-if='!!searchItems')
      .search-box-content
        .text.row
          .search-item.col-sm-6.col-xs-12(v-if='!!searchItems.text' v-for='(textItem, index) in searchItems.text' :key='textItem.key + index')
            label {{textItem.label}}: 
            input(:type='textItem.type || "text"' v-model='textItem.value' :key='textItem.key + "search"')
        .select.row
          .search-item.col-sm-6.col-xs-12(v-if='!!searchItems.select' v-for='(selectItem, index) in searchItems.select' :key='selectItem.key + index')
            label {{selectItem.label}}: 
            select(v-model='selectItem.value')
              option.hide(value=-1) --请选择--
              option(v-for='(option, index) in selectItem.options' :key='option.id + option.name + index' :value='option.id') {{option.name}}
        .search-btns.row
          button(type='reset').btn.btn-info.btn-sm.float-l(@click='reset') 重置
          button.btn.btn-default.btn-sm(@click='searchHide') 取消
          button.btn.btn-success.btn-sm(@click='search') 确定
</template>

<script>
  import { query } from '@/assets/js/common.js'

  console.log(query);

  export default {
    name: 'grid',
    props: [ 'colNames', 'datas', 'editUrl', 'delUrl', 'stickTop', 'searchItems', 'page', 'pageSizeRange', 'pageTotal'],
    methods: {
      // 删除数据
      delData(dataId, dataIndex, url, eq) {
        let that = this;
        bootbox.confirm({
          message: '确定删除？',
          buttons: {
            confirm: {
              label: '确定',
              className: 'btn-success btn-sm'
            },
            cancel: {
              label: '取消',
              className: 'btn-sm'
            }
          },
          callback: function(result) {
            if(result) {
              console.log({ids: [dataId]})
              query(url, 'POST', {ids: [dataId]})
              .then((res) => {
                console.log(res)

                that.$props.datas.splice(dataIndex, 1)
              })
              .catch((err) => {
                console.log(err);
              })
            }
          }
        })
      },
      prevPage() {
        if(this.$props.page.pageNum > 1) {
          --this.$props.page.pageNum
        }
        
      },
      nextPage() {
        console.log(this.$props.page.pageNum)
        console.log(Math.ceil(this.$props.pageTotal / this.$props.page.pageSize))
        if(this.$props.page.pageNum < Math.ceil(this.$props.pageTotal / this.$props.page.pageSize)) {
          ++this.$props.page.pageNum
        }
        
      },
      clickSearch() {
        $('.search-box').addClass('show')
      },
      
      searchHide(e) {
        console.log(e);
        
        $(e.currentTarget).parents('.search-box').removeClass('show')
      },
      reset() {
        let searchItems = this.$props.searchItems;
        for(let key in searchItems) {
          if(key === 'text') {
            searchItems[key].forEach(text => {
              text.value = '';
            });
          } else if(key === 'select') {
            searchItems[key].forEach(text => {
              text.value = -1;
            });
          }
          
        }
      },
      search(e) {
        $(e.currentTarget).parents('.search-box').removeClass('show')
        this.$emit('search')
      },
      toTop(data) {
        console.log(data)
        this.$emit('toTop', { id: data.id, is_top: !data.is_top })
        
      }

    },
    computed: {
    },
    mounted() {
      let active_class = 'active';
      $('th input[type=checkbox], td input[type=checkbox]').prop('checked', false);
      $('#simple-table > thead > tr > th input[type=checkbox]').eq(0).on('click', function(){
        let th_checked = this.checked;
        
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
  .pointer {
    cursor: pointer;
  }
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
    height: 100%;
    background-color: rgba(0, 0, 0, .1);
  }
  .search-box-content {
    width: 68%;
    margin: 100px auto;
    padding: 30px;
    background-color: #f5f5f5;
  }
  .search-item {
    padding: 10px;
  }
  .search-item label {
    width: 120px;
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
  .float-l {
    float: left;
  }

  .del-msg {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: blue;
    color: #fff;
  }
</style>
