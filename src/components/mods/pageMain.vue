<template lang="pug">
  .main-content
    .main-content-inner
      .breadcrumbs.ace-save-state#breadcrumbs
        ul.breadcrumb
          li
            i.ace-icon.fa.fa-home.home-icon
            a(href='#') 首页
          li(v-for='item in breadcrumbs' :key='item.id' :class='{active: item.active}')
            a(:href='item.href') {{item.label}}
      .page-content
        aceSetting
        .page-main
    #footer
</template>
<script>

  export default {
    name: 'pageMain',
    props: [ breadcrumbs ]
  }
  
</script>
