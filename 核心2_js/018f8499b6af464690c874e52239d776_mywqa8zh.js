let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 构建请求Body体
    var data = param.data[0];
    let url = "https://www.example.com/" + data.id;
    let apiResponse = openLinker("GET", url, "PU", null);
    throw new Error(JSON.stringify(JSON.parse(apiResponse).data));
    let reqBodyObj = JSON.parse(apiResponse).data;
    reqBodyObj["docTemplateId"] = "bf16c7876b294d398b961d8b615b6b8b";
    const header = {
      "Content-Type": "application/json; charset=UTF-8"
    };
    var strResponse = postman("POST", "https://www.example.com/", JSON.stringify(header), JSON.stringify(reqBodyObj));
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });