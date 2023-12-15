let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取id
    var id = param.data[0].id;
    //根据id查询子表生产工号
    var sql = "select shengchangonghao from GT102917AT3.GT102917AT3.Taskorderdetailss where Taskorders_id = '" + id + "'";
    var result = ObjectStore.queryByYonQL(sql);
    for (var i = 0; i < result.length; i++) {
      //发货五天内状态设定枚举值
      var FH = "0";
      var sqls = "select * from GT102917AT3.GT102917AT3.BasicInformationDetails where id = '" + result[i].shengchangonghao + "'";
      var List = ObjectStore.queryByYonQL(sqls);
      //判断日立发货日期是否为空
      if (List[0].rilifahuoriqi != null) {
        FH = "1";
        //获取日立发货日期
        var RLDate3 = List[0].rilifahuoriqi;
        if (RLDate3 != null) {
          var RLDate2 = RLDate3.replace(/-/g, "/"); // 2022/06/22 12:00:
          var RLDate = new Date(RLDate2).getTime();
        }
        //获取当前时间戳
        var AA1 = new Date().getTime();
        var day1 = (AA1 - RLDate) / 86400000;
        if (day1 > 5) {
          FH = "3";
        }
      }
      var updateWrapper = new Wrapper();
      updateWrapper.eq("id", result[i].shengchangonghao);
      // 待更新字段内容
      var toUpdate = { renwuxiadadantijiaoriqi: "", renwuxiadadanshenpiriqi: "", fahuo5tiannazhuangtai: FH };
      // 执行更新
      var res = ObjectStore.update("GT102917AT3.GT102917AT3.BasicInformationDetails", toUpdate, updateWrapper, "86d71aab");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });