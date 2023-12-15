let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取员工id
    let staffId = ObjectStore.user().staffId;
    let teacher = param.data[0].baseSchoolTheacher1;
    if (staffId == teacher) {
      let orderid = param.data[0].id;
      var object = { id: orderid, isRejected: "Y" };
      var res = ObjectStore.updateById("AT1745F50C09180004.AT1745F50C09180004.caseInfoMaintain", object, "yb4a81bd8f");
    }
  }
}
exports({ entryPoint: MyTrigger });