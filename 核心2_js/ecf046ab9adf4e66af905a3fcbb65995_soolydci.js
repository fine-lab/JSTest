let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let access_token = request.access_token;
    let currencyCode = request.currencyCode;
    let currencyName = request.currencyName;
    if (currencyCode === null || currencyCode === undefined) {
      currencyCode = "CNY";
    }
    let url = "https://www.example.com/" + access_token;
    const header = {
      "Content-Type": "application/json"
    };
    let body = {
      pageSize: 10,
      pageIndex: 1,
      code: currencyCode,
      name: currencyName
    };
    let currency;
    var currencyResp = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let currencyResJson = JSON.parse(currencyResp);
    if ("200" === currencyResJson.code) {
      currency = currencyResJson.data.recordList[0].id;
    }
    return { currency };
  }
}
exports({ entryPoint: MyAPIHandler });