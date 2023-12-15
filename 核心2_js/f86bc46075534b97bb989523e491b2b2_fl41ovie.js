let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取用户信息
    var res = AppContext();
    var userInfo = JSON.parse(res);
    var params = Object.assign(userInfo, request);
    var paramsJson = JSON.stringify(params);
    var strResponse = postman("post", "https://localhost:8080/lic/generator/test/resources", JSON.stringify({}), paramsJson);
    if (JSON.parse(strResponse).success == true) {
      //将数据保存到数据库
      var resp = ObjectStore.insert("GT7483AT95.GT7483AT95.licenseyw", params, "f5dd21ad");
      return { response: "ok" };
    } else {
      return;
    }
  }
}
exports({ entryPoint: MyAPIHandler });