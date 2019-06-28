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
            input.input(:id='item.idName' type='text' :placeholder='item.placeholder' :required='item.required' v-model='values[item.idName]' :key='item.idName')
        //- select 类型表单
        .info.row(v-if='!!infoSelect' v-for='(item, index) in infoSelect' :key='item.idName + index')
          label.label-txt.info-left
            i.require-icon(v-if='item.required') * 
            span {{item.label}}
          .info-right
            select.select(:id='item.idName' :required='item.required' v-model='values[item.idName]')
              option.hide(value=-1 selected disabled) --请选择--
              option(v-for='option in item.options' :key='option.id' :value='option.id') {{option.name}}
        //- 选择图片类型表单(单张图片)
        .info.row(v-if='!!infoImg' v-for='(item, index) in infoImg' :key='item.idName + index')
          label.label-txt.img-label.info-left.align-top
            i.require-icon(v-if='item.required') * 
            span {{item.label}}
          .imgs.info-right.align-top
            .imgs-wrap(:class='[!item.img_url ? "img-empty" : ""]')
              img(:src='item.img_url', alt='images' v-show='!!item.img_url')
            .img-file
              span.choose-img.btn.btn-info.btn-xs(@click='chooseImg') 选择图片
              input.hide.choose-imgfile(type='file' accept='image/png, image/jpeg, image/gif, image/jpg' @change='chooseFile(item.idName, index, $event)')
            .img-tips
            p(v-for='tip in item.tips' :key='tip') {{tip}}
      .edit-btns
        button.btn.btn-md.btn-success#save(@click='save' type='submit') 保存
        router-link.btn.btn-default.btn-md#cancel(to='/wechat/channel') 取消
</template>

<script>
  import breadcrumbs from '../mods/breadcrumbs.vue'
  import { query, codeTransform } from '@/assets/js/common.js'

  // 面包屑
  let pagemenu = [
    {
      id: 1,
      label: '小程序配置',
      href: '',
    },
    {
      id: 2,
      label: '频道配置',
      href: '/wechat/channel'
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
      label: '排序',
      idName: 'weight',
      placeholder: '排序'
    },
    {
      label: '备注',
      idName: 'comment',
      placeholder: '备注',
    },
    {
      label: '跳转链接',
      idName: 'url',
      placeholder: '请填写跳转链接',
      required: true
    }
  ];

  let infoSelect = [
    {
      label: '链接属性',
      required: true,
      idName: 'type_id',
      placeholder: '请填写链接属性',
      options: [{
        id: 1,
        name: '非tab页'
      },{
        id: 2,
        name: 'tab页'
      },{
        id: 3,
        name: '外链'
      }]
    },
    {
      label: '状态',
      required: true,
      idName: 'is_show',
      placeholder: '请填写显示状态',
      options: [{
        id: 0,
        name: '不显示'
      },{
        id: 1,
        name: '显示'
      }]
    }
  ];

  let infoImg = [
    {
      required: true,
      idName: 'img_url',
      label: '图片',
      tips: ['建议尺寸：1125 * 633（16:9）', '在保证清晰度的前提下图片大小尽量不要超过100K'],
      img_url: ''
    }
  ]

  export default {
    name: 'wechatBannerEdit',
    data() {
      return {
        pagemenu,
        infoText,
        infoSelect,
        infoImg,
        values: {
          oper: '',
          id: '',
          name: '',
          weight: '',
          comment: '',
          url: '',
          type_id: -1,
          is_show: -1,
          img_url: ''
        },
      }
    },
    components:{
      breadcrumbs
    },

    mounted() {

      // 绑定初始数据
      let initData = this.$route.params;
      console.log(initData);
      infoImg.forEach(item => {
        item.img_url = initData.img_url
      })
      this.values = {...initData}
    },
    methods: {
      toastshow(msg, time) {
        this.$emit('toast', msg, time)
      },
      // 选择图片
      chooseImg(e) {
        console.log(e.currentTarget);
        $(e.currentTarget).next('input.choose-imgfile').click();
      },
      chooseFile(idName, index, e) {
        let that = this;
        let readFile = new FileReader()
        let file = e.currentTarget.files[0];
        readFile.readAsDataURL(file)
        readFile.onload = function() {
          that.infoImg[index].img_url = this.result;
          that.$emit('toast', '上传中，请稍等。。。', 300000)
          putimage('https://test.qmxpower.com/api/getSTS?filetype=image', Date.parse(new Date()) + file.name, file, function(res) {
            if(res.status === 200) {
              that.values[idName] = res.urls[0]
              that.$emit('toast', '上传成功！', 1000)
            } else {
              that.$emit('toast', '上传失败，请重新上传！')
              that.infoImg[index].img_url = ''
            }
            
          })
        }
        
      },

      // 保存
      save() {
        if(this.values.is_show === -1 || this.values.type_id === -1 || !this.values.img_url || !this.values.name || !this.values.url) {
          console.log('-111111111111');
          // this.toast = '请输入完整信息！'
          // showToast($('.toast'))
          this.$emit('toast', '请输入完整信息！')
        } else {
          query('/api/channel', 'POST', this.values).then(res => {
            if(res.status === 200) {
              this.$emit('toast', '保存成功！', 1500)
              this.$router.push({path: '/wechat/channel'})
            }
            
          }).catch(err => {
            console.log(err);
            this.$emit('toast', '网络异常，请重试！', 2000)
          })
        }
      },

    }
  }
</script>

<style src='@/assets/css/edit.css'></style>


