let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT83441AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var queryCode = request.code;
    var contenttype = "application/json;charset=UTF-8";
    var message = "操作成功!";
    var header = {
      "Content-Type": contenttype
    };
    let code = 200;
    var pageIndex = 1;
    let wayfunc = extrequire("GT83441AT1.backDefaultGroup.getWayUrl");
    let wayRes = wayfunc.execute(null);
    var gatewayUrl = wayRes.gatewayUrl;
    var reqkhdetailurl = gatewayUrl + "/yonbip/digitalModel/product/list?access_token=" + token;
    let idList = new Array();
    var isdown = true;
    while (isdown) {
      var body = { pageIndex: pageIndex, pageSize: 50, code: queryCode };
      var khcustResponse = postman("POST", reqkhdetailurl, JSON.stringify(header), JSON.stringify(body));
      var kehucustresponseobj = JSON.parse(khcustResponse);
      if ("200" == kehucustresponseobj.code) {
        let queryData = kehucustresponseobj.data;
        if (queryData.recordList.length > 0) {
          for (var i = 0; i < queryData.recordList.length; i++) {
            let newData = { code: queryData.recordList[i].code, id: queryData.recordList[i].id };
            idList.push(newData);
          }
        }
        if (Number(queryData.pageCount) > pageIndex) {
          //总页数》当前页继续查询
          pageIndex = pageIndex + 1;
          isdown = true;
        } else {
          isdown = false;
        }
      } else {
        isdown = false;
        code = kehucustresponseobj.code;
        message = kehucustresponseobj.message;
      }
    }
    var returnData = { code: code, message: message, idList: idList };
    return returnData;
  }
}
exports({ entryPoint: MyAPIHandler });