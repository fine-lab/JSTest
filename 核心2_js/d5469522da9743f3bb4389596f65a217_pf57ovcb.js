let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let responseObj = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(request));
    throw new Error(responseObj);
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });