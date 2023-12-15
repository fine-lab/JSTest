let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var r = request.r;
    //查询内容
    var object = {
      id: "role",
      compositions: [
        {
          name: "role",
          compositions: []
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectById("GT55948AT3.GT55948AT3.role", object);
    return { apidata: res };
  }
}
exports({ entryPoint: MyAPIHandler });