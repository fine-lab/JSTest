let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var json = '{"smallNumber": 1, "bigNumber" : "1155931057176506370", "bigNumbe2r" : 1155931057176506379}';
    //先将长整型转换为字符串
    json = json.replace(/:s*([0-9]{15,})s*(,?)/g, ': "$1" $2');
    var json = JSON.parse(json);
    return { json: json };
  }
}
exports({ entryPoint: MyAPIHandler });