let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let param = {
      material: request.selectDatas,
      creaetName: request.creaetName,
      creaetId: request.creaetId,
      nowTime: request.nowTime
    };
    let header = { key: "yourkeyHere" };
    let url = "http://124.70.66.31:9994/Material/MaterialIssue";
    let strResponse = postman("post", url, null, JSON.stringify(param));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });