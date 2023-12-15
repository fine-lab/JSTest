let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = request.domainName + "/yonbip/scm/purchaseorder/singleSave_v1";
    let body = request.value; //请求参数
    let apiResponse = openLinker("POST", url, "PU", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    var res = JSON.parse(apiResponse);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });