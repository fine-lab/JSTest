let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var datas = request.data;
    for (let index = 0; index < datas.length; index++) {
      const element = datas[index];
      var rebateid1 = element.rebateid; //返利政策id
      var rebateMoney = element.rebateMoney;
      var querySaleSql = "select balance FROM AT16388E3408680009.AT16388E3408680009.mzgd_RebatePolicys where id='" + rebateid1 + "'";
      throw new Error("test-下发单据给OA-" + JSON.stringify(balancesql));
    }
    return { xuwenlong: "susu" };
  }
}
exports({ entryPoint: MyAPIHandler });