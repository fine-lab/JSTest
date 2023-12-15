let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let deptId = request.deptId;
    let matrixLevel = request.matrixLevel;
    let url = "https://www.example.com/" + deptId + "&matrixLevel=" + matrixLevel;
    let apiResponse = openLinker("GET", url, "GT3407AT1", "");
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });