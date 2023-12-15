let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var object = { id: id };
    var res = ObjectStore.selectByMap("AT1740DE240888000B.AT1740DE240888000B.ecologicalservicecode", object);
    // 退回后 删除此条数据
    var obj = { id: id, pubts: res[0].createTime };
    var resDelete = ObjectStore.deleteById("AT1740DE240888000B.AT1740DE240888000B.ecologicalservicecode", object, "ybe1ce2b59");
    return { resDelete };
  }
}
exports({ entryPoint: MyAPIHandler });