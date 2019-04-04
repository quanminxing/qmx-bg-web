// 请求
const header = {
  Accept: 'application/json; charset=utf-8',
  Cookie: 'EGG_SESS=dJrZPNMvUtbRppfOZCQPTkeWd0B7BnqxnTANmi3c7yoHWjQVwq63eHgcUvq8NBe1U1FazePys33zEXwm1y3rKFuuroodcdbqgxCODE6fFYWSd2znT09I6ptHXoWX_dPqgkUWfMxGPSPHwMpl8KwFRFFjZ8w2EQ4TvnIrJPQDthgjewpaSN935SHxf3pI74yEvd7FC0oOcX01-b4Vq-ZTC3UgAiwJym-fSIzU7aeQZ32CnhFZvfiGAkY9KL1XWAlYH6SYI78eeiXHr0PlwW4OfBBvldhuF1sw3Zq37xNl5sNSlMcmX3wAP49JHpSWjsaMxCv6bV_HuurB0f6pm8qgZxHBRU-ggFNMF4ZEL1atw9gyjOUS4TuKuFTuEqld9Tnhxq5OOoGurpDyffQFTWbVVB70PHi5Qv8mgQ8rid_H90zP9p13TmwutVIsWNq5WT7Z0maVIrwoYzR8-5NsonX6mQ=='
}

const query = function (url, type, data = '') {
  return new Promise((resolve, reject) => {
    $.ajax({
      header,
      type,
      url,
      data,
      success(res) {
        if(res.status === 200) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      error(xml, err) {
        console.log(err);
        
        reject(err)
      }
    })
  })
}




module.exports = {
  query,
}