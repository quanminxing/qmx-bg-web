<template lang="pug">
  .breadcrumbs.ace-save-state#breadcrumbs
    ul.breadcrumb
      li
        i.ace-icon.fa.fa-home.home-icon
        a(href='#') 首页
      li(v-for='item in breadcrumbs' :key='item.id' :class='{active: item.active}')
        a(:href='item.href') {{item.label}}
</template>

<script>
export default {
  props: [breadcrumbs],
  name: breadcrumbs
}
</script>

