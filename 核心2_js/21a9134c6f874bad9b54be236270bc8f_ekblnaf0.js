let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var sql = "select pubts from hred.staff.StaffJob where id= 'youridHere'";
    var res = ObjectStore.queryByYonQL(sql, "hrcloud-staff-mgr");
    let msg = "";
    for (var j = 0; j < res.length; j++) {
      msg = res[j].pubts;
    }
    for (var i = 0; i < 100; i++) {
      let body = {
        data: {
          id: "youridHere",
          staffVODefine: {
            define1: i,
            define2: "true",
            id: "youridHere"
          }
        }
      };
      let url = "https://www.example.com/";
      let apiResponse = openLinker("POST", url, "HRED", JSON.stringify(body));
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });