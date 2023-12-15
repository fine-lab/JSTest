let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if (param.data[0].collection_Information_detailsList != null) {
      //获取子表集合
      var list = param.data[0].collection_Information_detailsList;
      var type1 = 0;
      for (var i = 0; i < list.length; i++) {
        //获取生产工号id
        var id = param.data[0].collection_Information_detailsList[i].productionWorkNumber;
        //取出收款类型
        var type = param.data[0].collection_Information_detailsList[i].collectionType;
        if (type > type1 && type < 4) {
          type1 = type;
        }
        //取出生产工号
        var scNo = param.data[0].collection_Information_detailsList[i].productionWorkNumber_productionWorkNumber;
        //查询分包合同子表
        var sql = "select id from GT102917AT3.GT102917AT3.subcontractDetails where productionWorkNumber = '" + scNo + "'";
        var res = ObjectStore.queryByYonQL(sql);
        //查询收款信息子表
        var sql1 = "select collectionType  from GT102917AT3.GT102917AT3.collection_Information_details where productionWorkNumber = '" + res[0].id + "'";
        var result = ObjectStore.queryByYonQL(sql1);
        var sum = 0;
        var sum1 = 0;
        for (var m = 0; m < result.length; m++) {
          if (result[m].collectionType == "1") {
            sum = sum + 1;
          }
          if (result[m].collectionType == "2") {
            sum = sum + 1;
          }
          if (result[m].collectionType == "3") {
            sum = sum + 1;
          }
          for (var j = 0; j < result.length; j++) {
            if (result[m].collectionType == result[j].collectionType && result[m].collectionType < 4) {
              sum1 = sum1 + 1;
            }
          }
        }
        if (sum != type1 && type1 < 4 && sum1 != type1) {
          if (type1 == 3) {
            throw new Error("请检查安装(动工款)与安装(完工款)类型收款是否添加");
          } else {
            throw new Error("请检查安装(动工款)类型收款是否添加");
          }
        }
        //回写分包合同子表
        var object = { id: id, anzhuangfeishoukuanbilv: type1 };
        var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontractDetails", object, "82884516");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });