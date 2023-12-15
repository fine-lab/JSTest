let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //从页面获取数据
    var data = request.data;
    //根据分包合同查询变更明细详情表
    var sql = "select subcontractNo from GT102917AT3.GT102917AT3.changeDetails where subcontractNo = '" + data + " '";
    var resultList = ObjectStore.queryByYonQL(sql);
    return { resultList };
  }
}
exports({ entryPoint: MyAPIHandler });