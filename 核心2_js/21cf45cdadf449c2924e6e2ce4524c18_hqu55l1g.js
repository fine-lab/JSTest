let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT80266AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var id = request.id; //物料id
    var orgId = request.orgId; //适应组织id
    var agentClassId = request.agentClassId; //客户分类id
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    var reqkhdetailurl = "https://www.example.com/" + token;
    let detail = "";
    var body = {
      pageIndex: "1",
      pageSize: "100",
      priceTemplateId: 2500855243772190,
      status: "VALID",
      simpleVOs: [
        {
          op: "eq",
          field: "dimension.productId",
          value1: id
        },
        {
          op: "eq",
          field: "dimension.agentClassId",
          value1: agentClassId
        }
      ]
    };
    var returnData = {};
    var khcustResponse = postman("POST", reqkhdetailurl, JSON.stringify(header), JSON.stringify(body));
    var kehucustresponseobj = JSON.parse(khcustResponse);
    if ("200" == kehucustresponseobj.code) {
      detail = kehucustresponseobj.data.recordList;
      if (detail != null) {
        for (var i = 0; i < detail.length; i++) {
          let detailData = detail[i];
          if (orgId == detailData.orgScopeId) {
            returnData.detail = detailData;
            return { returnData };
          }
        }
      }
    }
    returnData = null;
    return { returnData };
  }
}
exports({ entryPoint: MyAPIHandler });