let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let access_token = request.access_token;
    let banktypeName = request.banktypeName;
    let org = request.org;
    let url = "https://www.example.com/" + access_token;
    const header = {
      "Content-Type": "application/json"
    };
    let body = {
      pageIndex: 1,
      pageSize: 100,
      name: banktypeName
    };
    let banktype = -1;
    var banktypeResp = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let banktypeResJson = JSON.parse(banktypeResp);
    if ("200" === banktypeResJson.code && banktypeResJson.data.recordCount === 1) {
      banktype = custResJson.data.recordList[0].id;
    }
    return { banktype };
  }
}
exports({ entryPoint: MyAPIHandler });