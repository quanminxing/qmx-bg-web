<template lang="pug">
  .main-content-inner.pos-rel
    breadcrumbs(v-bind:breadcrumbs="pagemenu")
    form.page-content.row
      .edit-content.page-main.col-xs-12
        .info(v-if='!!infoText' v-for='(item, index) in infoText' :key='item.idName + index')
          label.label-txt
            i.require-icon(v-if='item.required') *
            span {{item.label}}
          input.input(:id='item.idName' type='text' :placeholder='item.placeholder' :required='item.required' v-model='values[item.idName]' :key='item.idName')
        .info(v-if='!!infoSelect' v-for='(item, index) in infoSelect' :key='item.idName + index')
          label.label-txt
            i.require-icon(v-if='item.required') *
            span {{item.label}}
          select.select(:id='item.idName' :required='item.required' v-model='values[item.idName]')
            option.hide(value=-1 selected disabled) --请选择--
            option(v-for='option in item.options' :key='option.value' :value='option.value') {{option.key}}
        .info(v-if='!!infoImg')
          label.label-txt.img-label
            i.require-icon(v-if='infoImg.required') *
            span {{infoImg.label}}
          #imgs
            .img
              img.pic(:src='values.img_url' alt='图片' v-show='!!values.img_url')
            .img-file
              span.choose-img.btn.btn-info.btn-xs(@click='chooseImg') 选择图片
              input.hide.choose-imgfile(type='file' accept='image/png, image/jpeg, image/gif, image/jpg' @change='chooseFile')
          .img-tips
            p(v-for='tip in infoImg.tips' :key='tip') {{tip}}

      .edit-btns
        button.btn.btn-md.btn-success#save(@click='save' type='submit' :disabled='submitDisabled') 保存
        router-link.btn.btn-default.btn-md#cancel(to='/wechat/banner') 取消
</template>

<script>
  import breadcrumbs from '../mods/breadcrumbs.vue'
  import { query, isShow, urlProperty, setValue, showToast } from '@/assets/js/common.js'

  // 面包屑
  let pagemenu = [
    {
      id: 1,
      label: '小程序配置',
      href: '',
    },
    {
      id: 2,
      label: 'banner配置',
      href: '/wechat/banner'
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
      idName: 'url_name',
      placeholder: '请填写名称',
      required: true
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
      options:[
        {
          value: 1,
          key: '非 tab 页'
        },
        {
          value: 2,
          key: 'tab 页'
        },
        {
          value: 3,
          key: '外链'
        }
      ]
    },
    {
      label: '状态',
      required: true,
      idName: 'is_show',
      placeholder: '请填写显示状态',
      options:[
        {
          value: 0,
          key: '不显示'
        },
        {
          value: 1,
          key: '显示'
        }
      ]
    }
  ];

  let infoImg = {
    required: true,
    label: '图片',
    tips: ['建议尺寸：750 * 300', '在保证清晰度的前提下图片大小尽量不要超过100K'],
    img_url: ''
  }

  export default {
    name: 'wechatBannerEdit',
    data() {
      return {
        pagemenu,
        infoText,
        infoSelect,
        infoImg,
        values: {
          oper: 'add',
          id: null,
          img_url: '',
          is_show: -1,
          url: '',
          url_name: '',
          type_id: -1
        },
        submitDisabled: true,
      }
    },
    components:{
      breadcrumbs
    },
    mounted() {
      // 绑定初始数据
      let params = this.$route.params;
      console.log(params);
      this.infoText.forEach(item => {
        setValue(item.idName, params[item.idName], this)
      })
      this.infoSelect.forEach(item => {
        setValue(item.idName, params[item.idName], this)
      })
      setValue('img_url', params.img_url, this)

      console.log('11111111111111111111111111111111');
      
      console.log(!!this.values.img_url);
      
      if(!!this.values.img_url) {
        this.submitDisabled = false;
      }
      setValue('id', params.id, this)
      setValue('oper', params.oper, this)
    },
    methods: {
      // 选择图片
      chooseImg(e) {
        console.log(e.currentTarget);
        $(e.currentTarget).next('input.choose-imgfile').click();
      },
      chooseFile(e) {
        let that = this;
        let readFile = new FileReader()
        let file = e.currentTarget.files[0];be
        readFile.readAsDataURL(file)
        readFile.onload = function() {
          that.values.img_url = this.result;
          // that.toast = '上传中，请稍等。。。'
          // $('.toast').show();
          that.$emit('toast', '上传中，请稍等。。。', 300000)
          // let networkTimeout = setTimeout(() => {
          //   that.$emit('toast', '网络超时，请重试')
          // }, 120000)
          putimage('https://test.qmxpower.com/api/getSTS?filetype=image', file.name, file, function(res) {
            // clearTimeout(networkTimeout)
            if(res.status === 200) {
              // that.toast = '上传成功！';
              // showToast($('.toast'), 1000)
              that.$emit('toast', '上传成功！', 1000)
              that.submitDisabled = false;
            } else {
              // that.toast = '上传失败，请重新上传！';
              // showToast($('.toast'))
              that.$emit('toast', '上传失败，请重新上传！')
              that.values.img_url = ''
            }
            
          })
          that.values.submitDisabled = false;
        }
        
      },

      // 保存
      save() {
        if(this.values.is_show === -1 || this.values.type_id === -1) {
          console.log('-111111111111');
          // this.toast = '请输入完整信息！'
          // showToast($('.toast'))
          this.$emit('toast', '请输入完整信息！')
        } else {
          query('/api/banner', 'POST', this.values).then(res => {
            // this.toast = '保存成功！';
            // showToast($('.toast'), 1500)
            this.$emit('toast', '保存成功！', 1500)
            window.location.href = '/wechat/banner'
          }).catch(err => {
            console.log(err);
            // this.toast = '网络异常，请重试！'
            // showToast($('.toast'), 1500)
            this.$emit('toast', '网络异常，请重试！', 1500)
          })
        }
      },

    }
  }
</script>

<style src='@/assets/css/edit.css'></style>

