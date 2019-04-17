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
              option(v-for='option in item.options' :key='option.id + "select"' :value='option.id') {{option.name}}
        //- 选择图片类型表单(单张图片)
        .info.row(v-if='!!infoImg' v-for='(item, index) in infoImg' :key='item.idName + index')
          label.label-txt.img-label.info-left.align-top
            i.require-icon(v-if='item.required') * 
            span {{item.label}}
          .imgs.info-right.align-top
            .imgs-wrap(:class='[!values[item.idName] ? "img-empty" : ""]')
              img(:src='values[item.idName]', alt='images' v-show='!!values[item.idName]')
            .img-file
              span.choose-img.btn.btn-info.btn-xs(@click='chooseImg') 选择图片
              input.hide.choose-imgfile(type='file' accept='image/png, image/jpeg, image/gif, image/jpg' @change='chooseFile(item.idName, "image", $event)')
            .img-tips
            p(v-for='tip in item.tips' :key='tip') {{tip}}
        .info.row
          label.label-txt.img-label.info-left.align-top
            i.require-icon(v-if='infoVideo.required') * 
            span {{infoVideo.label}}
          .imgs.info-right.align-top
            .imgs-wrap(:class='[!values.url ? "img-empty" : ""]')
              video(:src='values.url' v-show='!!values.url' controls)
            .img-file
              span.choose-img.btn.btn-info.btn-xs(@click='chooseImg') 选择视频
              input.hide.choose-imgfile(type='file' accept='video/*' @change='chooseFile("url","video", $event)')
        .info.row(v-if='!!infoDetail')
          label.label-txt.img-label.info-left.align-top
            i.require-icon(v-if='infoDetail.required') * 
            span {{infoDetail.label}}
          .imgs.info-right.align-top
            .imgs-wrap(v-show='infoDetail.details.length > 0')
              .detail-item(v-for='(detail, index) in infoDetail.details' :key='detail + index' v-show='detail.length > 0')
                img(:src='detail.img_url', alt='images')
                label 关联视频
                input(type='text' v-model='detail.video_id')
            .img-file
              span.choose-img.btn.btn-info.btn-xs(@click='chooseImg') 选择详情图
              input.hide.choose-imgfile(type='file' accept='image/png, image/jpeg, image/gif, image/jpg' @change='chooseDetails(infoDetail, $event)')
            .img-tips
            p(v-for='tip in infoDetail.tips' :key='tip') {{tip}}
      .edit-btns
        button.btn.btn-md.btn-success#save(@click='save' type='submit') 保存
        router-link.btn.btn-default.btn-md#cancel(to='/videos/videos') 取消
</template>

<script>
  import breadcrumbs from '../mods/breadcrumbs.vue'
  import { query, urlProperty, codeTransform, showToast } from '@/assets/js/common.js'

  // 面包屑
  let pagemenu = [
    {
      id: 1,
      label: '视频管理',
      href: '/videos/videos',
    },
    {
      id: 2,
      label: '编辑',
      href: '',
      active: true
    }
  ];

  let infoText = [
    {
      label: '名称',
      idName: 'name',
      placeholder: '品牌+名称',
      required: true
    },
    {
      label: '价格',
      idName: 'price',
      placeholder: '请填写价格上限',
      required: false,
      type: 'number'
    },
    {
      label: '品牌',
      idName: 'brand',
      placeholder: '品牌',
      required: false,
    },
    {
      label: '需求方',
      idName: 'business',
      placeholder: '需求方',
      required: false
    },{
      label: '样片说明',
      idName: 'demo_description',
      placeholder: '样片说明',
      required: false
    },
    {
      label: '备注',
      idName: 'description',
      placeholder: '备注',
      required: false
    }
  ];

  let infoSelect = [
    {
      label: '类目',
      required: true,
      idName: 'category_id',
      name: 'category',
      options: []
    },{
      label: '平台',
      required: true,
      idName: 'platform_id',
      name: 'platform',
      options: []
    },{
      label: '栏目',
      required: false,
      idName: 'column_id',
      name: 'column',
      options: []
    },{
      label: '功能',
      required: true,
      idName: 'usage_id',
      name: 'usage',
      options: []
    },{
      label: '是否小程序展示',
      required: true,
      idName: 'is_show',
      name: 'is_show',
      options: [{
        id: 0,
        name: '不显示'
      }, {
        id: 1,
        name: '显示'
      }]
    },{
      label: '分类',
      required: false,
      idName: 'classify_id',
      name: 'classify',
      options: []
    }
  ];

  let infoImg = [
    {
      required: true,
      idName: 'short_image',
      label: '封面1',
      tips: ['建议尺寸：750 * 300', '在保证清晰度的前提下图片大小尽量不要超过100K'],
      img_url: ''
    },{
      required: false,
      idName: 'waterfall_image',
      label: '封面2',
      tips: ['建议尺寸：750 * 300', '在保证清晰度的前提下图片大小尽量不要超过100K'],
      img_url: ''
    }
  ];

  let infoVideo = {
    label: '视频',
    required: false,
    idName: 'video_id',
    url: ''
  }

  let infoDetail = {
    required: false,
    idName: 'demo_pic',
    label: '详情图',
    details: [],
    tips: ['建议尺寸：750 * 300', '在保证清晰度的前提下图片大小尽量不要超过100K'],
  }

  export default {
    name: 'wechatBannerEdit',
    data() {
      return {
        pagemenu,
        infoText,
        infoSelect,
        infoImg,
        infoVideo,
        infoDetail,
        values: {
          oper: 'add',
          id: '',
          url: '',
          name: null,
          short_image: '',
          waterfall_image: '',
          max: '',
          min: '',
          weight: '',
          is_show: -1,
          channel_ids: null,
          comment: '',
          infoDetail: []
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
      let that = this

      query('/api/info/operateVideo' , 'GET').then(res => {
        console.log(res.data);
        
        this.infoSelect.forEach(item => {
          item.oper='edit'
          if(item.name !== 'is_show') {
            item.options = res.data[item.name]
          }
        })
      })
      console.log(initData);
      
      if(!!initData.demo_pic) {
        let details = initData.demo_pic.split('|');
        console.log(details);
        details.forEach(item => {
          let itemInfo = item.split(',')
          /* initData.infoDetail.push({
            img_url: itemInfo[0],
            video_id: itemInfo[1]
          }) */
          that.infoDetail.details.push({
            img_url: itemInfo[0],
            video_id: itemInfo[1]
          })
        })
        
      }else {
        initData.infoDetail = []
      }

      if(!initData.short_image) {
        initData.short_image = ''
      }
      if(!initData.waterfall_image) {
        initData.waterfall_image = ''
      }


      this.values = {...initData}
      console.log(this.values);
      
      
    },
    methods: {
      // 选择图片
      chooseImg(e) {
        console.log(e.currentTarget);
        $(e.currentTarget).next('input.choose-imgfile').click();
      },
      chooseFile(idName, type, e) {
        let that = this;
        let readFile = new FileReader()
        let file = e.currentTarget.files[0];
        console.log(file);
        
        readFile.readAsDataURL(file)
        readFile.onload = function() {
          const uploadInfo = function(res) {
            if(res.status === 200) {
              that.values[idName] = res.urls[0]
              that.$emit('toast', '上传成功！', 1000)
            } else {
              // that.toast = '上传失败，请重新上传！';
              // showToast($('.toast'))
              that.$emit('toast', '上传失败，请重新上传！')
              that.values[idName] = ''
            }
          };

          that.values[idName] = this.result;
          // that.toast = '上传中，请稍等。。。'
          // $('.toast').show();
          that.$emit('toast', '上传中，请稍等。。。', 300000)
          if(type === 'image') {
            putimage('https://test.qmxpower.com/api/getSTS?filetype=image', file.name, file, function(res) {
              uploadInfo(res)
            })
          } else {
            putvideo('https://test.qmxpower.com/api/getSTS?filetype=video', file.name, file, function(res) {
              uploadInfo(res)
            })
          }
          
        }
        
      },
      chooseDetails(details, e) {
        console.log(e);
        let that = this;
        let file = e.currentTarget.files[0];
        let readFile = new FileReader();
        readFile.readAsDataURL(file)
        readFile.onload = function() {
          console.log(this.result);
          
          that.infoDetail.details.push({
            img_url: this.result,
            video_id: null
          })
          
          
          that.$emit('toast', '上传中，请稍等。。。', 300000)
          putimage('https://test.qmxpower.com/api/getSTS?filetype=image', file.name, file, function(res) {
            if(res.status === 200) {
              that.values.infoDetail.push(res.urls[0])
              that.$emit('toast', '上传成功！')
              
            } else {
              that.$emit('toast', '上传失败，请重新上传！')
              that.infoDetail.details.pop()
            }
            
          })
        }
        

        /* console.log(files);
        for(let index in files) {
          console.log(index);
          if(index !== 'length' && index !== 'item') {
            let readFile = new FileReader()
            readFile.readAsDataURL(files[index])
            readFile.onload = function() { 
              that.values.infoDetail.push({
                img_url: this.result,
                video_id: null
              })
              
              that.$emit('toast', '上传中，请稍等。。。', 300000)
            }
            putimage('https://test.qmxpower.com/api/getSTS?filetype=image', files[index].name, files[index], function(res) {
              if(res.status === 200) {
                
                if(index >= files.length) {
                  that.$emit('toast', '上传中成功！')
                }
              } else {
                that.$emit('toast', '上传失败，请重新上传！')
                that.values.infoDetail = []
              }
              
            })
          }
        } */
        
      },

      // 保存
      save() {
        console.log(this.values);
        
        if(this.values.is_show === -1 || !this.values.name) {
          console.log('-111111111111');
          // this.toast = '请输入完整信息！'
          // showToast($('.toast'))
          this.$emit('toast', '请输入完整信息！')
        } else {
          let data = this.values;
          console.log(data);
          
          /* let channel_ids = []

          this.channel.groups[0].checkboxs.forEach(channel => {
            if(channel.checked === true) {
              channel_ids.push(channel.value)
            }
          })
          data.channel_ids = channel_ids;
          */
          // console.log(data);
          

          query('/api/video', 'POST', data).then(res => {
            // this.toast = '保存成功！';
            // showToast($('.toast'), 1500)
            this.$emit('toast', '保存成功！', 1500)
            window.location.href = '/wechat/banner'
          }).catch(err => {
            console.log(err);
            // this.toast = '网络异常，请重试！'
            // showToast($('.toast'), 1500)
            this.$emit('toast', '网络异常，请刷新重试！', 1500)
          })
        }
      },
    },
  }
</script>

<style src='@/assets/css/edit.css'></style>

