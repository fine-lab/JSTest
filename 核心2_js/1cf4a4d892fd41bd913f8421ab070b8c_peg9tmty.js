let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取当前登录用户上下文
    var arr = new Array();
    let func1 = extrequire("AT161E5DFA09D00001.apiFunction.getToken");
    let res = func1.execute(require);
    let token = res.access_token;
    let flag = true;
    var pageNumber = 1;
    var pageData = null;
    while (flag) {
      let requestParams = {
        pageNumber: pageNumber,
        pageSize: 100
      };
      let url = "https://www.example.com/" + token + "";
      let apiResponse = postman("POST", url, null, JSON.stringify(requestParams));
      var resultStr = JSON.parse(apiResponse);
      if (resultStr.code == "200") {
        for (var i = 0; i < resultStr.data.list.length; i++) {
          let yhtUserId = resultStr.data.list[i].yhtUserId;
          if (yhtUserId != "2672a0ba-9807-4555-ba27-c521977fa7a7") {
            arr.push(yhtUserId);
          }
        }
        return { arr };
      } else {
        throw new Error("租户下用户身份列表查询失败");
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });