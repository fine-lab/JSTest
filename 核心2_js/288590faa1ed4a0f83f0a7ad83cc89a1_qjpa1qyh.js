let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var materialid = request.bommingchen;
    var token = "";
    let func1 = extrequire("GT46349AT1.backDefaultGroup.gettoken");
    let res = func1.execute(request);
    token = res.access_token;
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      pageIndex: "1",
      pageSize: "10",
      code: materialid
    };
    //请求数据
    let apiResponse = postman("post", base_path + "?access_token=" + token, JSON.stringify(header), JSON.stringify(body));
    var apiResponsejaon = JSON.parse(apiResponse);
    var queryCode = apiResponsejaon.code;
    if (queryCode !== "200") {
      throw new Error("查询物料错误" + apiResponsejaon.message);
    } else {
      var recordCount = apiResponsejaon.data.recordCount;
      if (recordCount !== 0) {
        throw new Error("生成物料错误" + bommingchen + "已存在,请修改");
      }
    }
    return { recordCount: recordCount, request: request, apiResponsejaon: apiResponsejaon };
  }
}
exports({ entryPoint: MyAPIHandler });