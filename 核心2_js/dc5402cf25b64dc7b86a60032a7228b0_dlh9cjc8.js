let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //参数:["1","2","3"]
    var idArray = request.ids;
    var result = [];
    //查询自定义档案数据
    let func1 = extrequire("GT30659AT3.backDefaultGroup.getAccessToken");
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
        result.push(data.name.zh_CN); //自定义档案编码data.code
      }
    }
    return { names: result };
  }
}
exports({ entryPoint: MyAPIHandler });