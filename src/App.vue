<template lang="pug">
  .vh#app
    navbar
    .main-container.ace-save-state.vh#main-container
      sidebar
      router-view
      a.btn-scroll-up.btn.btn-sm.btn-inverse#btn-scroll-up(href='#')
        i.ace-icon.fa.fa-angle-double-up.icon-only.bigger-110
</template>

<script>
  import navbar from '../src/components/mods/navbar.vue'
  import sidebar from '../src/components/mods/sidebar.vue'
  

  try{
    ace.settings.loadState('main-container')
  } catch(e) {}

  export default {
    name: 'App',
    components: {
      navbar,
      sidebar,
    },
    mounted() {
      

      console.log('app mouted');
      this.$nextTick(function() {
        console.log('app nextTick');
        
      })
    }
  }

</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .vh {
    height: 100%;
  }

  .space{
    padding: 0 4px;
  }
  .pointer {
    cursor: pointer;
  }
  .margin-lr5 {
    margin: 0 5px;
  }
  .color-fff {
    color: #fff;
  }

</style>