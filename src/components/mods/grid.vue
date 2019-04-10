<template lang='pug'>
  .grid
    .grid-header.row
      .col-xs-4
        .dataTables_length#dynamic-table_length
          label 显示
            select.form-control.input-sm(name='dynamic-table_length' aria-controls='dynamic-table')
              option(v-for='item in [10, 10, 50, 100]' :value='item') {{item}}
            span 条
      .col-xs-8
        button.btn.btn-white.btn-info.btn-bold 搜索
          i.ace-icon.fa.fa-trash-o.bigger-120.blue
        button.btn.btn-info 添加
          i.ace-icon.fa.fa-print.align-top.bigger-120.icon-on-right
    .grid-content
      table.table.table-striped.table-bordered.table-hover#sample-table-2
        thead
          tr
            th.center
              label.position-relative
                input.ace(type='checkbox')
                span.lbl
            th.center(v-for='(colName, index) in colNames' :key='index') {{colName}}
            th.center 操作
        tbody
          tr(v-for='(data, index) in datas' :key='index')
            td.center
              label.position-relative
                input.ace(type='checkbox')
                span.lbl
            td.center(v-for='(value, key) in data' :key='key') {{value}}
            td.center
              div.action-buttons
                router-link.blue(:to='editUrl')
                  i.ace-icon.fa.fa-pencil.bigger-130

                span.red
                  i.ace-icon.fa.fa-trash-o.bigger-130
    .grid-footer footer
</template>

<script>
  export default {
    name: 'grid',
    props: [ 'colNames', 'datas', 'editUrl' ]
  }
</script>