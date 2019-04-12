// 请求：url：请求路径；type：请求方式；data：请求需传送的数据
export const query = function (url, type, data = '') { // 请求
  const header = {
    Accept: 'application/json; charset=utf-8',
    Cookie: 'EGG_SESS=dJrZPNMvUtbRppfOZCQPTkeWd0B7BnqxnTANmi3c7yoHWjQVwq63eHgcUvq8NBe1U1FazePys33zEXwm1y3rKFuuroodcdbqgxCODE6fFYWSd2znT09I6ptHXoWX_dPqgkUWfMxGPSPHwMpl8KwFRFFjZ8w2EQ4TvnIrJPQDthgjewpaSN935SHxf3pI74yEvd7FC0oOcX01-b4Vq-ZTC3UgAiwJym-fSIzU7aeQZ32CnhFZvfiGAkY9KL1XWAlYH6SYI78eeiXHr0PlwW4OfBBvldhuF1sw3Zq37xNl5sNSlMcmX3wAP49JHpSWjsaMxCv6bV_HuurB0f6pm8qgZxHBRU-ggFNMF4ZEL1atw9gyjOUS4TuKuFTuEqld9Tnhxq5OOoGurpDyffQFTWbVVB70PHi5Qv8mgQ8rid_H90zP9p13TmwutVIsWNq5WT7Z0maVIrwoYzR8-5NsonX6mQ=='
  };
  const domain = 'https://test.qmxpower.com';
  // const domain = 'https://admin.qmxpower.com';

  return new Promise((resolve, reject) => {
    $.ajax({
      header,
      type,
      url: domain + url,
      data,
      success(res) {
        if (res.status === 200) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      error(xml, err) {
        reject(err)
      }
    })
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
  const mode = {
    wechatUrl:  {
      1: '非tab页',
      2: 'tab页',
      3: '外链'
    },
    displayState: {
      0: '不显示',
      1: '显示'
    }
  }
  if(!mode[type]) {
    if(type === 'channel') {
      await query('/api/channel', 'POST').then(res => {
        res.data.forEach(item => {
          mode.channel = {
            [item.id]: item.name
          }
        })

      }).catch(err => {
        console.log(err);
        
      })
    } else {
      await query('/api/channel', 'POST').then(res => {
        let data = res.data;
        for(key in data) {
          data[key].forEach(item => {
            mode[key] = {
              [item.id]: item.name
            }
          })
        }
    l  }).catch(err => {
        console.log(err);
      })
    }
    
  }
  return mode[code]
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