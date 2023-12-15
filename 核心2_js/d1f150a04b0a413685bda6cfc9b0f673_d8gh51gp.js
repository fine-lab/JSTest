let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ybCode = request.ybCode;
    //查询检测订单
    var detectOrderSql =
      "select * from AT15F164F008080007.AT15F164F008080007.DetectOrder where sampleCode='" + ybCode + "' and srpingzhenghao is null and pingzhenghao is null order by importData desc";
    var detectOrderRes = ObjectStore.queryByYonQL(detectOrderSql, "developplatform");
    return { detectOrderRes };
  }
}
exports({ entryPoint: MyAPIHandler });