//查询入库货品信息
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var wid = request.wuliaomingchen;
    var sid = request.sid;
    var object = { songhuodan_id: sid, wuliaomingchen: wid };
    var res = ObjectStore.selectByMap("GT15835AT157.GT15835AT157.songhuomingxi", object);
    return { scid: res };
  }
}
exports({ entryPoint: MyAPIHandler });