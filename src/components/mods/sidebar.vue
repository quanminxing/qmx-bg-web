<template lang="pug">
  //- navbar
  .sidebar.responsive.ace-save-state.sidebar-fixed#sidebar
    //- sidebar 列表
    ul.nav.nav-list
      li(v-for="item in sidebars" :key="item.id" :class="{active: item.active}")
        a(:href="item.href" :class='{"dropdown-toggle": item.submenu !== undefined}')
          i.menu-icon.fa(:class='item.icon')
          span.menu-text {{ item.label }}
          b.arrow.fa.fa-angle-down(v-if="item.submenu !== undefined")
        b.arrow
        ul.submenu(v-if="item.submenu !== undefined")
          li(v-for="subItem in item.submenu" :key='subItem.id' :class='{ active: subItem.active }')
            a(:href='subItem.href')
              i.menu-icon.fa.fa-caret-right
              span {{subItem.label}}
            b.arrow
    //- 收起按钮
    .sidebar-toggle.sidebar-collapse#sidebar-collapse
      i.ace-icon.fa.fa-angle-double-left.ace-save-state#sidebar-toggle-icon(data-icon1='ace-icon fa fa-angle-double-left' data-icon2='ace-icon fa fa-angle-double-right')
</template>

<script>
  try{ace.settings.loadState('sidebar')}catch(e){}

  export default {
    name: 'sidebar',
    data() {
      return {
        sidebars: [
          {
            id: 1,
            label: ' 小程序',
            active: true,
            icon: 'fa-cogs',
            href: '#',
            submenu: [
              {
                id: 1,
                label: 'banner 配置',
                active: true,
                href: '#',
              }
            ]
          },
          {
            id: 2,
            label: ' 频道',
            active: false,
            icon: 'fa-cogs',
            href: '#',
            submenu: [
              {
                id: 1,
                label: '频道配置',
                active: false,
                href: '#',
              }
            ]
          }
        ]
      }
    }
  }
</script>
