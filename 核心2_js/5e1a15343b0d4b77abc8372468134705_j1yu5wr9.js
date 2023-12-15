let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var beginTime = request.beginTime;
    var agentId = request.agentId;
    var productId = request.productId;
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    //订单状态单据状态, SUBMITSALERETURN:待退货审批、CONFIRMSALERETURNORDER:待退货、SALERETURNING:退货中、ENDSALERETURN:已完成、OPPOSESALERETURN:已驳回、
    var token = res.access_token;
    //获取销售退货详情
    var body = {
      open_createTime_begin: beginTime,
      pageIndex: 0,
      pageSize: 0,
      saleReturnStatus: "ENDSALERETURN",
      isSum: false,
      simpleVOs: [
        {
          op: "eq",
          value1: agentId,
          field: "agentId"
        }
      ]
    };
    var reqwlurl = "https://www.example.com/" + token;
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    let rst = "";
    var custResponse = postman("POST", reqwlurl, JSON.stringify(header), JSON.stringify(body));
    var custresponseobj = JSON.parse(custResponse);
    if ("200" == custresponseobj.code) {
      rst = custresponseobj.data;
    }
    return { rst: rst };
  }
}
exports({ entryPoint: MyAPIHandler });