let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let access_token = request.access_token;
    let org = request.org;
    let url = "https://www.example.com/" + access_token;
    const header = {
      "Content-Type": "application/json"
    };
    let body = {
      externalData: {
        parentorgid: org,
        enable: ["0", "1"]
      }
    };
    var deptResp = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let deptResJson = JSON.parse(deptResp);
    return { dept: deptResJson };
  }
}
exports({ entryPoint: MyAPIHandler });