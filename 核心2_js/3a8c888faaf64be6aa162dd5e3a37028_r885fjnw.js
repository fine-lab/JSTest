let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let aa = "http://dzfp.ycansoft.com:8081/dzfppdf/honda/91440402MA573L3X5T/2023/05/11/04400210511300508224.ofd";
    return { aa };
  }
}
exports({ entryPoint: MyAPIHandler });