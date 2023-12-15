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
      let url = "https://www.example.com/" + id;
      let apiResponse = openLinker("GET", url, "GT30659AT3", JSON.stringify({}));
      var resp = JSON.parse(apiResponse);
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