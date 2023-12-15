let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 合同编号
    let contractNumber = request.contractNumber;
    if (contractNumber == null) {
      throw new Error("项目合同号为空，请维护后重试");
    }
    // 查询已完结的
    let sql = "select ziduan2 from GT59740AT1.GT59740AT1.RJ001 where ziduan2 = '" + contractNumber + "' and isEnd = '1'";
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      return { flag: "true" };
    } else {
      return { flag: "false" };
    }
  }
}
exports({ entryPoint: MyAPIHandler });