let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取收款信息主表合同号id
    var id = param.data[0].contractNumber;
    //根据id查询收款信息表主表id
    var sql = "select id from GT102917AT3.GT102917AT3.collection_information where contractNumber = '" + id + "'";
    var res = ObjectStore.queryByYonQL(sql);
    for (var i = 0; i < res.length; i++) {
      //根据id查询收款信息表子表生产工号id;
      var sql1 = "select productionWorkNumber from GT102917AT3.GT102917AT3.collection_Information_details where collection_information_id = '" + res[i].id + "'";
      var res1 = ObjectStore.queryByYonQL(sql1);
      for (var j = 0; j < res1.length; j++) {
        //根据生产工号id查询收款信息表子表收款类型
        var sql2 = "select collectionType from GT102917AT3.GT102917AT3.collection_Information_details where productionWorkNumber = '" + res1[j].productionWorkNumber + "'";
        var res2 = ObjectStore.queryByYonQL(sql2);
        var type = 0;
        for (var m = 0; m < res2.length; m++) {
          if (type < res2[m].collectionType && res2[m].collectionType < 4) {
            type = res2[m].collectionType;
          }
        }
        //更新分包合同
        var object = { id: res1[j].productionWorkNumber, anzhuangfeishoukuanbilv: type };
        var res3 = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontractDetails", object, "82884516");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });