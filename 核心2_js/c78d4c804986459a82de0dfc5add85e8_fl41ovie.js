//更新入库信息
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var bid = request.bid;
    var sid = request.sid;
    var num = request.num;
    var object1 = { id: bid, rukushuliang: num };
    var object2 = { id: sid, yirukushuliang: num };
    ObjectStore.updateById("GT15835AT157.GT15835AT157.rukudetail0303", object1);
    ObjectStore.updateById("GT15835AT157.GT15835AT157.caigoudetail0303", object2);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });