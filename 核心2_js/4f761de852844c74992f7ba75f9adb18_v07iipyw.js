let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const ids = request.data;
    //查询内容
    var object = {
      id: ids,
      compositions: [
        {
          name: "need_detailsList",
          compositions: []
        },
        {
          name: "annexList",
          compositions: []
        }
      ]
    };
    //实体查询
    var datas = ObjectStore.selectById("GT67297AT3.GT67297AT3.need_apply", object);
    return { res: datas };
  }
}
exports({ entryPoint: MyAPIHandler });