let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    // 获取前台传递的保存值
    var params = request.params; //保存的数据
    //获取Access Token
    let func1 = extrequire("GT19153AT99.openapi.getAccessToken");
    let res = func1.execute(request);
    var token = res.access_token;
    //请求数据
    let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), JSON.stringify(params));
    var result = JSON.parse(apiResponse);
    if (result.code != "200") {
      throw new Error(result.message + token);
    } else if (result.data.sucessCount == 0) {
      throw new Error(result.data.messages[0] + token);
    }
    var info = result.data;
    var YonSuiteEnd = new Date().getSeconds();
    return { info };
  }
}
exports({ entryPoint: MyAPIHandler });