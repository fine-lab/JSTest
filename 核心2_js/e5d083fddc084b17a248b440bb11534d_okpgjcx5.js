let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    // 开票类别
    var organisationcode = request.code;
    // 开票类别
    var uri = "GT21859AT11.GT21859AT11.kaipiaoleibiednagan";
    var sql = "select * from " + uri + " where organisationcode = '" + organisationcode + "'";
    var res = ObjectStore.queryByYonQL(sql);
    // 新增
    var object = [
      {
        mingchen: res[0].mingchen,
        jiancheng: "test1",
        organisation: res[0].organisation,
        organisationcode: "002",
        qiyongzhuangtai: res[0].qiyongzhuangtai,
        subTable: [{ mingchen: res[0].mingchen }]
      }
    ];
    var ress = ObjectStore.insert(uri, object, organisationcode);
    return { request: request };
  }
}
exports({ entryPoint: MyAPIHandler });