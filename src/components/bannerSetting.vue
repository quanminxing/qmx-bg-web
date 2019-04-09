<template lang="pug">
  .main-content
    .main-content-inner
      breadcrumbs(:breadcrumbs='breadcrumbs')
      .page-content
        .page-main
    footer
</template>

<script>
  import breadcrumbs from './mods/breadcrumbs.vue'
  import footer from './mods/footer.vue'

  export default {
    name: bannerSetting,
    data() {
      return {
        breadcrumbs: [  // 面包屑导航
          {
            id: 1,
            label: '',
            href: '',
            active: false
          }
        ],

      }
    },
    components: {
      breadcrumbs,
      footer
    }
  }
</script>

