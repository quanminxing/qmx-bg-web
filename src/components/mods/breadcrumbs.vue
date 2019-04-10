<template lang="pug">
  .breadcrumbs.ace-save-state#breadcrumbs
    ul.breadcrumb
      li(v-for='item in breadcrumbs' :key='item.id' :class='[!!item.active ? "active" : ""]')
        span(v-if='item.active') {{item.label}}
        router-link(v-else :to='item.href') {{item.label}}
        
</template>

<script>
  console.log('breadcrumbs');
  

  export default {
    name: 'breadcrumbs',
    props: [ 'breadcrumbs' ],
  }
</script>

