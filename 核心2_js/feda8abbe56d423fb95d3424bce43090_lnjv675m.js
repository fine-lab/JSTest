let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = { code: [request.code] };
    request = {};
    request.uri = "/yonbip/digitalModel/product/batch";
    //同步到系统员工
    request.body = { data: data };
    let func = extrequire("GT34544AT7.common.baseOpenApi");
    let res = func.execute(request).res;
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });