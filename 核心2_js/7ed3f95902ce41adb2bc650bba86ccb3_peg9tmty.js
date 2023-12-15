let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 制单人
    let Makingpeople = request.Makingpeople;
    // 获取上下文
    var AppContextRes = AppContext();
    var resultJSON = JSON.parse(AppContextRes);
    var contextName = resultJSON.currentUser.name;
    let requestBody = {
      roleId: "yourIdHere",
      pageNumber: 1,
      pageSize: 100
    };
    let arr = new Array();
    arr.push("9538f32d-a0d2-497b-a48a-e16c481cec7f");
    arr.push("b468d9d0-d938-4119-b4c3-2653c073efd5");
    arr.push("46b958a3-dd80-4b1f-8d81-36b5cb4dd0e4");
    for (var g = 0; g < arr.length; g++) {
      let requestBody = {
        roleId: arr[g],
        pageNumber: 1,
        pageSize: 100
      };
      let func1 = extrequire("AT161E5DFA09D00001.apiFunction.getToken");
      let res = func1.execute(null, null);
      let ContentType = "application/json;charset=UTF-8";
      let header = { "Content-Type": ContentType };
      let access_token = res.access_token;
      // 查询角色关联的用户身份
      let url = "https://www.example.com/" + access_token;
      let apiResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(requestBody));
      var resultStre = JSON.parse(apiResponse);
      var Linkedlist = resultStre.data.list;
      for (var j = 0; j < Linkedlist.length; j++) {
        var resDeatailse = Linkedlist[j];
        var roleNames = resDeatailse.name;
        if (roleNames == contextName) {
          return { roleName: roleNames };
        }
      }
    }
    let func1 = extrequire("AT161E5DFA09D00001.apiFunction.getToken");
    let res = func1.execute(null, null);
    let ContentType = "application/json;charset=UTF-8";
    let header = { "Content-Type": ContentType };
    let access_token = res.access_token;
    // 查询角色关联的用户身份
    let url = "https://www.example.com/" + access_token;
    let apiResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(requestBody));
    var resultStr = JSON.parse(apiResponse);
    var list = resultStr.data.list;
    for (var i = 0; i < list.length; i++) {
      var resDeatails = list[i];
      var roleName = resDeatails.name;
      if (roleName == Makingpeople) {
        return { roleName: roleName };
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });