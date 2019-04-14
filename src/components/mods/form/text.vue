<template lang="pug">
  .info.row(v-if='!!infoText' v-for='(item, index) in infoText' :key='item.idName + index')
    label.label-txt.info-left
      i.require-icon(v-if='item.required') * 
      span {{item.label}}
    .info-right
      input.input(:id='item.idName' type='text' :placeholder='item.placeholder' :required='item.required' v-model='values[item.idName]' :key='item.idName')
</template>

<script>
  export default {
    name: 'formText',
    props: [infoText]
  }
</script>
