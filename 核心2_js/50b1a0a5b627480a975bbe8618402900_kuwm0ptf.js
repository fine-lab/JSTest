let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let url = "https://www.example.com/";
    let body = {}; //请求参数
    let apiResponse = openLinker("POST", url, "GT50458AT50", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });