let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var object = {
      renyuan: "1604290269399744515",
      ceshi: "12222",
      org_id: "youridHere"
    };
    var res = ObjectStore.insert("AT1721749608A0000B.AT1721749608A0000B.testtest", object, "");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });