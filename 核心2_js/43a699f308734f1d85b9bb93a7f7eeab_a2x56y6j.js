let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var uri = "GT41204AT5.GT41204AT5.zhangbucollection";
    //删除内容
    var object = [{ id: "实体id", pubts: "发布时间", subTable: [{ id: "子实体id" }] }];
    //删除实体
    var res = ObjectStore.deleteBatch(uri, object, "6af0c4acList");
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });