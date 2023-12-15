let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    var auditorId = pdata.auditorId;
    let sql3 = "select * from base.user.User where id=" + auditorId;
    let res3 = ObjectStore.queryByYonQL(sql3, "productcenter");
    var staff_id = res3[0].staff;
    var i = 1 / 0; //用来终止审核，避免审核通过
    return {};
  }
}
exports({ entryPoint: MyTrigger });