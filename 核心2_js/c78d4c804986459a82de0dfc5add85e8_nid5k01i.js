//更新入库信息
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var bid = request.bid;
    var num = request.num;
    var object = { id: bid, rukushuliang: num };
    ObjectStore.updateById("GT15835AT157.GT15835AT157.rukudetail0303", object);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });