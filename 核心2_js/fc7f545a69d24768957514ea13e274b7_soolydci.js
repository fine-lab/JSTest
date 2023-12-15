let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let access_token = request.access_token;
    let custCode = request.custCode;
    let org = request.org;
    let url = "https://www.example.com/" + access_token;
    const header = {
      "Content-Type": "application/json"
    };
    let body = {
      pageIndex: 1,
      pageSize: 100,
      code: custCode,
      "merchantAppliedDetail.merchantApplyRangeId.orgId": org
    };
    let cust = -1;
    var custResp = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let custResJson = JSON.parse(custResp);
    if ("200" === custResJson.code && custResJson.data.recordCount === 1) {
      cust = custResJson.data.recordList[0].id;
    }
    return { cust };
  }
}
exports({ entryPoint: MyAPIHandler });