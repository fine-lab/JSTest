let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let pritemid_sourcehid = request.pritemid_sourcehid;
    //查询内容
    var object = {
      id: pritemid_sourcehid,
      compositions: [
        {
          name: "defines",
          compositions: []
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectById("AXT000132.AXT000132.purchaseRequest", object, "ycReqManagement");
  }
}
exports({ entryPoint: MyAPIHandler });