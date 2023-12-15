let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var praybillId = request.praybillId;
    //查询内容
    var object = {
      id: praybillId,
      compositions: [
        {
          name: "defines",
          compositions: []
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectById("AXT000132.AXT000132.purchaseRequest", object, "ycReqManagement");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });