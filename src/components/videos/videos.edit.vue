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
            .imgs-wrap(:class='[infoDetail.details.length > 0 ? "" : "img-empty"]')
              .detail-item(v-for='(detail, index) in infoDetail.details' :key='detail + index' v-show='infoDetail.details.length > 0')
                img(:src='detail.img_url', alt='images' :key='detail.img_url + detail.video_id')
                span 关联视频
                input(type='number' v-model='detail.video_id' :key='detail.video_id+index')
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
      required: true,
      type: 'number'
    },
    {
      label: '时长',
      idName: 'time',
      placeholder: '视频时长',
      required: true,
      type: 'text'
    },
    {
      label: '视频比例',
      idName: 'scale_id',
      placeholder: '请填写视频比例',
      required: true,
    },
    {
      label: '视频格式',
      idName: 'format',
      placeholder: '请填写视频格式',
      required: true,
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
    },
    {
      label: '颗粒度',
      idName: 'keystring',
      placeholder: '',
      required: false,
    },
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
      required: true,
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
      label: '风格',
      required: false,
      idName: 'style_id',
      name: 'style',
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
      label: '封面1（16:9）',
      tips: ['建议尺寸：1125 * 633（16:9）', '在保证清晰度的前提下图片大小尽量不要超过100K'],
      img_url: ''
    },{
      required: true,
      idName: 'waterfall_image',
      label: '封面2',
      tips: ['建议尺寸：1125 * 633（16:9）；560*746（3:4, 9:16）；560*420（4:3）；560*560（1:1）', '在保证清晰度的前提下图片大小尽量不要超过100K'],
      img_url: ''
    }
  ];

  let infoVideo = {
    label: '视频',
    required: true,
    idName: 'video_id',
    url: ''
  }

  let infoDetail = {
    required: false,
    idName: 'demo_pic',
    label: '详情图',
    details: [],
    tips: ['建议尺寸：1125 * 633（16:9）', '在保证清晰度的前提下图片大小尽量不要超过100K'],
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
      console.log('33333333333333333333333333333333333333');
      
      this.infoDetail.details = [];

      this.values.infoDetail = [];

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
      if(!initData.oper) {
        initData.oper = 'add'
      }
      
      if(!!initData.demo_pic) {
        console.log(initData.demo_pic);
        
        initData.infoDetail = [];
        let details = initData.demo_pic.split('|');
        console.log(details);
        details.forEach(item => {
          if(!!item) {
            let itemInfo = item.split(',')
            console.log(itemInfo)
            that.infoDetail.details.push({
              img_url: itemInfo[0],
              video_id: itemInfo[1] || null
            })
            initData.infoDetail.push({
              img_url: itemInfo[0],
              video_id: itemInfo[1] || null
            })
          }
          console.log(initData.infoDetail);
          
        })

        console.log(initData.infoDetail);
        
        
      } else {
        that.infoDetail.details = [];
        initData.infoDetail = []

      }
      //  hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
      console.log((that.values.infoDetail));
      if(!initData.url) {
        initData.url = '';
      }
      if(!initData.short_image) {
        initData.short_image = ''
      }
      if(!initData.waterfall_image) {
        initData.waterfall_image = ''
      }
      console.log(initData)

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
            putimage('https://test.qmxpower.com/api/getSTS?filetype=image', new Date() + file.name, file, function(res) {
              uploadInfo(res)
            })
          } else {
            putvideo('https://test.qmxpower.com/api/getSTS?filetype=video', new Date() + file.name, file, function(res) {
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

        that.$emit('toast', '上传中，请稍等。。。', 300000)
        readFile.readAsDataURL(file)
        readFile.onload = function() {
          console.log(this.result);
          
          that.infoDetail.details.push({
            img_url: this.result,
            video_id: null
          })
          
          putimage('https://test.qmxpower.com/api/getSTS?filetype=image', new Date() + file.name, file, function(res) {
            if(res.status === 200) {
              console.log(that);
              if(!that.values.infoDetail) {
                that.values.infoDetail = []
              }
              that.values.infoDetail.push({
                img_url: res.urls[0],
                video_id: null
              })
              that.$emit('toast', '上传成功！')
              
            } else {
              that.$emit('toast', '上传失败，请重新上传！')
              that.infoDetail.details.pop()
            }
            
          })
        }
        
      },

      // 保存
      save() {
        console.log(this.values);
        
        if(this.values.is_show === -1 || !this.values.name || !this.values.price || !this.values.time || !this.values.format || !this.values.scale_id || this.values.category_id === -1 || this.values.platform_id === -1 || this.values.column_id === -1 || this.values.usage_id === -1 || !this.values.url || !this.values.short_image) {
          console.log('-111111111111');
          console.log(this.values.is_show === -1);
          console.log(!this.values.name);
          console.log(!this.values.price);
          console.log(!this.values.time);
          console.log(!this.values.format);
          console.log(!this.values.scale_id);
          console.log(this.values.category_id === -1);
          console.log(this.values.platform_id === -1);
          console.log(this.values.column_id === -1);
          console.log(this.values.usage_id === -1);
          console.log(!this.values.url);
          console.log(!this.values.short_image);
          
      
          this.$emit('toast', '请输入完整信息！')


        } else {
          
          let demo_pic = ''
          console.log(this.values);
          if(!!this.values.infoDetail) {
            this.values.infoDetail.forEach((item,index) => {
              console.log(item.img_url);
              if(!this.infoDetail.details[index].video_id) {
                this.infoDetail.details[index].video_id = ''
              }
              demo_pic += item.img_url + ',' + this.infoDetail.details[index].video_id + '|'
            })
          }
          
          console.log(demo_pic);
          this.values.infoDetail = null;
          let data = {...this.values};

          data.demo_pic = demo_pic;

          console.log(this.values)
          console.log(data);
          // data.infoDetail = null;
          

          query('/api/video', 'POST', data).then(res => {
            
            this.$emit('toast', '保存成功！', 1500)
            this.$router.push('/videos/videos')
          }).catch(err => {
            console.log(err);
            
            this.$emit('toast', '网络异常，请刷新重试！', 1500)
          })
        }
      },
    },
  }
</script>

<style src='@/assets/css/edit.css'></style>

