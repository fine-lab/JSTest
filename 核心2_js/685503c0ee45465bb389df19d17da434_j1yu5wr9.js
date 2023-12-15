let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let code = request.wlcode;
    let productApplyRange_orgId = request.productApplyRange_orgId;
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    let token = res.access_token;
    //根据物料编码查询物料相关信息
    let body = {
      pageIndex: 0,
      pageSize: 0,
      code: code,
      productApplyRange_orgId: productApplyRange_orgId
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
    let xqparam = rst.recordList;
    let response = "";
    for (let i = 0; i < xqparam.length; i++) {
      if (xqparam[i].code == code) {
        response = xqparam[i];
      }
    }
    let id = response.id;
    let productApplyRangeId = response.productApplyRangeId;
    let reqwlurl = "https://www.example.com/" + token + "&id=" + id + "&productApplyRangeId=" + productApplyRangeId;
    let xqrst = "";
    let custxqResponse = postman("GET", reqwlurl, JSON.stringify(header), null);
    let custresxqponseobj = JSON.parse(custxqResponse);
    if ("200" == custresxqponseobj.code) {
      xqrst = custresxqponseobj.data;
    }
    return { list: response, xqlist: xqrst };
  }
}
exports({ entryPoint: MyAPIHandler });