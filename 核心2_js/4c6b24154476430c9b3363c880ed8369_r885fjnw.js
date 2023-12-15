let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/";
    let body = {
      pageIndex: 1,
      pageSize: 10
    };
    let apiResponse = openLinker("POST", url, "AT17B405D009400004", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });