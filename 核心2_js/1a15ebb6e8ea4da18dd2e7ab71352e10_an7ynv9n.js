let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var ids = request.ids;
    var result = unshelvesProduct();
    var accessToken;
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function unshelvesProduct() {
      let id = {
        id: ids
      };
      let data = {
        data: id
      };
      let res = postman("post", "https://www.example.com/" + getAccessToken(), null, JSON.stringify(data));
      // 转为JSON对象
      try {
        res = JSON.parse(res);
        return { res };
        // 返回信息校验
        if (res.code == "200") {
          return { res };
        }
      } catch (e) {
        throw new Error("物料档案详情列表异常:" + e);
      }
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });