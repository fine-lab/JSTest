let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var obj = request.data;
    var sqlStr = "c2VsZWN0IGNvdW50KDEpIGZyb20gaG9iYnk=";
    obj.jobContext = sqlStr;
    let body = obj;
    let url =
      "https://www.example.com/";
    let apiResponse = openLinker("put", url, "GT64805AT1", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });