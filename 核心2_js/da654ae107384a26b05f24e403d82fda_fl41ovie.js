let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //通过ID查询
    var object = { id: "youridHere" };
    var res = ObjectStore.selectById("GT7483AT95.GT7483AT95.licenseyw", object);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });