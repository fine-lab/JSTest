let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var searchObj = { id: request.id };
    //实体查询
    var faillog = ObjectStore.selectById("GT879AT352.GT879AT352.xiaofengfaillog", searchObj);
    var id = faillog.hetongid;
    let url = "https://www.example.com/" + id;
    var apiResponse = openLinker("GET", url, "ycContractManagement", null);
    var apiResponseJson = JSON.parse(apiResponse);
    if ("200" == apiResponseJson.code) {
      if (apiResponseJson.data.status) {
        throw new Error("数据数量为0,重推失败");
      } else {
        //调用晓枫的函数
        let func3 = extrequire("GT879AT352.apiEnd.insertXiaoFengHt");
        let res3 = func3.execute(apiResponseJson.data);
      }
    }
    var object = { id: faillog.id, issend: "1" };
    var res = ObjectStore.updateById("GT879AT352.GT879AT352.xiaofengfaillog", object, "4d18bb1c");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });