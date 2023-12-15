let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //取到请求值
    var header = {
      "Content-Type": "application/json;charset=UTF-8",
      Cookie: "yht_access_token=" + request.yht_access_token
    };
    var params = request.params;
    var list = params.importcodetoidchList[0]; //只取第一条数据，不支持一次添加多个
    var body = {
      domain: params.domain,
      list: [
        {
          entityName: list.entityName,
          domain: list.domain,
          tenantId: list.tenantId,
          type: list.type,
          name: list.name,
          billno: list.billno,
          attr: list.attr,
          target: list.target,
          sort: list.sort
        }
      ]
    };
    let apiResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });