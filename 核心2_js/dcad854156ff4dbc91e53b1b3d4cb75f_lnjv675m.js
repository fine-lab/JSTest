let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {};
    let token = "";
    if (!!request.token) {
      token += request.token;
    } else {
      token += "a38f3d559c51711c3bd04ed05214328d5a1a846680faa2430cb9c1929893d28d7a674e43cb00ed136be46cde6bca7d13c20f5f1122b6b84cfe423d51f172ddd185b613d9b165a8798eb608258989dba6";
    }
    let header = {
      DMYToken: token,
      DMYState: "dmyCode"
    };
    let strResponse = postman("get", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    let json = JSON.parse(strResponse);
    let { status } = json;
    let acc = { message: "447888" };
    if (!!status) {
      console.log("维护中...");
    } else {
      acc = json;
    }
    return { acc };
  }
}
exports({ entryPoint: MyAPIHandler });