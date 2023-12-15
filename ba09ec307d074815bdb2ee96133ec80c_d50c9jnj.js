let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = { key: "yourkeyHere" };
    //查询内容
    var object1 = {
      id: "youridHere"
    };
    //实体查询
    var res1 = ObjectStore.selectById("cpu-buyoffer.pureq.PuReqVO", object1);
    var res = ObjectStore.selectByMap("cpu-buyoffer.pureq.PuReqVO", object);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });