let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取id
    var id = param.data[0].id;
    //根据id查询子表生产工号
    var sql = "select shengchangonghao from GT102917AT3.GT102917AT3.Taskorderdetailss where Taskorders_id = '" + id + "'";
    var result = ObjectStore.queryByYonQL(sql);
    for (var i = 0; i < result.length; i++) {
      let yy = new Date().getFullYear() + "-";
      let mm = new Date().getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1) + "-" : new Date().getMonth() + 1 + "-";
      let dd = new Date().getDate() + " ";
      let hh = new Date().getHours() + 8 + ":";
      let mf = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() + ":" : new Date().getMinutes() + ":";
      let ss = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
      const date = yy + mm + dd;
      var updateWrapper = new Wrapper();
      updateWrapper.eq("id", result[i].shengchangonghao);
      // 待更新字段内容
      var toUpdate = { renwuxiadadanshenpiriqi: date };
      // 执行更新
      var res = ObjectStore.update("GT102917AT3.GT102917AT3.BasicInformationDetails", toUpdate, updateWrapper, "86d71aab");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });