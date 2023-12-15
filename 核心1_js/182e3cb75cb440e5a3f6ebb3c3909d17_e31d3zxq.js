let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let customerListRes = [];
    let org_id = request.orgId;
    let res = AppContext();
    let obj = JSON.parse(res);
    let tenantid = obj.currentUser.tenantId;
    let token = obj.token;
    const dataCenterUrl = "https://www.example.com/" + tenantid;
    let gatewayUrl = postman("get", dataCenterUrl, null, null);
    let responseJson = JSON.parse(gatewayUrl);
    let apiPrefix = responseJson.data.gatewayUrl;
    //沙箱环境
    var apiRestPre = "https://www.example.com/";
    if (apiPrefix != "https://www.example.com/") {
      //生产环境
      apiRestPre = "https://www.example.com/";
    }
    //灰度
    if (apiPrefix == "https://www.example.com/") {
      apiRestPre = "https://www.example.com/";
    }
    //核心三
    if (apiPrefix == "https://www.example.com/") {
      apiRestPre = "https://www.example.com/";
    }
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      token: token
    };
    let params = { orgId: org_id };
    let str_customersinfo = postman("post", apiRestPre + "/gsp/getCustomerIDList", JSON.stringify(header), JSON.stringify(params));
    let customersinfo = JSON.parse(str_customersinfo);
    let customerList = customersinfo.data;
    return { customerListRes };
  }
}
exports({ entryPoint: MyAPIHandler });