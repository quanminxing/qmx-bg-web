jQuery(function($) {
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

  const domain = 'https://test.qmxpower.com';

  query(`${domain}/api/channel`, 'GET', { pageNum: 1, pageSize: 20}).then((res) => {
    console.log(res);
    let $fragment = $(document.createDocumentFragment());
    $.each(data, function(index, item) {
      $fragment.append(`<tr class="table-row">
                <td>
                  <a href="#">${item.id}</a>
                </td>
                <td>${item.name}</td>
                <td>${item.url}</td>
                <td>
                  <span class="label label-sm label-warning">${state}</span>
                </td>
                <td>${item.weight}</td>
                <td>${item.comment}</td>
                <td>
                  <div class="hidden-xs btn-group">
                    <a class="btn btn-xs btn-info" href="./banner-edit.html?oper=edit&id=${item.id}&type_id=${item.type_id}" title="编辑">
                      <i class="ace-icon fa fa-pencil bigger-120"></i>
                    </a>
                    
                    <button class="delete btn btn-xs btn-danger" data-id="${item.id}">
                      <i class="ace-icon fa fa-trash-o bigger-120"></i>
                    </button>
                  </div>
                  
                  <div class="hidden-sm hidden-lg hidden-md">
                    <div class="inline pos-rel">
                      <button class="btn btn-minier btn-primary dropdown-toggle" data-toggle="dropdown" data-position="auto">
                        <i class="ace-icon fa fa-cog icon-only bigger-110"></i>
                      </button>
                      
                      <ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close">
                        
                        <li class="detail-edit-btn">
                          <a href="./banner-edit.html?oper=edit&id=${item.id}&type_id=${item.type_id}" class="tooltip-success" data-rel="tooltip" title="编辑">
                            <span class="green">
                              <i class="ace-icon fa fa-pencil-square-o bigger-120"></i>
                            </span>
                          </a>
                        </li>
                        
                        <li class="delete" data-id="${item.id}">
                          <a href="javascript: void(0);" class="tooltip-error" data-rel="tooltip" title="删除">
                            <span class="red">
                              <i class="ace-icon fa fa-trash-o bigger-120"></i>
                            </span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </td>
              </tr>`)
    })

    $('tbody').append($fragment)
  })

  $('#simple-table').on('click', '.delete', function (e) {
    query(`${domain}/api/channel/del`, 'POST', { ids: [$(this).attr('data-id')] }).then(res => {
      console.log(res);
      
    })
  })
})



