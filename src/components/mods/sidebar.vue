<template lang="pug">
  //- navbar
  .sidebar.responsive.ace-save-state.sidebar-fixed#sidebar
    //- sidebar 列表
    ul.nav.nav-list
      li.active.top-menu(@click='menuActive')
        router-link(to='/')
          i.menu-icon.fa.fa-home
          span 首页
        b.arrow
      li.top-menu(v-for="item in sidebars" :key="item.id" @click='menuActive')
        router-link(:to="item.href" :class='{"dropdown-toggle": item.submenus.length > 0}')
          i.menu-icon.fa(:class='item.icon')
          span.menu-text {{ item.label }}
          b.arrow.fa.fa-angle-down(v-if="item.submenus.length > 0")
        b.arrow
        ul.submenu(v-if="item.submenus.length > 0")
          li.sub-menu(v-for="submenu in item.submenus" :key='submenu.id' @click.stop='menuActive')
            router-link(:to='submenu.href')
              i.menu-icon.fa.fa-caret-right
              span {{submenu.label}}
            b.arrow
    //- 收起按钮
    .sidebar-toggle.sidebar-collapse#sidebar-collapse
      i.ace-icon.fa.fa-angle-double-left.ace-save-state#sidebar-toggle-icon(data-icon1='ace-icon fa fa-angle-double-left' data-icon2='ace-icon fa fa-angle-double-right')
</template>

<script>
  try{ace.settings.loadState('sidebar')}catch(e){}

  console.log('sidebar');
  

  const sidebars = [
    {
      id: 1,
      label: 'admin管理员',
      active: false,
      icon: 'fa-cogs',
      href: '/',
      submenus: []
    },
    {
      id: 2,
      label: '视频管理',
      active: false,
      icon: 'fa-film',
      href: '/videos',
      submenus: []
    },
    {
      id: 3,
      label: '视频属性管理',
      active: false,
      icon: 'fa-list',
      href: '',
      submenus: [
        {
          id: 31,
          label: '类目管理',
          href: '/',
        },
        {
          id: 32,
          label: '平台管理',
          href: '/',
        },
        {
          id: 33,
          label: '栏目管理',
          href: '/',
        },
        {
          id: 34,
          label: '功能管理',
          href: '/',
        },
        {
          id: 35,
          label: '风格管理',
          href: '/',
        },
      ]
    },
    {
      id: 4,
      label: '套餐管理',
      active: false,
      icon: 'fa-credit-card',
      href: '/',
      submenus: []
    },
    {
      id: 5,
      label: '颗粒度管理',
      active: false,
      icon: 'fa-barcode',
      href: '/',
      submenus: []
    },
    {
      id: 6,
      label: '商家管理',
      active: false,
      icon: 'fa-users',
      href: '/',
      submenus: []
    },
    {
      id: 7,
      label: '订单管理',
      active: false,
      icon: 'fa-pencil-square-o',
      href: '/',
      submenus: []
    },
    {
      id: 8,
      label: '人员管理',
      active: false,
      icon: 'fa-key',
      href: '/',
      submenus: []
    },
    {
      id: 9,
      label: '小程序配置',
      active: false,
      icon: 'fa-comments',
      href: '',
      submenus: [
        {
          id: 91,
          label: 'banner配置',
          href: '/wechat/banner',
        },
        {
          id: 92,
          label: '频道配置',
          href: '/wechat/channel',
        },
        {
          id: 93,
          label: '价格配置',
          href: '/wechat/prices',
        },
        {
          id: 94,
          label: '推荐配置',
          href: '/wechat/recommend',
        },
      ]
    },
  ]

  export default {
    name: 'sidebar',
    data() {
      return {
        sidebars
      }
    },
    methods: {
      menuActive(e) {
        let $currentTarget = $(e.currentTarget);

        $('#sidebar li.active').removeClass('active')

        if($currentTarget.hasClass('sub-menu')) {
          // $('#sidebar li.open').removeClass('open');
          $currentTarget.parents('li').first().addClass('active open')
        }

        $currentTarget.addClass('active');
      },
      submenuActive(e) {

      }
    }
  }
</script>
