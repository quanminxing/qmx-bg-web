<template lang="pug">
  .main-content-inner.pos-rel
    breadcrumbs(v-bind:breadcrumbs="pagemenu")
    formEdit(:infoText='infoText' :infoSelect='infoSelect' :infoCheckbox='infoCheckbox' :cancelUrl='cancelUrl' :initData='initData')
  //-
    form.page-content.row
      .edit-content.page-main.col-xs-12
        .info.row(v-if='!!infoText' v-for='(item, index) in infoText' :key='item.idName + index')
          label.label-txt.info-left
            i.require-icon(v-if='item.required') * 
            span {{item.label}}
          .info-right
            input.input(:id='item.idName' type='text' :placeholder='item.placeholder' :required='item.required' v-model='values[item.idName]' :key='item.idName')
        .info.row(v-if='!!infoSelect' v-for='(item, index) in infoSelect' :key='item.idName + index')
          label.label-txt.info-left
            i.require-icon(v-if='item.required') * 
            span {{item.label}}
          .info-right
            select.select(:id='item.idName' :required='item.required' v-model='values[item.idName]')
              option.hide(value=-1 selected disabled) --请选择--
              option(v-for='option in item.options' :key='option.value' :value='option.value') {{option.key}}
        .info.row(v-if='!!infoCheckbox' v-for='(item, index) in infoCheckbox' :key='item.idName + index')
          label.label-txt.info-left.align-top
            i.require-icon(v-if='item.required') * 
            span {{item.lebel}}
          .checkbox-groups.info-right.align-top(v-for='(group, index) in item.groups' :key='group.name + index')
            
            input(type='checkbox' v-if='group.isShow' :name='group.name' v-model='group.value') 
            span(v-if='group.isShow') {{group.label}}
            .checkbox-groups-wrap
              .checkbox-groups-item(v-for='(checkbox, index) in group.checkboxs' :key='checkbox.name + index' v-show='group.value')
                input(type='checkbox' :name='checkbox.name' v-model='checkbox.value')
                span {{checkbox.label}}
        .info.row(v-if='!!infoImg' v-for='(item, index) in infoImg' :key='item.idName + index')
          label.label-txt.img-label.info-left.align-top
            i.require-icon(v-if='item.required') * 
            span {{item.label}}
          imgs.info-right.align-top
            .img-empty(v-if='item.imgs.length === 0')
            .imgs-wrap(v-else)
              img(v-for='(img, index) in item.imgs' :src='img.img_url', alt='images')
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
  import formEdit from '../mods/form.edit.vue'
  import { query, isShow, urlProperty, setValue, showToast, codeTransform } from '@/assets/js/common.js'

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

  const checkboxItems = [ 'channel_ids' ];

  export default {
    name: 'wechatBannerEdit',
    data() {
      return {
        pagemenu,
        infoText,
        infoSelect,
        infoCheckbox: [],
        cancelUrl: '/wechat/prices',
        initData: null,
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
      breadcrumbs,
      formEdit
    },
    mounted() {
      // 获取关联频道信息
      codeTransform('channel').then(res =>{
        console.log(res);
        
        this.infoCheckbox = [
          {
            label: '关联频道',
            required: false,
            idName: 'channel_ids',
            groups: [
              {
                name: 'pindao',
                value: true,
                isShow: false,
                checkboxs: res
              }
            ]
          }
        ];
        let initData = this.$route.params
        console.log(initData);
        checkboxItems.forEach(checkboxItem => {
          if(!!initData[checkboxItem]) { // 找到是checkboc的
            this.infoCheckbox.forEach(item => {
              if(item.idName === checkboxItem) {  // 找到对应的checkbox项的信息
                initData[checkboxItem].forEach(boxChecked => {
                  item.checkboxs.forEach(checkbox => {
                    if(boxChecked === checkbox.value) {
                      item.checked = true
                    }
                  })
                })
              }
            })
          }
        })
        this.initData = initData;
      })
      
      // 绑定初始数据
      // let params = this.$route.params;

      // console.log(params);
      // this.infoText.forEach(item => {
      //   setValue(item.idName, params[item.idName], this)
      // })
      // this.infoSelect.forEach(item => {
      //   setValue(item.idName, params[item.idName], this)
      // })
      // setValue('img_url', params.img_url, this)
      // if(!!this.values.img_url) {
      //   this.submitDisabled = false;
      // }

      // setValue('id', params.id, this)
      // setValue('oper', params.oper, this)
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
    },
  }
</script>

<style src='@/assets/css/edit.css'></style>

