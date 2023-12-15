let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {
      pageIndex: "1",
      pageSize: "20",
      salesOrg: request.salesOrg,
      salesOrgCode: request.salesOrgCode
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GT76853AT1", JSON.stringify(body));
    let apiResponseJson = JSON.parse(apiResponse);
    let recordList = undefined;
    if (apiResponseJson.code == "200") {
      let data = apiResponseJson.data;
      recordList = data.recordList;
    }
    return { recordList };
  }
}
exports({ entryPoint: MyAPIHandler });