let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    //查询内容
    var object = {
      id: id,
      compositions: [
        {
          name: "part_out_resouce_advisorList",
          compositions: []
        }
      ]
    };
    //实体查询
    var proDetail = ObjectStore.selectById("AT17E908FC08280001.AT17E908FC08280001.part_out_resouce", object);
    return { proDetail };
  }
}
exports({ entryPoint: MyAPIHandler });