<template lang="pug">
  //- 设置按钮
  .ace-settings-container#ace-settings-container
    //- 图标
    div#ace-settings-btn.btn.btn-app.btn-xs.btn-warning.ace-settings-btn
      i.ace-icon.fa.fa-cog.bigger-130
    //- 选项
    div#ace-settings-box.ace-settings-box.clearfix
      .ace-settings-item
        .pull-left
          select.hide#skin-colorpicker
            option(value="#438EB9" data-skin="default") #438EB9
            option(value="#222A2D" data-skin="skin-1") #222A2D
            option(value="#C6487E" data-skin="skin-2") #C6487E
            option(value="#D0D0D0" data-skin="skin-3") #D0D0D0
        span  选择皮肤
      .ace-settings-item
        input.ace.ace-checkbox-2.ace-save-state#ace-settings-navbar(type='checkbox' autocomplete='off')
        label.lbl(for='ace-settings-navbar') 固定导航条
      .ace-settings-item
        input.ace.ace-checkbox-2.ace-save-state#ace-settings-sidebar(type='checkbox' autocomplete='off')
        label.lbl(for='ace-settings-sidebar') 固定侧边栏
      .ace-settings-item
        input.ace.ace-checkbox-2.ace-save-state#ace-settings-breadcrumbs(type='checkbox' autocomplete='off')
        label.lbl(for='ace-settings-breadcrumbs') 固定面包屑
      .ace-settings-item
        input.ace.ace-checkbox-2.ace-save-state#ace-settings-add-container(type='checkbox' autocomplete="off")
        label.lbl(for='ace-settings-add-container') 页面切换宅屏
          b
      .ace-settings-item
        input.ace.ace-checkbox-2.ace-save-state#ace-settings-hover(type='checkbox' autocomplete='off')
        label.lbl(for='ace-settings-hover') 二级菜单悬停显示
      .ace-settings-item
        input.ace.ace-checkbox-2.ace-save-state#ace-settings-compact(type='checkbox' autocomplete='off')
        label.lbl(for='ace-settings-compact') 窄式侧边栏
      .ace-settings-item
        input.ace.ace-checkbox-2.ace-save-state#ace-settings-highlight(type='checkbox' autocomplete='off')
        label.lbl(for='ace-settings-highlight') 菜单选中图标
</template>

<script>
  jQuery(function($) {
    $('#ace-settings-btn').on('click', function() {
      console.log('11111');
      
    })
  })
  
  export default {
    name: 'aceSetting'
  }
</script>
