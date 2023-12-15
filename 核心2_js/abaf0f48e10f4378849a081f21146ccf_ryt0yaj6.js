let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0];
    if (!!data) {
      if (!!data.E0002List) {
        //判断是否有子单
        for (var i = 0; i < data.E0002List.length; i++) {
          if (!!data.E0002List[i]) {
            //获取当前单据生效的已推、未推信息
            var effectres = ObjectStore.queryByYonQL("select * from GT64308AT8.GT64308AT8.E0002 where id='" + data.E0002List[i].id + "'");
            //获取上游单据已推、未推信息
            var sourceres = ObjectStore.queryByYonQL("select * from GT64168AT5.GT64168AT5.C003 where id='" + data.E0002List[i].sourcechild_id + "'");
            if (sourceres.length > 0) {
              var object = { id: sourceres[0].id, _status: "Update" };
              switch (data.E0002List[i]._status) {
                case "Insert": {
                  object.yiyanshoujine = sourceres[0].yiyanshoujine + data.E0002List[i].wangonghanshuijine;
                  object.weiyanshoujine = sourceres[0].weiyanshoujine - data.E0002List[i].wangonghanshuijine;
                  break;
                }
                case "Update": {
                  if (effectres.length > 0) {
                    object.yiyanshoujine = sourceres[0].yiyanshoujine + data.E0002List[i].wangonghanshuijine - effectres[0].wangonghanshuijine;
                    object.weiyanshoujine = sourceres[0].weiyanshoujine - data.E0002List[i].wangonghanshuijine + effectres[0].wangonghanshuijine;
                  }
                  break;
                }
                case "Delete": {
                  object.yiyanshoujine = sourceres[0].yiyanshoujine - effectres[0].wangonghanshuijine;
                  object.weiyanshoujine = sourceres[0].weiyanshoujine + effectres[0].wangonghanshuijine;
                  break;
                }
              }
              var res = ObjectStore.updateById("GT64168AT5.GT64168AT5.C003", object, "1fc0716c");
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });