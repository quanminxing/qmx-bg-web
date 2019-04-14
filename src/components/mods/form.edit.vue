<template lang="pug">
  .form
    form.page-content.row
      .edit-content.page-main.col-xs-12
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
              option(v-for='option in item.options' :key='option.value' :value='option.value') {{option.key}}
        //- checkbox 类型表单
        .info.row(v-if='!!values.infoCheckbox' v-for='(item, index) in values.infoCheckbox' :key='item.idName + index')
          label.label-txt.info-left.align-top
            i.require-icon(v-if='item.required') * 
            span {{item.label}}
          .checkbox-groups.info-right.align-top(v-for='(group, index) in item.groups' :key='group.name + index')
            
            input(type='checkbox' v-if='group.isShow' :name='group.name' v-model='group.value') 
            span(v-if='group.isShow') {{group.label}}
            .checkbox-groups-wrap
              .checkbox-group(v-show='group.value')
                .checkbox-group-item(v-for='(checkbox, index) in group.checkboxs' :key='checkbox.key + index')
                  input(type='checkbox' v-model='checkbox.checked')
                  span {{checkbox.key}}
        //- 选择图片类型表单(单张图片)
        .info.row(v-if='!!infoImg' v-for='(item, index) in infoImg' :key='item.idName + index')
          label.label-txt.img-label.info-left.align-top
            i.require-icon(v-if='item.required') * 
            span {{item.label}}
          .imgs.info-right.align-top
            .imgs-wrap(:class='[!values[item.idName] ? "img-empty" : ""]')
              img(:src='values[item.idName]', alt='images')
            .img-file
              span.choose-img.btn.btn-info.btn-xs(@click='chooseImg') 选择图片
              input.hide.choose-imgfile(type='file' accept='image/png, image/jpeg, image/gif, image/jpg' @change='chooseFile(item.idName, $event)')
            .img-tips
            p(v-for='tip in item.tips' :key='tip') {{tip}}
        //- 选择图片类型表单(多张图片)
        .info.row(v-if='!!values.infoImglist' v-for='(item, index) in values.infoImglist' :key='item.idName + index')
          label.label-txt.img-label.info-left.align-top
            i.require-icon(v-if='item.required') * 
            span {{item.label}}
          .imgs.info-right.align-top
            .img-empty(v-if='item.imgs.length === 0')
            .imgs-wrap(v-else)
              img(v-for='(img, index) in item.imgs' :src='img.img_url', alt='images')
            .img-file
              span.choose-img.btn.btn-info.btn-xs(@click='chooseImglist') 选择图片
              input.hide.choose-imgfile(type='file' accept='image/png, image/jpeg, image/gif, image/jpg' @change='chooseFilelist' multiple)
            .img-tips
            p(v-for='tip in item.tips' :key='tip') {{tip}}
      .edit-btns
        button.btn.btn-md.btn-success#save(@click='save' type='submit') 保存
        router-link.btn.btn-default.btn-md#cancel(:to='cancelUrl') 取消
</template>

<script>
  import { codeTransform } from '@/assets/js/common.js'

  /**
   * props 表单数据格式
        infoText = [
          {
            label: '名称',
            idName: '该项的id，和数据的字段名一致',
            placeholder: '',
            required: Boolean 是否必须
          },
        ]
        infoSelect = [
          {
            label: '名称',
            required: Boolean,
            idName: '',
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
        infoCheckbox = [
          {
            lebel: '',
            required: true,
            idName: '',
            groups: [
              {
                name: 'group1',
                label: '分组1',
                value: true,
                isShow: false,
                checkboxs: [
                  {
                    name: 'option1',
                    value: 11,
                    label: '选项1',
                    checked: Boolean // 是否选中
                  },{
                    name: 'option2',
                    value: 12,
                    label: '选项2',
                    checked: Boolean
                  },{
                    name: 'option3',
                    value: 13,
                    label: '选项3',
                    checked: Boolean
                  }
                ]
              }
            ]
          }
        ]
        infoImg = [
          label: '',
          required: Boolean,
          idName: '',
          btn: '按钮内容',
          tips: ['图片建议或说明']
          img_url: ''
        ];
        infoImglist = [
          label: '',
          required: Boolean,
          idName: '',
          btn: '按钮内容',
          tips: ['图片建议或说明']
          imgs: [
            {
              img_url: 'key值和数据的字段名一致'
            }
          ]
        ]
   */

  
  const multiSelects = [ 'channel_ids' ];

  export default {
    name: 'formEdit',
    props: ['initData', 'infoText', 'infoSelect', 'infoImg', 'cancelUrl'],
    data() {
      return {
        values: {
          is_show: -1,
          infoCheckbox: [],
          infoImg: [],
        },
        // values: this.$props.initData || {is_show: -1, infoCheckbox: []}
      }
    },
    mounted() {
      console.log('1111111111111111111111');
      setTimeout(() => {
        let initData = this.$props.initData;
        console.log(initData);
        
        if(!!initData) {
          this.values = initData;
          // this.values.infoCheckbox = this.$props.infoCheckbox;
          console.log(this.values);
          
        }
        
      }, 0)
      
      
    },
    methods: {
      // 选择图片
      chooseImg(e) {
        console.log(e.currentTarget);
        $(e.currentTarget).next('input.choose-imgfile').click();
      },
      chooseFile(idName, e) {
        console.log(idName)
        let that = this;
        let readFile = new FileReader();
        let file = e.currentTarget.files[0];
        
        readFile.readAsDataURL(file)
        readFile.onload = function() {
          console.log(this.result);
          
          that.values[idName] = this.result;
          console.log(that.values);
          
          // that.toast = '上传中，请稍等。。。'
          // $('.toast').show();
          that.$emit('toast', '上传中，请稍等。。。', 300000)
          // let networkTimeout = setTimeout(() => {
          //   that.$emit('toast', '网络超时，请重试')
          // }, 120000)
          putimage('https://test.qmxpower.com/api/getSTS?filetype=image', file.name, file, function(res) {
            console.log('8888888888888888888');
            // clearTimeout(networkTimeout)
            if(res.status === 200) {
              // that.toast = '上传成功！';
              // showToast($('.toast'), 1000)
              that.$emit('toast', '上传成功！', 1000)
              that.submitDisabled = false;
            } else {
              console.log('8888888888888888888');
              
              // that.toast = '上传失败，请重新上传！';
              // showToast($('.toast'))
              that.$emit('toast', '上传失败，请重新上传！')
              that.values.img_url = ''
            }
            
          })
          that.values.submitDisabled = false;
        }
        
      },
      chooseImglist() {},
      chooseFilelist() {},
      save() {}
    },
    computed: {
    }
  }
</script>
