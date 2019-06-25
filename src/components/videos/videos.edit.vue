<template lang="pug">
  .main-content-inner.pos-rel
    breadcrumbs(v-bind:breadcrumbs="pagemenu")
    .form
      form.edit-content.page-main
        .edit-main.row
          .info.col-xs-12.col-sm-6(v-show='!!values.id')
            label.label-txt.info-left 
              span ID
            .info-right {{values.id}}
          .info.col-xs-12.col-sm-6(v-show='!!uv')
            label.label-txt.info-left 
              span 播放量
            .info-right {{uv}}
          //- text 类型表单
          .info.col-xs-12.col-sm-6(v-if='!!infoText' v-for='(item, index) in infoText' :key='item.idName + "text"')
            label.label-txt.info-left
              i.require-icon(v-if='item.required') * 
              span {{item.label}}
            .info-right
              input.input(:id='item.idName' :type='[!!item.type ? item.type : "text"]' :placeholder='item.placeholder' :required='item.required' v-model='values[item.idName]' :key='item.idName')
          //- select 类型表单
          .info.col-xs-12.col-sm-6(v-if='!!infoSelect' v-for='(item, index) in infoSelect' :key='item.idName + "select"')
            label.label-txt.info-left
              i.require-icon(v-if='item.required') * 
              span {{item.label}}
            .info-right
              select.select(:id='item.idName' :required='item.required' v-model='values[item.idName]')
                option(value='' selected :disabled='item.required') --请选择--
                option(v-for='(option, optionIndex) in item.options' :key='optionIndex + "selectOption"' :value='option.id') {{option.name}}
          //- CheckBox 多选类型
          .info.col-xs-12.align-item-start(v-if='!!infoCheckbox' v-for='(item, index) in infoCheckbox' :key='item.idName + "checkbox"')
            label.label-txt.info-left
              i.require-icon(v-if='item.required') * 
              span {{item.label}}
            .info-right
              .selected
                span.blue
                  i.ace-icon.fa.fa-pencil 编辑
              .checkbox
                .row
                  .col-md-2.col-sm-3.col-xs-4.margin-left20(v-for='(option, optionIndex) in item.options' :key='optionIndex + "checkboxOption"')
                    input(type='checkbox' :name='item.idName' :value='option.id' v-model='option.checked')
                    span {{option.label}}
          //- 选择图片类型表单(单张图片)
          .info.col-xs-12(v-if='!!infoImg' v-for='(item, index) in infoImg' :key='item.idName + "img"')
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
                p(v-for='(tip, index) in item.tips' :key='"img" + tip + index') {{tip}}
          //- 视频
          .info.col-xs-12
            label.label-txt.img-label.info-left.align-top
              i.require-icon(v-if='infoVideo.required') * 
              span {{infoVideo.label}}
            .imgs.info-right.align-top
              .imgs-wrap(:class='[!values.url ? "img-empty" : ""]')
                video(:src='values.url' v-show='!!values.url' controls)
              .img-file
                span.choose-img.btn.btn-info.btn-xs(@click='chooseImg') 选择视频
                input.hide.choose-imgfile(type='file' accept='video/*' @change='chooseFile("url","video", $event)')
          //- 详情图
          .info.col-xs-12(v-if='!!infoDetail')
            label.label-txt.img-label.info-left.align-top
              i.require-icon(v-if='infoDetail.required') * 
              span {{infoDetail.label}}
            .imgs.info-right.align-top
              .imgs-wrap(:class='[infoDetail.details.length > 0 ? "" : "img-empty"]')
                .detail-item(v-for='(detail, index) in infoDetail.details' :key='detail + index' v-show='infoDetail.details.length > 0')
                  img(:src='detail.img_url', alt='images' :key='detail.img_url + index')
                  .detail-operate
                    .detail-video.detail-operate-item
                      span 关联视频
                      input(type='number' v-model='detail.video_id')
                    .detail-del.detail-operate-item(@click='delDetailImg(index, $event)')
                      button.btn.btn-sm 删除图片
              .img-file
                span.choose-img.btn.btn-info.btn-xs(@click='chooseImg') 选择详情图
                input.hide.choose-imgfile(type='file' accept='image/png, image/jpeg, image/gif, image/jpg' @change='chooseDetails(infoDetail, $event)')
              .img-tips
                p(v-for='(tip, index) in infoDetail.tips' :key='"detail" + tip + index') {{tip}}
        .edit-btns.row
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

  // text类型表单
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

  // select类型表单
  let infoSelect = [
    {
      label: '类目',
      required: true,
      idName: 'category_id',
      name: 'category',
      query: true,
      options: []
    },{
      label: '平台',
      required: true,
      idName: 'platform_id',
      name: 'platform',
      query: true,
      options: []
    },{
      label: '分类',
      required: true,
      idName: 'classify_id',
      name: 'classify',
      query: true,
      options: []
    },{
      label: '栏目',
      required: true,
      idName: 'column_id',
      name: 'column',
      query: true,
      options: []
    },{
      label: '功能',
      required: true,
      idName: 'usage_id',
      name: 'usage',
      query: true,
      options: []
    },{
      label: '风格',
      required: false,
      idName: 'style_id',
      name: 'style',
      query: true,
      options: []
    },{
      label: '模特',
      required: false,
      idName: 'is_model',
      name: 'is_model',
      query: false,
      options: [{
        id: 1,
        name: '有'
      }, {
        id: 0,
        name: '无'
      }]
    },{
      label: '场景',
      required: false,
      idName: 'sence',
      name: 'sence',
      query: false,
      options: [
        {
          id: '室内',
          name: '室内'
        },{
          id: '室外',
          name: '室外'
        },{
          id: '棚拍',
          name: '棚拍'
        }
      ]
    },{
      label: '关联视频',
      required: false,
      idName: 'related_id',
      name: 'related_id',
      query: false,
      options: []
    },{
      label: '是否小程序展示',
      required: true,
      idName: 'is_wechat',
      name: 'is_wechat',
      query: false,
      options: [{
        id: 1,
        name: '显示'
      }, {
        id: 0,
        name: '不显示'
      }]
    }
  ];

  // Checkbox 多选
  let infoCheckbox = [
    {
      label: '适用平台',
      required: false,
      idName: 'platform',
      options: [
        // {
        //   id: '',
        //   label: '',
        //   checked: false
        // }
      ],
    },
    {
      label: '适用品类',
      required: false,
      idName: 'category',
      options: [],
      checked: []
    }
  ];

  // file（单张图片）类型表单
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
    },
    {
      required: false,
      idName: 'script_url',
      label: '框架脚本',
      tips: [],
      img_url: ''
    }
  ];

  // file（单个视频）类型表单
  let infoVideo = {
    label: '视频',
    required: true,
    idName: 'video_id',
    url: ''
  }

  // file（多张图片）类型表单
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
        uv: 0,
        infoText,
        infoSelect,
        infoCheckbox,
        infoImg,
        infoVideo,
        infoDetail,
        values: {
          oper: 'add',
          id: '',
          url: '',
          name: '',
          short_image: '',
          waterfall_image: '',
          script_url: '',
          max: '',
          min: '',
          weight: '',
          is_wechat: '',
          channel_ids: '',
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
    
      this.infoDetail.details = [];

      this.values.infoDetail = [];

      let initData = this.$route.params;
      console.log(initData);
      let that = this

      this.uv = initData.uv || 0

      query('/api/info/operateVideo' , 'GET').then(res => {
        this.infoSelect.forEach(item => {
          if(item.query) {
            item.options = res.data[item.name]
          }
        })
        this.infoCheckbox.forEach(item => {
          let checkbox = res.data[item.idName]  // 所有的checkbox
          let options = [];
          checkbox.forEach(data => {
            let initInfo = initData[item.idName]  // 初始信息：是否checked
            let OptionItem = {
              label: data.name,
              id: data.id
            }

            if(!!initInfo) {
              OptionItem.checked = initInfo.search(`${data.id}`) > -1 ? true : false
            } else {
              OptionItem.checked = false
            }
            options.push(OptionItem)
          })
          
          item.options = options
          
        })
      })
      query('/api/video/listAll', 'GET', {_search: true, classify_id: 2, pageSize: 1000, sidx: 'id', sord: 'desc'}).then(res => {
        console.log('关联视频：标准模板客片')
        let infoSelect = this.infoSelect;
        infoSelect.forEach(item => {
          if(item.idName === 'related_id') {
            let datas = res.data
            let options = []
            datas.forEach(data => {
              options.push({
                id: data.id,
                name: data.id + '—' + data.name
              })
            })
            item.options = options
          }
        })
      }).catch(err => {
        console.log('获取关联视频出错')
      })
      initData.oper = initData.oper ? initData.oper : 'add'
      
      if(!!initData.demo_pic) {
        
        initData.infoDetail = [];
        let details = initData.demo_pic.split('|');
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
        })
      } else {
        that.infoDetail.details = [];
        initData.infoDetail = []

      }
      
      let newAdd = ['url', 'short_image', 'waterfall_image', 'script_url']
      newAdd.forEach(item => {
        if(!initData[item]) {
          initData[item] = ''
        }
      })

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
              that.$emit('toast', '上传失败，请重新上传！')
              that.values[idName] = ''
            }
          };

          that.values[idName] = this.result;
          // that.toast = '上传中，请稍等。。。'
          // $('.toast').show();
          that.$emit('toast', '上传中，请稍等。。。', 300000)
          if(type === 'image') {
            putimage('https://admin.qmxpower.com/api/getSTS?filetype=image', Date.parse(new Date()) + file.name, file, function(res) {
              uploadInfo(res)
            })
          } else {
            putvideo('https://admin.qmxpower.com/api/getSTS?filetype=video', Date.parse(new Date()) + file.name, file, function(res) {
              uploadInfo(res)
            })
          }
          
        }
        
      },
      chooseDetails(details, e) {
        if(!$(e.currentTarget).val()) return;
        console.log(e);
        let that = this;
        let file = e.currentTarget.files[0];
        let readFile = new FileReader();

        console.log('chooseDetails4444444444444444')
        that.$emit('toast', '上传中，请稍等。。。', 300000)
        readFile.readAsDataURL(file)
        readFile.onload = function() {
          console.log(this.result);
          
          that.infoDetail.details.push({
            img_url: this.result,
            video_id: null
          })
          
          putimage('https://test.qmxpower.com/api/getSTS?filetype=image', Date.parse(new Date()) + file.name, file, function(res) {
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
      delDetailImg(index, e) {
        console.log(index)
        this.infoDetail.details.splice(index, 1)
        this.values.infoDetail.splice(index, 1)
      },

      // 保存
      save() {
        console.log(this.values);

        const required = (arr, obj, values) => { // 必填验证:返回 Boolean
          let flag = true;
          let allArr = [];
        
          arr.forEach(arrItem => {
            allArr.push(...arrItem)
          })

          let arrLength = allArr.length;
          console.log(allArr)
          console.log(values)

          for(let i = 0; i < arrLength; i++) {
            let item = allArr[i];
            let value = values[item.idName];
            if(item.required && (value === '' || value === null || value === undefined) ) {
              flag = false;
              console.log(item)
              console.log(value)
              break;
            }
          }
          if(flag) {
            let objArr = [...obj]
            let objArrLength = objArr.length;
            for (let i = 0; i < objArrLength; i++) {
              let objItem = objArr[i];
              let value = values[objItem.idName];
              if(objItem.required && (value === '' || value === null || value === undefined)) {
                flag = false;
                console.log(objItem)
                console.log(value)
                break;
              }
            }
          }

          return flag;
        }
          
        let demo_pic = ''
        if(!!this.values.infoDetail) {
          this.values.infoDetail.forEach((item,index) => {
            console.log(item.img_url);
            if(!this.infoDetail.details[index].video_id) {
              this.infoDetail.details[index].video_id = ''
            }
            demo_pic += item.img_url + ',' + this.infoDetail.details[index].video_id + '|'
          })
        }
        this.values.infoDetail = '';
        this.values.demo_pic = demo_pic;

        let checkbox = this.infoCheckbox;
        checkbox.forEach(item => {
          let options = item.options;
          let thisValue = '';
          options.forEach(option => {
            if(option.checked) {
              console.log(option.id)
              console.log(item.idName)
              console.log(this.values)
              console.log(thisValue)
              if(thisValue) {
                thisValue += `,${option.id}`
              } else {
                thisValue = option.id
              }
            }
          })
          this.values[item.idName] = thisValue;
        })
        console.log(this.values)
        console.log(required([this.infoText, this.infoSelect, this.infoCheckbox, this.infoImg], {infoVideo, infoDetail}, this.values))
        if(!required([this.infoText, this.infoSelect, this.infoCheckbox, this.infoImg], {infoVideo, infoDetail}, this.values)) {
          this.$emit('toast', '请输入完整信息！')
        } else {
          // let data = {...this.values};
          let data = {};
          let values = this.values;
          for(let key in values) {
            let value = values[key];
            if(value !== '' && value !== null && value !== undefined) {
              data[key] = value;
            }
          }
          
          console.log(data)
          query('/api/video', 'POST', data).then(res => {
            console.log('保存成功')
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

