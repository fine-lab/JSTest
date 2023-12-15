let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var address = "https://intelliv.diwork.com/#/analysis/2c969bd3-1da6-4a19-8c85-84d8fdfb8c86?hb=share,close";
    return { address: address };
  }
}
exports({ entryPoint: MyAPIHandler });