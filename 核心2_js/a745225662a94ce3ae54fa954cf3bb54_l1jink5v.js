let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let params = {
      pageSize: 10,
      pageIndex: 0,
      schemeName: "customerdoc_list",
      isDefault: "true",
      custdocdefid: request.custdocdefid,
      externalData: {
        serviceCode: request.serviceCode
      },
      billnum: "customerdoc_list"
    };
    let url = "https://www.example.com/";
    let strResponse = postman("post", url + "?access_token=" + request.access_token, null, JSON.stringify(params));
    let resObj = JSON.parse(strResponse);
    return { rst: resObj, request: request };
  }
}
exports({ entryPoint: MyAPIHandler });