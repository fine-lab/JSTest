let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let access_token = request.access_token;
    let rateCode = request.rateCode;
    var ratetype;
    if (rateCode === null) {
      rateCode = "01";
    }
    let url = "https://www.example.com/" + access_token;
    const header = {
      "Content-Type": "application/json"
    };
    let body = {
      pageSize: 10,
      pageIndex: 1,
      code: rateCode
    };
    var ratetypeResp = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let exchangeResJson = JSON.parse(ratetypeResp);
    if ("200" === exchangeResJson.code) {
      ratetype = exchangeResJson.data.recordList[0].id;
    }
    return { ratetype };
  }
}
exports({ entryPoint: MyAPIHandler });