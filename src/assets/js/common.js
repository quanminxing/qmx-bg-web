// 请求：url：请求路径；type：请求方式；data：请求需传送的数据
export const query = function (url, type='GET', data = '') {
  console.log(data)
  type = type.toUpperCase()
  const header = {
    Accept: 'application/json; charset=utf-8'
  };

  const domain = 'https://test.qmxpower.com';
  // const domain = 'https://admin.qmxpower.com';
  // const domain = 'http://192.168.2.60:7001'
  // const domain = 'http://localhost:7001'
  // const domain = 'http://127.0.0.1:7001'

  return new Promise((resolve, reject) => {
    let ajaxData = {}
    if(type === 'POST') {
      ajaxData = {
        url: domain + url,
        type:"POST",
        contentType: "application/json",
        dataType: "json",
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        data: JSON.stringify(data),
        success(res) {
          console.log(res);
          if (res.status === 200) {
            resolve(res);
          } else {
            res.httpStatus = 200;
            reject(res);
          }
        },
        error(xml, err) {
          console.log(err)
          reject(err)
        }
      }
    } else if (type === 'GET') {
      ajaxData = {
        header,
        type,
        url: domain + url,
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        data,
        success(res) {
          console.log(res);
          
          if (res.status === 200) {
            
            resolve(res);
          } else {
            res.httpStatus = 200;
            reject(res);
          }
        },
        error(xml, err) {
          console.log(err)
          reject(err)
        }
      }
    }
    

    console.log(ajaxData);
    
    $.ajax(ajaxData)
  })
}

// input type=file，读取本地url
export const getFileUrl = function(target) {
  return new Promise((resolve, reject) => {
    let file = target.files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = function() {
      resolve(this.result)
    }
  })
  
}

// 是否显示
export const isShow = function(code) {
  const mode = {
    0: '不显示',
    1: '显示'
  }

  return mode[code];
}

// 链接属性
export const urlProperty = function (code) {
  const mode = {
    1: '非tab页',
    2: 'tab页',
    3: '外链'
  }

  return mode[code];
}

// 对应值code和文字的转换
export const codeTransform = async function(type, code) {
  let mode = {
    wechatUrl: [
      {
        value: 1,
        key: '非tab页'
      },{
        value: 2,
        key: 'tab页'
      }, {
        value: 3,
        key: '外链'
      }
    ],
    is_show: [
      {
        value: 0,
        key: '不显示'
      }, {
        value: 1,
        key: '显示'
      }
    ]
  }

  if(!!mode[type]) {
    let res = await query('/api/info/operateVideo' , 'GET')
    console.log(res);
    for(let item in res.data) {
      console.log(item);
      
      mode[item] = res.data[item]
      console.log(mode);
      
    }
  }

  console.log(mode);
  
  return mode
}



export const codeTranform = function(type, code){
  let mode = {
    wechatUrl: [
      {
        value: 1,
        key: '非tab页'
      },{
        value: 2,
        key: 'tab页'
      }, {
        value: 3,
        key: '外链'
      }
    ],
    is_show: [
      {
        value: 0,
        key: '不显示'
      }, {
        value: 1,
        key: '显示'
      }
    ]
  }

  // console.log(`mode: ${mode[type]}`);

  return async function () {
    if(!mode[type]) {
      if(type === 'channel') {
        let res = await query('/api/channel', 'POST')
        if(!!res.data) {
          res.data.forEach(item => {
            mode.channel = {
              [item.id]: item.name
            }
          })
        }
        /* await query('/api/channel', 'POST').then(res => {
          console.log(res);
          
          res.data.forEach(item => {
            mode.channel = {
              [item.id]: item.name
            }
          })
  
        }).catch(err => {
          console.log(err);
          
        }) */
      } else {
        await query('/api/info/operateVideo', 'get').then(res => {
          let data = res.data;
          for(key in data) {
            data[key].forEach(item => {
              mode[key] = {
                [item.id]: item.name
              }
            })
          }
      l }).catch(err => {
          console.log(err);
          
        })
      } 
    }
    console.log(mode);
    

    if(code === undefined) {
      return mode
    } else {
      let key = ''
      if(typeof code === 'number') {
        let types = mode[type];
        let length = types.length;
        for (let i = 0; i < length; i++) {
          if (types[i].value === code) {
            key = types[i].key;
            break
          }
        }
      }
      console.log(key);
      return key
    }
  }
}

// 编辑时，设置value值
export const setValue = function(name, value, that) {
  if(value !== null && value !== undefined) {
    that.values[name] = value
  }
}

// 提示信息显示和隐藏
export const showToast = function ($toast, time) {
  clearTimeout(timer)
  $toast.show();
  let timer = setTimeout(() => {
    $toast.hide()
  }, time)
}