let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取id
    var id = param.data[0].id;
    //根据id查询子表生产工号
    var sql = "select production_Job_No from GT101949AT1.GT101949AT1.additional_Detail1 where additional_details1_id = '" + id + "'";
    var result = ObjectStore.queryByYonQL(sql);
    for (var i = 0; i < result.length; i++) {
      //获取当前时间戳
      let yy = new Date().getFullYear() + "-";
      let mm = new Date().getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1) + "-" : new Date().getMonth() + 1 + "-";
      let dd = new Date().getDate() + " ";
      let hh = new Date().getHours() + 8 + ":";
      let mf = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() + ":" : new Date().getMinutes() + ":";
      let ss = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
      const date = yy + mm + dd;
      var object = { id: result[i].production_Job_No, contractEntryDate: date };
      var res = ObjectStore.updateById("GT101949AT1.GT101949AT1.subcontract_Details", object, "5ea43ddb");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });