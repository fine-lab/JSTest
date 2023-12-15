let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取分包合同号
    var data = request.data.subcontractId;
    //根据分包合同号查询分包合同详情表
    var sql = "select * from GT102917AT3.GT102917AT3.subcontract where subcontractNo = '" + data + " '";
    var resultList = ObjectStore.queryByYonQL(sql);
    return { resultList };
  }
}
exports({ entryPoint: MyAPIHandler });