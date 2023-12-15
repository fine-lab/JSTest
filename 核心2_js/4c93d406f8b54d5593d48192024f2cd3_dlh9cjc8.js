let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //参数:["1","2","3"]
    var idArray = request.ids;
    var result = [];
    //查询自定义档案数据
    let func1 = extrequire("GT30661AT5.backDefaultGroup.getToken");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    for (var num = 0; num < idArray.length; num++) {
      var id = idArray[num];
      var strResponse = postman("get", "https://www.example.com/" + token + "&id=" + id, null, null);
      var resp = JSON.parse(strResponse);
      var name = "";
      var code = "";
      if (resp.code == "200") {
        let data = resp.data;
        result.push(data.code); //自定义档案编码
      }
    }
    return { codes: result };
  }
}
exports({ entryPoint: MyAPIHandler });