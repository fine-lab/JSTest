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
      name: orgName,
      enable: "1"
    };
    var strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let jsonData = JSON.parse(strResponse);
    let pk_org;
    if ("200" === jsonData.code && jsonData.data.length > 0) {
      let data = jsonData.data;
      pk_org = data[0].orgid;
      let children = jsonData.data[0].children;
      do {
        if (children !== null && children !== undefined) {
          pk_org = children[0].orgid;
          children = children[0].children;
        }
      } while (children !== null && children !== undefined);
    }
    return { pk_org };
  }
}
exports({ entryPoint: MyAPIHandler });