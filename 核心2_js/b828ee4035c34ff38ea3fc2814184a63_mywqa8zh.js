let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var sql = "select production_Job_No from GT101949AT1.GT101949AT1.additional_Detail1 where additional_details1_id='" + id + "'";
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      for (var i = 0; i < res.length; i++) {
        var id = res[i].production_Job_No;
        //获取当前时间戳
        let yy = new Date().getFullYear() + "-";
        let mm = new Date().getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1) + "-" : new Date().getMonth() + 1 + "-";
        let dd = new Date().getDate() + " ";
        let hh = new Date().getHours() + 8 + ":";
        let mf = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() + ":" : new Date().getMinutes() + ":";
        let ss = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
        const date = yy + mm + dd;
        // 更新条件
        var updateWrapper = new Wrapper();
        updateWrapper.eq("id", id);
        // 待更新字段内容
        var toUpdate = { mobilization_Date: date };
        // 执行更新
        var res1 = ObjectStore.update("GT101949AT1.GT101949AT1.subcontract_Details", toUpdate, updateWrapper, "5ea43ddb");
      }
    }
    return { res1 };
  }
}
exports({ entryPoint: MyAPIHandler });