<template lang="pug">
  //- navbar
  .sidebar.responsive.ace-save-state.sidebar-fixed#sidebar
    //- sidebar 列表
    ul.nav.nav-list
      li.active.top-menu(@click='menuActive')
        a(href='/manager/index')
          i.menu-icon.fa.fa-home
          span 首页
        b.arrow
      li.top-menu(v-for="item in sidebars" :key="item.id" @click='menuActive')
        router-link( v-if="item.vueSide" :to="item.href" :class='{"dropdown-toggle": item.submenus.length > 0}')
          i.menu-icon.fa(:class='item.icon')
          span.menu-text {{ item.label }}
          b.arrow.fa.fa-angle-down(v-if="item.submenus.length > 0")
        a(v-else :href="item.href" :class='{"dropdown-toggle": item.submenus.length > 0}')
          i.menu-icon.fa(:class='item.icon')
          span.menu-text {{ item.label }}
          b.arrow.fa.fa-angle-down(v-if="item.submenus.length > 0")
        b.arrow
        ul.submenu(v-if="item.submenus.length > 0")
          li.sub-menu(v-for="submenu in item.submenus" :key='submenu.id' @click.stop='menuActive')
            router-link(v-if="item.vueSide" :to='submenu.href')
              i.menu-icon.fa.fa-caret-right
              span {{submenu.label}}
            a(v-else :href="submenu.href")
              i.menu-icon.fa.fa-caret-right
              span {{submenu.label}}
            b.arrow
    //- 收起按钮
    .sidebar-toggle.sidebar-collapse#sidebar-collapse
      i.ace-icon.fa.fa-angle-double-left.ace-save-state#sidebar-toggle-icon(data-icon1='ace-icon fa fa-angle-double-left' data-icon2='ace-icon fa fa-angle-double-right')
</template>

<script>
  console.log('sidebar');
  

  const sidebars = [
    {
      id: 1,
      label: '扩展',
      active: false,
      icon: 'fa-cogs',
      href: '/',
      vueSide: true,
      submenus: []
    },
    {
      id: 2,
      label: '视频管理',
      active: false,
      icon: 'fa-film',
      href: '/videos/videos',
      vueSide: true,
      submenus: []
    },
    {
      id: 3,
      label: '视频属性管理',
      active: false,
      icon: 'fa-list',
      href: '',
      vueSide: false,
      submenus: [
        {
          id: 31,
          label: '类目管理',
          href: '/manager/category',
          vueSide: false,
        },
        {
          id: 32,
          label: '平台管理',
          href: '/manager/platform',
          vueSide: false,
        },
        {
          id: 33,
          label: '栏目管理',
          href: '/manager/column',
          vueSide: false,
        },
        {
          id: 34,
          label: '功能管理',
          href: '/manager/usage',
          vueSide: false,
        },
        {
          id: 35,
          label: '风格管理',
          href: '/manager/style',
          vueSide: false,
        },
      ]
    },
    {
      id: 4,
      label: '套餐管理',
      active: false,
      icon: 'fa-credit-card',
      href: '/manager/package',
      vueSide: false,
      submenus: []
    },
    {
      id: 5,
      label: '颗粒度管理',
      active: false,
      icon: 'fa-barcode',
      href: '/manager/key',
      vueSide: false,
      submenus: []
    },
    {
      id: 6,
      label: '商家管理',
      active: false,
      icon: 'fa-users',
      href: '/manager/business',
      vueSide: false,
      submenus: []
    },
    {
      id: 7,
      label: '订单管理',
      active: false,
      icon: 'fa-pencil-square-o',
      href: '/manager/bill',
      vueSide: false,
      submenus: []
    },
    {
      id: 8,
      label: '人员管理',
      active: false,
      icon: 'fa-key',
      href: '/manager/people',
      vueSide: false,
      submenus: []
    },
    {
      id: 9,
      label: '小程序配置',
      active: false,
      icon: 'fa-comments',
      href: '',
      vueSide: true,
      submenus: [
        {
          id: 91,
          label: 'banner配置',
          href: '/wechat/banner',
          vueSide: true,
        },
        {
          id: 92,
          label: '频道配置',
          href: '/wechat/channel',
          vueSide: true,
        },
        {
          id: 93,
          label: '价格配置',
          href: '/wechat/prices',
          vueSide: true,
        },
        {
          id: 94,
          label: '推荐配置',
          href: '/manager/recommand',
          vueSide: false,
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
        $('#sidebar li.open').removeClass('open');

        if($currentTarget.hasClass('sub-menu')) {
          
          $currentTarget.parents('li').first().addClass('active open')
        }

        $currentTarget.addClass('active');
      },
      submenuActive(e) {

      }
    }
  }
</script>
