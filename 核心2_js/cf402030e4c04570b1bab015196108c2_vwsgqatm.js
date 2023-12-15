let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = { matcode: request.matcode, supcode: request.supcode };
    let header = { "Content-Type": "application/json;charset=UTF-8" };
    let strResponse = postman("post", "http://gclncc.sljt666.com:8060/uapws/rest/servicevmi/query", JSON.stringify(header), JSON.stringify(body));
    let tenantId = ObjectStore.user().tenantId;
    return { data: strResponse, user: ObjectStore.user() };
  }
}
exports({ entryPoint: MyAPIHandler });