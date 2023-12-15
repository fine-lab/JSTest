let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let param = {
      proList: request.selectDatas,
      nowTime: request.nowTime
    };
    let header = { key: "yourkeyHere" };
    let url = "http://124.70.66.31:9994/project/project_url";
    let strResponse = postman("post", url, null, JSON.stringify(param));
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });