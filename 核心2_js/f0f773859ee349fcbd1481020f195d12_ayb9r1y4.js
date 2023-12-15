let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var sql = "select shengchangonghao from GT102917AT3.GT102917AT3.Taskorderdetails where TaskorderdetailsFk='" + id + "'";
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      for (var i = 0; i < res.length; i++) {
        var id = res[i].shengchangonghao;
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
        var toUpdate = { renwuxiadadanshenpiriqi: date };
        // 执行更新
        var res1 = ObjectStore.update("GT102917AT3.GT102917AT3.Beforetheconstruction", toUpdate, updateWrapper, "64752e9e");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });