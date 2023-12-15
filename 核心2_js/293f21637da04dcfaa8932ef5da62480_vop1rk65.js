let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var a = { test: "66666" };
    a.test += "7777===";
    a.test += JSON.stringify(request);
    return a; //request;//{"code": "1200"};//JSON.stringify(request);
  }
}
exports({ entryPoint: MyAPIHandler });