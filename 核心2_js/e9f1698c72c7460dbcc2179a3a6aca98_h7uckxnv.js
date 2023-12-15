let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 构建请求Body体
    var data = param.data[0];
    let url = "https://www.example.com/" + data.id;
    let apiResponse = openLinker("GET", url, "PU", null);
    let reqBodyObj = JSON.parse(apiResponse).data;
    reqBodyObj["docTemplateId"] = "b002a772cddb46d7a79b1de5456188e9";
    const header = {
      "Content-Type": "application/json; charset=UTF-8"
    };
    var strResponse = postman("POST", "https://www.example.com/", JSON.stringify(header), JSON.stringify(reqBodyObj));
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });