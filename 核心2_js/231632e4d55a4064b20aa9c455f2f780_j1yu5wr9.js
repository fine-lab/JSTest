let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = request.code;
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var reqwlurl = "https://www.example.com/" + token + "&id=" + id + "&code=" + code + "&merchantApplyRangeId=" + merchantApplyRangeId;
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    var body = {
      pageIndex: 1,
      pageSize: 30,
      code: code
    };
    let rst = "";
    var custResponse = postman("POST", reqwlurl, JSON.stringify(header), JSON.stringify(body));
    var custresponseobj = JSON.parse(custResponse);
    if ("200" == custresponseobj.code) {
      rst = custresponseobj.data;
    }
    let khList = rst.recordList;
    var id = request.id;
    var merchantApplyRangeId = khList[0].merchantApplyRangeId;
    var reqkhdetailurl = "https://www.example.com/" + token + "&id=" + id + "&code=" + code + "&merchantApplyRangeId=" + merchantApplyRangeId;
    let detail = "";
    var khcustResponse = postman("get", reqkhdetailurl, JSON.stringify(header), null);
    var kehucustresponseobj = JSON.parse(khcustResponse);
    if ("200" == kehucustresponseobj.code) {
      detail = kehucustresponseobj.data;
    }
    return { data: detail };
  }
}
exports({ entryPoint: MyAPIHandler });