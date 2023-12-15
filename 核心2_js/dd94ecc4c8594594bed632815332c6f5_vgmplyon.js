let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = { key: "yourkeyHere" };
    let header = { key: "yourkeyHere" };
    let strResponse = postman(
      "post",
      "https://www.example.com/" + request.ordercode,
      JSON.stringify(header),
      JSON.stringify(body)
    );
    return { data: strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });