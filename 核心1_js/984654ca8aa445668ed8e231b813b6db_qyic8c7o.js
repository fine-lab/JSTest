let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let body = { billnum: "cust_customerCard", id: id };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "CUST", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });