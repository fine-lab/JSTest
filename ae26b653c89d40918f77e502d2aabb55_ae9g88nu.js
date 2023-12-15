let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var body = request.body;
    var uri = body.uri; // 实体URI
    var operate = body.operate; // 操作类型 insert 新增。update 更新
    var billcode = body.billcode; // 表单编码
    var entityObj = body.entityObj; // 实体对象
    // 新增实体
    if (operate == "insert") {
      var res = ObjectStore.insert(uri, entityObj, billcode);
      // 更新实体
    } else if (operate == "update") {
      var res = ObjectStore.updateById(uri, entityObj, billcode);
    } else {
      throw new Error("operate操作类型不能为空！");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });