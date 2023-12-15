let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var beginTime = request.beginTime;
    var agentId = request.agentId;
    var productId = request.productId;
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    //订单状态CONFIRMORDER:开立、DELIVERY_PART:部分发货、DELIVERY_TAKE_PART:部分发货待收货、DELIVERGOODS:待发货、TAKEDELIVERY:待收货、ENDORDER:已完成、OPPOSE:已取消、APPROVING:审批中
    var token = res.access_token;
    //获取销售订单详情
    var body = {
      pageIndex: 0,
      pageSize: 0,
      open_orderDate_begin: beginTime,
      nextStatusName: "TAKEDELIVERY",
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
    var custResponse = postman("Post", reqwlurl, JSON.stringify(header), JSON.stringify(body));
    var custresponseobj = JSON.parse(custResponse);
    if ("200" == custresponseobj.code) {
      rst = custresponseobj.data;
    }
    return { rst: rst };
  }
}
exports({ entryPoint: MyAPIHandler });