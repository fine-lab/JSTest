let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var object = {
      ids: ["主实体数据id", "主实体数据id"],
      compositions: [
        {
          name: "元数据中的主子关系",
          compositions: [
            //查询条件
          ]
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectBatchIds("实体url", object);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });