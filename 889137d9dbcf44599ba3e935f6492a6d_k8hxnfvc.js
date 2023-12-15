let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(deptId, matrixLevel) {
    let url = "https://www.example.com/" + deptId + "&matrixLevel=" + matrixLevel;
    let apiResponse = openLinker("GET", url, "GT3407AT1", "");
    let jsonResponse = JSON.parse(apiResponse); //将返回的内容转成JSON
    let apidata = jsonResponse.data.message; //获取ITAPI返回的内容
    let jsonData = JSON.parse(apidata); //将返回的内容转成JSON
    let returnMessage = jsonData.message; //获取返回值
    return returnMessage;
  }
}
exports({ entryPoint: MyAPIHandler });