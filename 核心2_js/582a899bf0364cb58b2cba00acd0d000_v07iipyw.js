let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0].PurchaseordedetailList;
    if (data == null || data.length == 0) {
      return {};
    }
    // 定义初始数据
    let materialidsql = "";
    // 遍历循环
    for (let i = 0; i < data.length; i++) {
      if (materialidsql.length > 0) {
        materialidsql = materialidsql + " or ";
      }
      materialidsql = materialidsql + " materialId='" + data[i].materialId + "' ";
    }
    var sql = "select materialId from GT75537AT42.GT75537AT42.Purchaseordedetail where " + materialidsql;
    //实体查询
    var res = ObjectStore.queryByYonQL(sql);
    let errmsg = "";
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < res.length; j++) {
        if (data[i].materialId == res[j].materialId) {
          errmsg = errmsg + "当前商品【" + data[i].materialname + "】已采购";
        }
      }
    }
    if (errmsg.length > 0) {
      throw new Error(errmsg);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });