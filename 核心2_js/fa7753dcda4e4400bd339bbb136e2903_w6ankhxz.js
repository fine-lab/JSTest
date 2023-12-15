let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var orgName = request.orgName;
    var tbName = "rc_voucher.rc_voucher.rc_org_ext"; // rc_voucher.rc_voucher.rc_org_ext   tp_rc_org_ext
    var yonql = "select * from " + tbName + " where org_name = " + orgName;
    var res = ObjectStore.queryByYonQL(yonql);
    return { response: res };
  }
}
exports({ entryPoint: MyAPIHandler });