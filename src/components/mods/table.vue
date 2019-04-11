<template lang='pug'>
  .grid
    .grid-header header
    .grid-content
      table.table.table-striped.table-bordered.table-hover#sample-table-2
        thead
          tr
            th.center(v-if='checkbox')
              label.position-relative
                input.ace(type='checkbox')
                span.bl
            th(v-for='' :key='') {{}}
            th 操作
        tbody
          tr
            td.center(v-if='checkbox')
              label.position-relative
                input.ace(type='checkbox')
                span.bl
            td(v-for='' :key='') {{}}
            td
              div.action-buttons
                router-link.blue(to='')
                  i.ace-icon.fa.fa-pencil.bigger-130
                span.red
                  i.ace-icon.fa.fa-trash-o.bigger-130
    .grid-footer footer
</template>
