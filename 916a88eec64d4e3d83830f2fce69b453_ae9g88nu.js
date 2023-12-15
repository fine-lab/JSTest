let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sql = "select * from GT22176AT10.GT22176AT10.durg_api_config limit 1";
    let res = ObjectStore.queryByYonQL(sql);
    //信息体
    let body = {
      body: request
    };
    //信息头
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    // 可以直观的看到具体的错误信息
    let responseObj = postman("post", res[0].api_url, JSON.stringify(header), JSON.stringify(body));
    return {
      responseObj
    };
  }
}
exports({ entryPoint: MyAPIHandler });