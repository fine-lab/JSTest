let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let corpId = request.p1;
    let deptId = request.p2;
    let busiTypeId = request.p3;
    let url = "https://www.example.com/" + busiTypeId + "&corpId=" + corpId + "&deptId=" + deptId;
    let apiResponse = openLinker("GET", url, "AT15B538EA16C8000A", "");
    let jsonResponse = JSON.parse(apiResponse); //将返回的内容转成JSON
    let apidata = jsonResponse.data.message; //获取ITAPI返回的内容
    let jsonData = JSON.parse(apidata); //将返回的内容转成JSON
    let returnMessage = jsonData.message; //获取返回值
    return {
      fomulaScriptRes: returnMessage
    };
  }
}
exports({ entryPoint: MyAPIHandler });