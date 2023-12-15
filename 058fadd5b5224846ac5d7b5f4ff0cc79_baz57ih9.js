let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let url = "https://www.example.com/" + id;
    let expensBill = openLinker("GET", url, "GT1431AT3", null); //TODO：注意填写应用编码(请看注意事项)
    let data = JSON.parse(expensBill).data;
    return data;
  }
}
exports({ entryPoint: MyAPIHandler });