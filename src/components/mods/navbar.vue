<template lang="pug">
  //- navbar 组件
  #navbar.navbar.navbar-default.ace-save-state
    .navbar-container.ace-save-state#navbar-container
      //- 菜单隐藏时的按钮
      button.navbar-toggle.menu-toggle.pull-left#menu-toggle(type="button" data-target="#sidebar")
        span.sr-only 隐藏菜单
        span.icon-bar
        span.icon-bar
        span.icon-bar
      
      //- navbar:left
      .navbar-header.pull-left
        a.navbar-brand(href="#")
          small
            i.fa.fa-leaf 全民星-后台管理
      
      //- navbar:right
      .navbar-buttons.navbar-header.pull-right(role="navigation")
        ul.nav.ace-nav
          li.light-blue.dropdown-modal
            a.dropdown-toggle(href="#" data-toggle="dropdown")
              img.nav-user-photo(src="../../../static/ace/images/avatars/admin.png" alt="管理员")
              span.user-info
                small 欢迎
                span  admin
              i.ace-icon.fa.fa-caret-down
            //- 下拉列表
            ul.user-menu.dropdown-menu-right.dropdown-menu.dropdown-yellow.dropdown-caret.dropdown-close
              li
                a(href="#")
                  i.ace-icon.fa.fa-cog
                  span 设置
              li
                a(href="#")
                  i.ace-icon.fa.fa-user
                  span 个人信息
              li.divider
              li
                a(href="#")
                  i.ace-icon.fa.fa-power-off
                  span 退出
            
</template>

<script>
  export default {
    name: 'navbar'
  }
</script>
