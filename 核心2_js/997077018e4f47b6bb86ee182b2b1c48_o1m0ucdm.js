let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    let url = "https://www.example.com/" + id;
    var apiResponse = openLinker("GET", url, "ycContractManagement", null);
    var apiResponseJson = JSON.parse(apiResponse);
    if ("200" == apiResponseJson.code) {
      if (apiResponseJson.data.status) {
        return { success: "0" };
        throw new Error("数据数量为0");
      } else {
        let func = extrequire("GT879AT352.apiEnd.insertHt");
        apiResponseJson.data.beforeid = id + "";
        let res = func.execute(apiResponseJson.data);
        if (res.code == "1") {
          return { success: "0", msg: res.msg };
        }
      }
    } else {
      return { success: "0" };
      throw new Error("获取数据失败");
    }
    return { success: "1" };
  }
}
exports({ entryPoint: MyAPIHandler });