<template lang="pug">
  .main-content-inner
    breadcrumbs(:breadcrumbs="pagemenu")
    .page-content.row
      .page-main.col-xs-12
        .grid
          .gird-header
            .btn-group.col-xs-12.align-right.margin-bt15
              span
                button.btn.btn-white.btn-info.margin-lr5(@click='showModal("search")') 搜索 
                  i.ace-icon.fa.fa-search.bigger-120.blue
              span 
                button.btn.btn-info.btn-sm(@click='showModal("revise", "add")') 添加 
                  i.ace-icon.fa.fa-print.align-top.bigger-120.icon-on-right
          .grid-content
            table.table.table-bordered.table-hover#simple-table
              thead
                tr
                  th.center(v-for='(colItem, colIndex) in colNames' :key='colItem + "colName"') {{colItem}}
                  th.center 操作
              tbody.center
                tr(v-for='(employeeItem, employeeIndex) in employeeDatas' :key='employeeIndex + "employeeDatas"')
                  td(v-for='(employeeValue, employeekey) in employeeItem.table' :key='employeeValue + employeekey + employeeIndex') {{employeeValue}}
                  td
                    a.blue.space.pointer(@click='showModal("revise", "edit", employeeItem)')
                      i.ace-icon.fa.fa-pencil.bigger-120
                    a.red.space.pointer(@click='deleteEmployee(employeeItem.id, employeeIndex)')
                      i.ace-icon.fa.fa-trash-o.bigger-120
          .grid-footer
            ul.pager
              li.pointer(:class='{disabled: page.pageNum <= 1}')
                a(@click='prevPage')
                  i.ace-icon.fa.fa-angle-double-left
              li.space 第 {{page.pageNum}} 页
              li.space 共 {{Math.ceil(pageTotal / page.pageSize)}} 页
              li(:class='{disabled: page.pageNum >= Math.ceil(pageTotal / page.pageSize)}')
                a.pointer(@click='nextPage')
                  i.ace-icon.fa.fa-angle-double-right
    .page-modal(@click.self='hideModal')
      .search-modal.page-modal-item(v-if='modal.type==="search"')
        .search-content.row
          .search-item.text-item.col-sm-6.col-xs-12(v-for='(textItem, textIndex) in modal.search.text' :key='"searchText" + textIndex')
            label {{textItem.label}}:
            input(:type='textItem.type || "text"' v-model='search[textItem.key]' :placeholder='textItem.placeholder')
        .search-footer.align-right
          button.btn.btn-info.btn-sm.float-l(@click='resetSearch') 重置
          button.btn.btn-default.btn-sm(@click='hideModal') 取消
          button.btn.btn-success.btn-sm(@click='searchEmployee') 确定
      .revise-modal.page-modal-item(v-if='modal.type==="revise"')
        .revise-modal-header.blue 编辑
        .revise-modal-content
          .revise-item.row(v-for='(reviseItem, reviseIndex) in modal.revise' :key='"revise" + reviseIndex')
            .text-item.col-xs-12(v-if='reviseItem.type==="text"')
              label
                span.red(v-if='reviseItem.required') *
                span {{reviseItem.label}}:
              input(type='text' v-model='reviseItem.value' :placeholder='reviseItem.placeholder')
            .selected-item.col-xs-12(v-if='reviseItem.type==="select"')
              label
                span.red(v-if='reviseItem.required') *
                span {{reviseItem.label}}:
              select(v-model='reviseItem.value')
                option(value='' disabled selected) -请选择-
                option(v-for='(reviseOption, optionIndex) in reviseItem.options' :key='optionIndex + "reviseOption"' :value='reviseOption.value') {{reviseOption.label}}
          .revise-tip.red(v-if='reviseTip') {{reviseTip}}
        .revise-modal-footer.align-right
          button.btn.btn-default.btn-sm(@click='hideModal') 取消
          button.btn.btn-success.btn-sm(@click='reviseEmployee') 确定
</template>

<script>
  import breadcrumbs from '../mods/breadcrumbs.vue';
  import { query } from '@/assets/js/common.js'

  let queryData = {
    _search: false,
    pageSize: 20,
    pageNum: 1
  };

  const queryList = function(page) {
    
    console.log(queryData)

    query('/api/people', 'GET', queryData).then(res => {
      console.log('人员数据-成功')
      let employeeDatas = res.data;
      console.log(employeeDatas)
      employeeDatas.forEach(item => {
        item.table = {
          id: item.id,
          cname: item.cname,
          phone: item.phone,
          description: item.description
        }
      })
      console.log(employeeDatas)
      page.employeeDatas = employeeDatas;
      page.pageTotal = res.total
    }).catch(err => {
      console.log(err)
      console.log('人员数据-失败')
      
      
    })
  }

  const formValidation = function(info) {
    const required = function(info) {
      if(!info.required) return true;

      if(info.value !== '' && info.value !== null && info.value !== undefined) return true;

      return `请输入${info.label}`
    };

    const validity = function(info) {
      const validityType = {
        'phone': (value) => {
          return /^1\d{10}$/.test(value)
        },
        'email': (value) => {
          return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value);
        }
      }

      let infoValidityType = info.validity;
      if(!!infoValidityType && validityType[infoValidityType]) {
        let infoValidity = validityType[infoValidityType](info.value);

        return infoValidity ? true : `请正确输入${info.label}`
      }

      return true;
    };

    let infoRequired = required(info);
    if(infoRequired !== true) return infoRequired;

    let infoValidity = validity(info);
    if(infoValidity !== true) return infoValidity;

    return true;
  }

  export default {
    components: {
      breadcrumbs
    },
    data() {
      return {
        pagemenu: [
          {
            id: 1,
            label: '人员管理',
            href: '',
            active: true
          }
        ],
        pageTotal: 20,
        page: {
          pageSize: 20,
          pageNum: 1,
        },
        colNames: ['编号', '成员姓名', '电话号码', '备注'],
        employeeDatas: [],
        modal: {
          type: '',
          search: {
            text: [
              {
                label: '编号',
                key: 'id',
                value: '',
                placeholder: '编号'
              },{
                label: '成员姓名',
                key: 'cname',
                value: '',
                placeholder: '成员姓名'
              },{
                label: '成员电话',
                key: 'phone',
                value: '',
                placeholder: '成员电话'
              },{
                label: '邮箱',
                key: 'email',
                value: '',
                placeholder: '邮箱'
              },{
                label: '备注',
                key: 'description',
                value: '',
                placeholder: '备注'
              }
            ]
          },
          revise: [
            {
              label: '账号',
              key: 'username',
              placeholder: '账号',
              required: true,
              type: 'text',
              value: ''
            },{
              label: '成员姓名',
              key: 'cname',
              placeholder: '成员姓名',
              required: true,
              type: 'text',
              value: ''
            },{
              label: '电话号码',
              key: 'phone',
              placeholder: '电话号码',
              required: true,
              validity: 'phone',
              type: 'text',
              value: ''
            },{
              label: '登录密码',
              key: 'password',
              placeholder: '登录密码',
              required: true,
              type: 'text',
              value: ''
            },{
              label: '邮箱',
              key: 'email',
              placeholder: '邮箱',
              required: true,
              validity: 'email',
              type: 'text',
              value: ''
            },{
              label: '权限',
              key: 'auth',
              placeholder: '权限',
              required: false,
              type: 'select',
              value: 1,
              options: [
                {
                  label: '管理员',
                  value: 0
                }, {
                  label: '员工',
                  value: 1
                }
              ]
            },{
              label: '备注',
              key: 'description',
              placeholder: '备注',
              required: false,
              type: 'text',
              value: ''
            }
          ]
        },
        search: {
          id: '',
          cname: '',
          phone: '',
          email: '',
          description: ''
        },
        reviseOper: '',
        reviseTip: '',
        reviseId: ''
      }
    },
    mounted() {
      queryList(this)
    },
    methods: {
      showModal(type, oper, data) {
        console.log(type)
        console.log(oper)
        this.modal.type = type;
        const modalType = {
          'revise': () => {
            this.reviseTip = ''
            if(oper === 'edit') {
              this.modal.revise.forEach(item => {
                item.value = data[item.key] || ''
              })
              this.reviseId = data.id
              this.reviseOper = 'edit'
            } else {
              console.log(oper)
              this.modal.revise.forEach(item => {
                if(item.key === 'auth') {
                  item.value = 1
                } else {
                  item.value = ''
                }
              })
              this.reviseOper = 'add'
            }
          }
        }
        if(!!modalType[type]) {
          modalType[type]()
        }
        $('.page-modal').show()
      },
      hideModal() {
        $('.page-modal').hide()
      },
      searchEmployee() {
        queryData = {
          _search: true,
          pageSize: 20,
          pageNum: 1
        }
        
        let searchValues = this.search;
        for(let key in searchValues) {
          let value = searchValues[key];
          if(value !== '') {
            queryData[key] = value;
          }
        }

        this.page.pageNum = 1;
        
        queryList(this)
        this.hideModal()
      },
      resetSearch() {
        this.search = {
          id: '',
          cname: '',
          phone: '',
          email: '',
          description: ''
        }
      },
      reviseEmployee() {
        console.log('提交')
        let reviseModal = this.modal.revise;
        let length = reviseModal.length;
        let reviseData = {
          oper: this.reviseOper,
          id: this.reviseId
        };

        this.reviseTip = ''
        
        for(let index = 0; index < length; index++) {
          let item = reviseModal[index];
          let itemValidity = formValidation(item);
          
          if(itemValidity !== true) {
            this.reviseTip = itemValidity;
            break;
          } else if(item.value !== '') {
            reviseData[item.key] = item.value;
          }
          console.log(this.reviseTip)
        }
        console.log(this.reviseTip)
        if(this.reviseTip === '') {
          query('/api/people', 'POST', reviseData).then(res => {
            this.hideModal()
            queryList(this)
          }).catch(err => {
            console.log(err)
            console.log(this.reviseTip)
            this.reviseTip = '网络异常，请稍后重试'
          })
        }
        
      },
      deleteEmployee(id, index) {
        let that = this;
        bootbox.confirm({
          message: '确定删除？',
          buttons: {
            confirm: {
              label: '确定',
              className: 'btn-success btn-sm'
            },
            cancel: {
              label: '取消',
              className: 'btn-sm'
            }
          },
          callback: function(result) {
            if(result) {
              query('/api/people/del', 'POST', {ids: id})
              .then((res) => {
                console.log(res)

                that.employeeDatas.splice(index, 1)
              })
              .catch((err) => {
                console.log(err);
                that.$emit('toast', '网络异常，请刷新重试')
              })
            }
          }
        })
      },
      prevPage() {
        if(this.page.pageNum > 1) {
          --this.page.pageNum;
        }
      },
      nextPage() {
        if(this.page.pageNum * this.page.pageSize < this.pageTotal) {
          ++this.page.pageNum
        }
      },
    },
    watch: {
      page: {
        handle: function() {
          queryList(this)
        },
        deep: true
      }
    }
  }
</script>

<style>
  .page-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .2);
  }
  .page-modal-item {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    background-color: #fff;
    transform: translate(-50%, -50%);
  }
  .search-modal {
    padding: 30px 50px;
  }
  .search-item, .revise-item {
    padding: 5px 0;
  }
  .search-item label, .revise-item label {
    width: 120px;
    padding: 0 10px 0 0;
    text-align: right;
  }
  .search-footer {
    padding: 30px 0 0 0;
  }
  .revise-modal-header {
    height: 60px;
    padding: 0 50px;
    background-color: #fafafa;
    font-size: 20px;
    line-height: 60px;
  }
  .revise-modal-content {
    padding: 15px 50px;
  }
  .revise-modal-footer {
    padding: 30px 50px;
  }
  .revise-tip {
    padding: 30px 30px 0 30px;
    font-size: 18px;
    text-align: center;
  }
  .modal-dialog {
    margin: 80px auto;
  }
  .margin-bt15 {
    margin: 15px 0;
  }
  .float-l {
    float: left;
  }
</style>
