let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgname = request.orgname;
    let func1 = extrequire("GT17832AT1.common.getToken");
    let res = func1.execute({ appkey: "yourkeyHere", appsecrect: "7836b880d11b406085f2dad91aa1e8b0" }, null);
    let access_token = res.access_token;
    let url = "https://www.example.com/" + access_token;
    const header = {
      "Content-Type": "application/json"
    };
    let body = {
      name: orgname,
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
    return { strResponse, pk_org };
  }
}
exports({ entryPoint: MyAPIHandler });