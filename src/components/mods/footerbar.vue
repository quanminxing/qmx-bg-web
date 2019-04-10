<template lang="pug">
  .footerbar.position-absolute
    .handle.footer-left

    .footer-right
      ul.pagination
        li.disabled
          router-link(to='')
            i.ace-icon.fa.fa-angle-double-left
        li(v-for='')
          router-link(to='')

        li
          router-link(to='')
            i.ace-icon.fa.fa-angle-double-right
</template>

<script>
  export default {
    name: 'footerbar',
    props: [  ]
  }
</script>

<style>
  .footerbar {
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #f5f5f5;
  }
</style>


