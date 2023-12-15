let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let url = "https://www.example.com/";
    let body = {
      pageSize: "10",
      pageIndex: "1"
    }; //请求参数
    let apiResponse = openLinker("POST", url, "GT40271AT2", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    throw new Error(JSON.stringify(apiResponse));
    return {};
  }
}
exports({ entryPoint: MyTrigger });