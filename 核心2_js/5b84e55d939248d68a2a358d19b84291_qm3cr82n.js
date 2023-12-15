//保存访问记录
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var pf = request.data.pf;
    var user = request.data.user;
    var uid = request.data.uid;
    var org = request.data.org;
    var dep = request.data.dep;
    var object = { yonghu: user, pingtai: pf, uid: uid, zuzhi: org, bumen: dep };
    var res = ObjectStore.insert("GT28803AT177.GT28803AT177.visit", object);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });