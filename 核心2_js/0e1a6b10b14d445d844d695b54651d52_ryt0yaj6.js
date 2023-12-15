let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var str = "";
    var data = param.data[0];
    if (!!data) {
      if (!!data.B0002List) {
        //判断是否有子单
        for (var i = 0; i < data.B0002List.length; i++) {
          if (!!data.B0002List[i]) {
            //获取当前单据生效的已推、未推信息
            var effectres = ObjectStore.queryByYonQL("select * from GT64178AT7.GT64178AT7.B0002 where id='" + data.B0002List[i].id + "'");
            //获取上游单据已推、未推信息
            var sourceres = ObjectStore.queryByYonQL("select * from GT64173AT6.GT64173AT6.D0002 where id='" + data.B0002List[i].sourcechild_id + "'");
            if (sourceres.length > 0) {
              var object = { id: sourceres[0].id, _status: "Update" };
              if (!!data.B0002List[i]) {
                switch (data.B0002List[i]._status) {
                  case "Insert": {
                    object.yituishuliang = sourceres[0].yituishuliang + data.B0002List[i].ziduan3;
                    object.yituizongjine = sourceres[0].yituizongjine + data.B0002List[i].hanshuijine;
                    object.weituishuliang = sourceres[0].weituishuliang - data.B0002List[i].ziduan3;
                    object.weituizongjine = sourceres[0].weituizongjine - data.B0002List[i].hanshuijine;
                    break;
                  }
                  case "Update": {
                    if (effectres.length > 0) {
                      object.yituishuliang = sourceres[0].yituishuliang + data.B0002List[i].ziduan3 - effectres[0].ziduan3;
                      object.yituizongjine = sourceres[0].yituizongjine + data.B0002List[i].hanshuijine - effectres[0].hanshuijine;
                      object.weituishuliang = sourceres[0].weituishuliang - data.B0002List[i].ziduan3 + effectres[0].ziduan3;
                      object.weituizongjine = sourceres[0].weituizongjine - data.B0002List[i].hanshuijine + effectres[0].hanshuijine;
                      str +=
                        "objyitui:" +
                        object.yituishuliang +
                        "sourceresyitui:" +
                        sourceres[0].yituishuliang +
                        "dataziduan3:" +
                        data.B0002List[i].ziduan3 +
                        "effectziduan3:" +
                        effectres[0].ziduan3 +
                        "|";
                      str +=
                        "objyitui:" +
                        object.yituizongjine +
                        "sourceresyitui:" +
                        sourceres[0].yituizongjine +
                        "dataziduan3:" +
                        data.B0002List[i].hanshuijine +
                        "effectziduan3:" +
                        effectres[0].hanshuijine +
                        "|";
                      str +=
                        "objyitui:" +
                        object.weituishuliang +
                        "sourceresyitui:" +
                        sourceres[0].weituishuliang +
                        "dataziduan3:" +
                        data.B0002List[i].ziduan3 +
                        "effectziduan3:" +
                        effectres[0].ziduan3 +
                        "|";
                      str +=
                        "objyitui:" +
                        object.weituizongjine +
                        "sourceresyitui:" +
                        sourceres[0].weituizongjine +
                        "dataziduan3:" +
                        data.B0002List[i].hanshuijine +
                        "effectziduan3:" +
                        effectres[0].hanshuijine +
                        "|";
                    }
                    break;
                  }
                  case "Delete": {
                    object.yituishuliang = sourceres[0].yituishuliang - effectres[0].ziduan3;
                    object.yituizongjine = sourceres[0].yituizongjine - effectres[0].hanshuijine;
                    object.weituishuliang = sourceres[0].weituishuliang + effectres[0].ziduan3;
                    object.weituizongjine = sourceres[0].weituizongjine + effectres[0].hanshuijine;
                    break;
                  }
                }
                var res = ObjectStore.updateById("GT64173AT6.GT64173AT6.D0002", object, "447a26f2");
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