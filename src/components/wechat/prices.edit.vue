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
        .info(v-if='!!infoMulSelect' v-for='(MulSelect, index) in infoMulSelect' :key='MulSelect.idName + index')
          label.label-txt
            i.require-icon(v-if='MulSelect.required') *
            span {{MulSelect.label}}
          select.multiselect(multiple="" v-model='values.channel_ids')
            option(v-for='option in MulSelect.options' :value='option.value') {{option.key}}
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
      required: false
    },
    {
      label: '价格下限',
      idName: 'min',
      placeholder: '请填写价格下限',
      required: false
    },
    {
      label: '排序',
      idName: 'weight',
      placeholder: '排序',
      required: true
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

  let infoMulSelect = [
    {
      label: '关联频道',
      required: false,
      idName: 'channel_ids',
      options: [
        {
          value: 0,
          key: '频道1'
        },
        {
          value: 1,
          key: '频道2'
        },
        {
          value: 2,
          key: '频道3'
        }
      ]
    }
  ]

  // 测试数据
  let test = [
    {
      id: 15,
      name: '频道1',
      img_url: "https://file.qmxpower.com/image/banner-%E4%B8%8B%E5%8D%95%E6%B5%81%E7%A8%8B.png",
      is_show: 1,
      timestamp: "2019-04-01 12:57",
      type_id: 1,
      url: "/pages/find/flow",
      weight: 1,
      comment: '备注1111111'
    },
    {
      id: 14,
      name: '频道2',
      img_url: "https://file.qmxpower.com/image/banner-%E4%B8%9A%E5%8A%A1%E4%BB%8B%E7%BB%8D2.png",
      is_show: 0,
      timestamp: "2019-04-01 12:56",
      type_id: 2,
      url: "/pages/find/business",
      weight: 2,
      comment: '备注33222222222222'
    }
  ];

  export default {
    name: 'wechatBannerEdit',
    data() {
      return {
        pagemenu,
        infoText,
        infoSelect,
        infoImg: null,
        infoMulSelect: [],
        values: {
          oper: 'add',
          id: null,
          max: '',
          is_show: -1,
          min: '',
          weight: '',
          channel_ids: [],
          comment: ''
        },
        submitDisabled: true,
      }
    },
    components:{
      breadcrumbs
    },
    mounted() {
      // 获取关联频道信息
      query('/api/channel', 'POST').then(res => {
        
      }).catch(err => {
        console.log(err);
        let channelInfo = {
          label: '关联频道',
          required: false,
          idName: 'channel_ids',
          options: []
        }
        test.forEach(item => {
          channelInfo.options.push({
            value: item.id,
            key: item.name
          })
        })
        this.infoMulSelect.push(channelInfo)
        
        console.log($('.multiselect'));
        setTimeout(() => {
          console.log($('.multiselect'));
          let mul = $('.multiselect').multiselect({
            enableFiltering: false,
            enableHTML: true,
            buttonClass: 'btn btn-white btn-primary',
            templates:{
              button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"><span class="multiselect-selected-text"></span> &nbsp;<b class="fa fa-caret-down"></b></button>',
              ul: '<ul class="multiselect-container dropdown-menu"></ul>',
              li: '<li><a tabindex="0"><label></label></a></li>',
              divider: '<li class="multiselect-item divider"></li>',
              liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>'
            }
          })
          console.log(mul);
          
        }, 0)
      })
      
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
        let file = e.currentTarget.files[0];
        readFile.readAsDataURL(file)
        readFile.onload = function() {
          that.values.img_url = this.result;
          // that.toast = '上传中，请稍等。。。'
          // $('.toast').show();
          that.$emit('toast', '上传中，请稍等。。。', 300000)
          putimage('https://test.qmxpower.com/api/getSTS?filetype=image', file.name, file, function(res) {
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

