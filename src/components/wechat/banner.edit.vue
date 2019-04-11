<template lang="pug">
  .main-content.vh.position-relative
    .main-content-inner
      breadcrumbs(v-bind:breadcrumbs="pagemenu")
      .page-content.row
        .edit-content.page-main.col-xs-12
          .info(v-for='(item, index) in infoText' :key='item.idName + index')
            label.label-txt
              i.require-icon(v-if='item.required') *
              span {{item.label}}
            input.input(:id='item.idName' type='text' :placeholder='item.placeholder' :required='item.required' v-model='values[item.idName]' :key='item.idName')
          .info(v-for='(item, index) in infoSelect' :key='item.idName + index')
            label.label-txt
              i.require-icon(v-if='item.required') *
              span {{item.label}}
            select.select(:id='item.idName' :placeholder='item.placeholder' :required='item.required' v-model='values[item.idName]')
              option(v-for='option in item.options' :key='option.value' :value='option.value') {{option.key}}
          .info
            label.label-txt.img-label
              i.require-icon(v-if='infoImg.required') *
              span {{infoImg.label}}
            #imgs(v-for='img in infoImg.imgs' :key='img.src')
              .img
                img.pic(:src='img.src' alt='图片')
              .img-file
                span.choose-img.btn.btn-info.btn-xs(@click='chooseImg') 选择图片
                input.hide.choose-imgfile(type='file')
            .img-tips
              p(v-for='tip in infoImg.tips' :key='tip') {{tip}}

        .edit-btns
          button.btn.btn-md.btn-success#save 保存
          router-link.btn.btn-default.btn-md#cancel(to='/wechat/banner') 取消

</template>

<script>
  import breadcrumbs from '../mods/breadcrumbs.vue'
  import { query, isShow, urlProperty, setValue } from '@/assets/js/common.js'

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
    imgs:[
      {
        src: ''
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
        infoImg,
        values: {
          url_name: 'test'
        }
      }
    },
    components:{
      breadcrumbs
    },
    mounted() {
      console.log(this.$route);
      
      // 请求元数据
      query('/api/banner/listById', 'GET', {ids: [this.$route.params.id]}).then(res => {
        console.log(res);
        
        
        
        
      }).catch(err => {
        console.log(err);
        let data = {
          id: 14,
          img_name: null,
          img_url: "https://file.qmxpower.com/image/banner-%E4%B8%9A%E5%8A%A1%E4%BB%8B%E7%BB%8D2.png",
          is_show: 1,
          timestamp: "2019-04-01 12:56",
          type_id: 1,
          url: "/pages/find/business",
          url_name: "小程序业务介绍",
          work_id: null
        }
        this.values.url_name = 'ddddddddddd'
        setValue('url_name', data.url_name, this)
      })
    },
    computed: {
    
    },
    methods: {
      // 

      // 选择图片
      chooseImg(e) {
        console.log(e.currentTarget);
        $(e.currentTarget).next('input.choose-imgfile').click();
      },

    }
  }
</script>

<style>
  .edit-content {
    padding: 30px;
  }
  .edit-content .info {
    padding: 10px 0;
  }
  .edit-content .info .label-txt {
    width: 120px;
    padding: 0 15px 0 0;
    text-align: right;
  }
  .edit-content .require-icon {
    padding: 0 2px;
    color: #f00;
    font-weight: bold;
  }
  .edit-content .input {
    width: 250px;
  }
  .edit-content #imgs {
    display: inline-block;
  }
  #imgs .img {
    width: 375px;
    height: 200px;
    border: 1px solid #eee;
    background-color: #f5f5f5;
  }
  .edit-content .img-label {
    vertical-align: top;
  }
  #imgs .choose-img {
    margin: 10px 0;
  }
  .edit-content .img-tips {
    padding: 5px 0 0 120px;
  }
  .edit-btns {
    padding: 0 0 0 150px;
  }
  .edit-btns .btn {
    margin: 0 15px 0 0;
  }
</style>


