let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var orgId = request.orgId;
    var result = unshelvesProduct(); //1680764756294631436  2590351100121345
    var accessToken;
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function unshelvesProduct() {
      let res = postman("get", "https://www.example.com/" + getAccessToken() + "&id=" + id + "&orgId=" + orgId, "", "");
      // 转为JSON对象
      try {
        res = JSON.parse(res);
        // 返回信息校验
        if (res.code == "200") {
          return { res };
        }
      } catch (e) {
        throw new Error("物料档案详情异常:" + e);
      }
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });