let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let list = param.data;
    //查询已存在的映射关系
    let sql = "select productcode, phymaterial_code from AT160194EA17D00009.AT160194EA17D00009.calcmappingtable where dr=0 and enable = 1";
    var result = ObjectStore.queryByYonQL(sql);
    let compareResult = [];
    for (var i in list) {
      //产品编码
      let productExcel = list[i].productId_code;
      //实物物料编码
      let phymaterialExcel = list[i].phymaterial_id_code;
      for (var j in result) {
        let productcode = result[j].productcode;
        let phymaterialCode = result[j].phymaterial_code;
        if (productExcel == productcode && phymaterialExcel == phymaterialCode) {
          compareResult.push("物料映射关系已存在, 算力服务产品编码为: " + productExcel + ", 实物物料编码为: " + phymaterialExcel);
        }
      }
    }
    if (compareResult.length > 0) {
      throw new Error(compareResult);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });