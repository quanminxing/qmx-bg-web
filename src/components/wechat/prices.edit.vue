<template lang="pug">
  .main-content-inner.pos-rel
    breadcrumbs(v-bind:breadcrumbs="pagemenu")
    .form
      form.edit-content.page-main.col-xs-12
        .info.row(v-show='!!values.id')
          label.label-txt.info-left 
            span ID
          .info-right
            input.input(disabled v-model='values.id')
        //- text 类型表单
        .info.row(v-if='!!infoText' v-for='(item, index) in infoText' :key='item.idName + index')
          label.label-txt.info-left
            i.require-icon(v-if='item.required') * 
            span {{item.label}}
          .info-right
            input.input(:id='item.idName' :type='[!!item.type ? item.type : "text"]' :placeholder='item.placeholder' :required='item.required' v-model='values[item.idName]' :key='item.idName')
        //- select 类型表单
        .info.row(v-if='!!infoSelect' v-for='(item, index) in infoSelect' :key='item.idName + index')
          label.label-txt.info-left
            i.require-icon(v-if='item.required') * 
            span {{item.label}}
          .info-right
            select.select(:id='item.idName' :required='item.required' v-model='values[item.idName]')
              option.hide(value=-1 selected disabled) --请选择--
              option(v-for='option in item.options' :key='option.id' :value='option.id') {{option.name}}
        .info.row(v-if='!!channel.groups.length > 0')
          label.label-txt.info-left.align-top
            i.require-icon(v-if='channel.required') * 
            span {{channel.label}}
          .checkbox-groups.info-right.align-top(v-for='(group, index) in channel.groups' :key='group.name + index')
            input(type='checkbox' v-if='group.isShow' :name='group.name' v-model='group.value') 
            span(v-if='group.isShow') {{group.label}}
            .checkbox-groups-wrap
              .checkbox-group(v-show='group.value')
                .checkbox-group-item(v-for='(checkbox, index) in group.checkboxs' :key='checkbox.key + index')
                  input(type='checkbox' v-model='checkbox.checked')
                  span {{checkbox.key}}
      .edit-btns
        button.btn.btn-md.btn-success#save(@click='save' type='submit') 保存
        router-link.btn.btn-default.btn-md#cancel(to='/wechat/prices') 取消
</template>

<script>
  import breadcrumbs from '../mods/breadcrumbs.vue'
  import { query, urlProperty, codeTransform, showToast } from '@/assets/js/common.js'

  // 面包屑
  let pagemenu = [
    {
      id: 1,
      label: '小程序配置',
      href: '',
    },
    {
      id: 2,
      label: '价格配置',
      href: '/wechat/prices'
    },
    {
      id: 3,
      label: '编辑',
      href: '',
      active: true
    }
  ];

  let infoText = [
    {
      label: '名称',
      idName: 'name',
      placeholder: '请填写名称',
      required: true
    },
    {
      label: '价格上限',
      idName: 'max',
      placeholder: '请填写价格上限',
      required: false,
      type: 'number'
    },
    {
      label: '价格下限',
      idName: 'min',
      placeholder: '请填写价格下限',
      required: false,
      type: 'number'
    },
    {
      label: '排序',
      idName: 'weight',
      placeholder: '排序',
      required: true,
      type: 'number'
    },
    {
      label: '备注',
      idName: 'comment',
      placeholder: '备注',
      required: false
    }
  ];

  let infoSelect = [
    {
      label: '状态',
      required: true,
      idName: 'is_show',
      options: [{
        id: 0,
        name: '不显示'
      },{
        id: 1,
        name: '显示'
      }]
    }
  ];

  let channel = {
    label: '关联频道',
    required: false,
    idName: 'channel_ids',
    groups: [
      {
        name: 'channel',
        label: 'channel',
        value: true,
        isShow: false,
        checkboxs: []
      }
    ]
  }

  export default {
    name: 'wechatBannerEdit',
    data() {
      return {
        pagemenu,
        infoText,
        infoSelect,
        channel,
        values: {
          oper: 'add',
          id: '',
          name: null,
          max: '',
          min: '',
          weight: '',
          is_show: -1,
          channel_ids: null,
          comment: ''
        }
      }
    },
    components:{
      breadcrumbs,
    },
    mounted() {
      // 绑定初始数据
      let initData = this.$route.params;
      console.log(initData);

      let channel_ids = initData.channel_ids;

      // 关联频道 ??????????????????????
      query('/api/channel', 'GET').then(res => {
        this.channel.groups[0].checkboxs = res.data.map(channelItem => {
          if(!!channel_ids) {
            let length = channel_ids.length;
            for(let i = 0; i < length; i++) {
              if(channelItem.value === channel_ids[i]) {
                channelItem.checked = true;
                break;
              } else {
                channelItem.checked = false;
              }
            }
          } else {
            channelItem.checked = false
          }
          
          return channelItem
        })
      })
      /* this.channel.groups[0].checkboxs =  codeTransform('channel').map(channelItem => {
        if(!!channel_ids) {
          let length = channel_ids.length;
          for(let i = 0; i < length; i++) {
            if(channelItem.value === channel_ids[i]) {
              channelItem.checked = true;
              break;
            } else {
              channelItem.checked = false;
            }
          }
        } else {
          channelItem.checked = false
        }
        
        return channelItem
      }); */
      
      this.values = {...initData}

    },
    methods: {

      // 保存
      save() {
        console.log(this.values);
        
        if(this.values.is_show === -1 || !this.values.name || !this.values.weight) {
          console.log('-111111111111');
          // this.toast = '请输入完整信息！'
          // showToast($('.toast'))
          this.$emit('toast', '请输入完整信息！')
        } else {
          let data = this.values;
          let channel_ids = []

          this.channel.groups[0].checkboxs.forEach(channel => {
            if(channel.checked === true) {
              channel_ids.push(channel.value)
            }
          })
          data.channel_ids = channel_ids;

          console.log(data);
          

          query('/api/banner', 'POST', data).then(res => {
            
            this.$emit('toast', '保存成功！', 1500)
            this.$router.push('/wechat/prices')
          }).catch(err => {
            console.log(err);
            if(err === 'success') {
              this.$emit('toast', '保存成功！', 2000)
              this.$router.push('/wechat/prices')
            } else {
              this.$emit('toast', '网络异常，请重试！', 2000)
            }
            
          })
        }
      },
    },
  }
</script>

<style src='@/assets/css/edit.css'></style>

