let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let url = "https://www.example.com/" + id; //传参要写到这里
    let apiResponse = openLinker("GET", url, "GT55244AT1", JSON.stringify({})); //TODO:注意填写应用编码（请看注意事项）；最后一个参数填写{}即可，不需要改动
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });