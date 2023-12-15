let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var xmid = request.xmid;
    var billNo = request.billNo;
    //根据项目id获取对应实体URI
    var res = ObjectStore.queryByYonQL("select biaotougongjulancode,guan from AT17C2308216C00006.AT17C2308216C00006.zsjg where billNo='" + billNo + "'");
    //查询需要打开的单据id
    var res1 = ObjectStore.queryByYonQL("select id from " + res[0].biaotougongjulancode + " where " + res[0].guan + "='" + xmid + "'");
    return { djid: res1[0].id };
  }
}
exports({ entryPoint: MyAPIHandler });