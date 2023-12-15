let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const code = request.udhCode;
    let body = { deletRow: 1 };
    let url = "https://www.example.com/";
    let res = openLinker("POST", url, "GT80750AT4", JSON.stringify({ udhNo: code, data: body }));
    return {
      code: 200,
      data: res
    };
  }
}
exports({ entryPoint: MyAPIHandler });