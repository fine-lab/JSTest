let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var obj = {};
    obj.title = request.keyword1;
    obj.readername = request.keyword2;
    obj.period = request.keyword3;
    obj.purpose = request.keyword4;
    obj.eletype = request.keyword5;
    obj.enttype = request.keyword6;
    obj.id = request.keyword7;
    obj.userid = request.keyword8;
    var arr = [];
    arr.push(obj);
    var url = "https://www.example.com/";
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var body = { arr };
    let apiResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });