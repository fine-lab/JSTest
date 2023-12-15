let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT64724AT4.backDefaultGroup.token");
    let res = func1.execute(request);
    let token = res.access_token;
    let codeId = request.codeId;
    //根据物料编码查询物料相关信息
    let body = {
      pageIndex: 1,
      pageSize: 10,
      code: codeId
    };
    let reqwlListurl = "https://www.example.com/" + token;
    let contenttype = "application/json;charset=UTF-8";
    let message = "";
    let header = {
      "Content-Type": contenttype
    };
    let rst = "";
    let custResponse = postman("POST", reqwlListurl, JSON.stringify(header), JSON.stringify(body));
    let custresponseobj = JSON.parse(custResponse);
    if ("200" == custresponseobj.code) {
      rst = custresponseobj.data;
    }
    return { rst: rst };
  }
}
exports({ entryPoint: MyAPIHandler });