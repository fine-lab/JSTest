let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let access_token = request.access_token;
    let orgName = request.orgName;
    let url = "https://www.example.com/" + access_token;
    const header = {
      "Content-Type": "application/json"
    };
    let body = {
      fields: ["id", "code", "name"],
      pageIndex: 1,
      pageSize: 11,
      conditions: [
        {
          operator: "=",
          value: orgName,
          field: "name"
        }
      ]
    };
    let accbook = -1;
    var strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let accbookResJson = JSON.parse(strResponse);
    if ("200" === accbookResJson.code && accbookResJson.data.length > 0) {
      accbook = accbookResJson.data[0].id;
    }
    return { accbook };
  }
}
exports({ entryPoint: MyAPIHandler });