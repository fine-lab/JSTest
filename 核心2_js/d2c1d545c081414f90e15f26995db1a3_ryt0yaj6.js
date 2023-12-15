let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0];
    if (!!data) {
      if (!!data.C003List) {
        //判断是否有子单
        for (var i = 0; i < data.C003List.length; i++) {
          //获取当前单据生效的已推、未推信息
          if (!!data.C003List[i]) {
            var effectres = ObjectStore.queryByYonQL("select * from GT64168AT5.GT64168AT5.C003 where id='" + data.C003List[i].id + "'");
            //获取上游单据已推、未推信息
            var sourceres = ObjectStore.queryByYonQL("select * from GT64178AT7.GT64178AT7.B0002 where id='" + data.C003List[i].sourcechild_id + "'");
            if (sourceres.length > 0) {
              var object = { id: sourceres[0].id, _status: "Update" };
              if (!!data.C003List[i]) {
                switch (data.C003List[i]._status) {
                  case "Insert": {
                    object.yituishuliang = sourceres[0].yituishuliang + data.C003List[i].shuliang;
                    object.yituizongjine = sourceres[0].yituizongjine + data.C003List[i].hanshuijine;
                    object.weituishuliang = sourceres[0].weituishuliang - data.C003List[i].shuliang;
                    object.weituizongjine = sourceres[0].weituizongjine - data.C003List[i].hanshuijine;
                    break;
                  }
                  case "Update": {
                    if (effectres.length > 0) {
                      object.yituishuliang = sourceres[0].yituishuliang + data.C003List[i].shuliang - effectres[0].shuliang;
                      object.yituizongjine = sourceres[0].yituizongjine + data.C003List[i].hanshuijine - effectres[0].hanshuijine;
                      object.weituishuliang = sourceres[0].weituishuliang - data.C003List[i].shuliang + effectres[0].shuliang;
                      object.weituizongjine = sourceres[0].weituizongjine - data.C003List[i].hanshuijine + effectres[0].hanshuijine;
                    }
                    break;
                  }
                  case "Delete": {
                    object.yituishuliang = sourceres[0].yituishuliang - effectres[0].shuliang;
                    object.yituizongjine = sourceres[0].yituizongjine - effectres[0].hanshuijine;
                    object.weituishuliang = sourceres[0].weituishuliang + effectres[0].shuliang;
                    object.weituizongjine = sourceres[0].weituizongjine + effectres[0].hanshuijine;
                    break;
                  }
                }
                var res = ObjectStore.updateById("GT64178AT7.GT64178AT7.B0002", object, "daceabde");
              }
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });