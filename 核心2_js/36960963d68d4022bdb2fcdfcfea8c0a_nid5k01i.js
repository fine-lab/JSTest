//查询入库货品信息
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var wid = request.wid;
    var bid = request.bid;
    var object1 = { huopinbianhao: wid };
    var object2 = { rukudetail0303Fk: bid, huopinbianhao: wid };
    var res1 = ObjectStore.selectByMap("GT15835AT157.GT15835AT157.huopin0303", object1);
    var res2 = ObjectStore.selectByMap("GT15835AT157.GT15835AT157.rukudetail0303", object2);
    return { info: res1, num: res2 };
  }
}
exports({ entryPoint: MyAPIHandler });