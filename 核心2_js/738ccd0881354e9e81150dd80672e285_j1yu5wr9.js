let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var khflId = request.khflId;
    var custCategoryApplyRangesId = request.custCategoryApplyRangesId;
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    //获取客户分类详情
    var reqwlurl = "https://www.example.com/" + token + "&id=" + khflId + "&custCategoryApplyRangesId=" + custCategoryApplyRangesId;
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    let rst = "";
    var custResponse = postman("GET", reqwlurl, JSON.stringify(header), null);
    var custresponseobj = JSON.parse(custResponse);
    if ("200" == custresponseobj.code) {
      rst = custresponseobj.data;
    }
    return { data: rst };
  }
}
exports({ entryPoint: MyAPIHandler });