let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let access_token = request.access_token;
    let typecode = request.typecode;
    let url = "https://www.example.com/" + access_token;
    const header = {
      "Content-Type": "application/json"
    };
    let body = {
      fields: ["id", "code", "name"],
      pageIndex: 1,
      pageSize: 100,
      conditions: [
        {
          value: typecode,
          field: "code",
          operator: "="
        }
      ]
    };
    let vouchertype = -1;
    var strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let resJson = JSON.parse(strResponse);
    if ("200" === resJson.code) {
      vouchertype = resJson.data[0].id;
    }
    return { vouchertype };
  }
}
exports({ entryPoint: MyAPIHandler });