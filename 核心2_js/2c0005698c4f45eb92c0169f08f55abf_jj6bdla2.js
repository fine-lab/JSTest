let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var mobile = request.mobile;
    var object = { shoujihao: mobile };
    //实体查询
    var res = ObjectStore.selectByMap("GT20875AT13.GT20875AT13.HBGW", object);
    var orgid = res.org_id;
  }
}
exports({ entryPoint: MyAPIHandler });