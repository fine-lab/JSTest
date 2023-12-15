let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = [
      { id: "youridHere", new1: "value" },
      { id: "youridHere", new1: "value" }
    ];
    var res = ObjectStore.updateBatch("GT30490AT6.GT30490AT6.new0622", object, "a710c871");
    // 查询内容
    var res = ObjectStore.queryByYonQL("select new1,new2,new3 from GT30490AT6.GT30490AT6.new0622");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });