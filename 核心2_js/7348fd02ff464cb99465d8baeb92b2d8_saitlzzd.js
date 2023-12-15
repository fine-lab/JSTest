let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var querySql = "select count(1) from GT5646AT1.GT5646AT1.shoukuanribao where dr=0  and merchant is null  ";
    var res = ObjectStore.queryByYonQL(querySql, "developplatform");
    let url = "https://www.example.com/";
    let strResponse = postman("post", url, null, JSON.stringify(null));
    let msg = "ok";
    return { msg };
  }
}
exports({ entryPoint: MyAPIHandler });