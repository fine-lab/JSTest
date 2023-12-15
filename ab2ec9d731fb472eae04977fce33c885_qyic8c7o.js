let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param, projectType) {
    var barCode = param["variablesMap"]["barCode"];
    var businessKey = replace(barCode, "|", "_");
    let url = "https://www.example.com/" + projectType + "&businessKey=" + businessKey;
    let apiResponse = openLinker("GET", url, "AT15B538EA16C8000A", "");
    let jsonResponse = JSON.parse(apiResponse); //将返回的内容转成JSON
    let apidata = jsonResponse.data.message; //获取ITAPI返回的内容
    let jsonData = JSON.parse(apidata); //将返回的内容转成JSON
    let returnMessage = jsonData.message; //获取返回值
    return returnMessage;
  }
}
exports({ entryPoint: MyTrigger });