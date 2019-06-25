<template lang="pug">
  .vh#app
    navbar(:user='user')
    .main-container.ace-save-state.vh#main-container
      sidebar(:user='user')
      .main-content.vh.position-relative
        router-view(@toast='toastShow' :user='user')
        .toast
          .alert.alert-info {{toast}}
      a.btn-scroll-up.btn.btn-sm.btn-inverse#btn-scroll-up(href='#')
        i.ace-icon.fa.fa-angle-double-up.icon-only.bigger-110
    
</template>

<script>
  import navbar from '../src/components/mods/navbar.vue'
  import sidebar from '../src/components/mods/sidebar.vue'
  import { showToast, query } from '@/assets/js/common.js'
  

  try{
    ace.settings.loadState('main-container')
  } catch(e) {}

  export default {
    name: 'App',
    data() {
      return {
        toast: '提示信息！',
        user: {
          position: '欢迎',
          cname: ''
        }
      }
    },
    components: {
      navbar,
      sidebar,
    },
    mounted() { 
      console.log('app mouted');
      this.$nextTick(function() {
        console.log('app nextTick');
        
      })

      query('/api/user/me').then(res => {
        console.log('获取用户信息成功')
        console.log(res)
        // this.user.position = '非管理员'
        this.user.position = res.data.user.position
        this.user.cname = res.data.user.cname
      }).catch(err => {
        console.log('获取用户信息错误')
      })
    },
    methods:{
      toastShow(msg, time = 2000) {
        console.log(msg);
        console.log('000000000000000000000000000000000000000');
        
        this.toast = msg;
        showToast($('.toast'), time)
      }
    }
  }

</script>

<style>
  #app {
    padding: 0 0 50px 0;
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

  
.toast {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  text-align: center;
}

.toast .alert {
  display: inline-block;
  position: fixed;
  width: 50%;
  margin-top: 200px;
  text-align: center;
  transform: translateX(-50%);
}
.pointer {
  cursor: pointer;
}

</style>