let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var accessToken;
    // 配置文件
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    request.data.forEach((self, index) => {
      salesout({ self: self, index: index + 1 });
    });
    return { code: 200, data: [], message: "成功" };
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function salesout(params) {
      // 响应信息
      let result = postman("post", "https://www.example.com/" + getAccessToken(), "", params.self);
      try {
        // 转为JSON对象
        result = JSON.parse(result);
        // 返回信息校验
        if (result.code != "200") {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("销售出库第" + params.index + "条数据保存 " + e);
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });