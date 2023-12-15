let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取id
    var id = param.data[0].id;
    //根据id查询子表生产工号
    var sql = "select shengchangonghao from GT102917AT3.GT102917AT3.Taskorderdetailss where Taskorders_id = '" + id + "'";
    var result = ObjectStore.queryByYonQL(sql);
    for (var i = 0; i < result.length; i++) {
      var updateWrapper = new Wrapper();
      updateWrapper.eq("BasicInformationDetails_id", result[i].shengchangonghao);
      // 待更新字段内容
      var toUpdate = { renwuxiadadanshenpiriqi: "" };
      // 执行更新
      var res = ObjectStore.update("GT102917AT3.GT102917AT3.Beforetheconstruction", toUpdate, updateWrapper, "64752e9e");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });