<template lang="pug">
  #app
    router-view(name="navbar")
    .main-container.ace-save-state#main-container
      router-view(name='sidebar')
      .main-content
        .main-content-inner
          slot(name='breadcrumbs')
          .page-content
            router-view(name='aceSetting')
            .page-main
      a.btn-scroll-up.btn.btn-sm.btn-inverse#btn-scroll-up(href='#')
        i.ace-icon.fa.fa-angle-double-up.icon-only.bigger-110
</template>

<script>
  try{
    ace.settings.loadState('main-container')
  } catch(e) {}

  export default {
    name: 'App'
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
