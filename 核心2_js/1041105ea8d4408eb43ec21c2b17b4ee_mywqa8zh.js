let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let age = request.age.id;
    let body = {};
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let responseObj = postman("get", "https://www.example.com/" + "?id=" + age, JSON.stringify(header), null);
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });