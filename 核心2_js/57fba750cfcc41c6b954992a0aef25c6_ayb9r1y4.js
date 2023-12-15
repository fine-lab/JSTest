let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
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
        //获取任务下达单提交日期
        var RXDate3 = new Date();
        //获取客户施工计划日期
        var KHDate3 = List[0].kehushigongjihua;
        //获取告知日期
        var GZDate3 = List[0].gaozhiriqi;
        if (RXDate3 != null && KHDate3 != null && GZDate3 != null) {
          var RXDate2 = RXDate3; //.replace(/-/g,"/"); // 2022/06/22 12:00:
          var RXDate = new Date(RXDate2).getTime();
          var KHDate2 = KHDate3.replace(/-/g, "/"); // 2022/06/22 12:00:
          var KHDate = new Date(KHDate2).getTime();
          var GZDate2 = GZDate3.replace(/-/g, "/"); // 2022/06/22 12:00:
          var GZDate = new Date(GZDate2).getTime();
          var maxDate = 0;
          FH = "2";
          if (maxDate < RXDate) {
            maxDate = RXDate;
          }
          if (maxDate < KHDate) {
            maxDate = KHDate;
          }
          if (maxDate < GZDate) {
            maxDate = GZDate;
          }
          var day1 = (maxDate - RLDate) / 86400000;
          if (day1 > 5) {
            FH = "4";
          }
        } else {
          //获取当前时间戳
          var AA1 = new Date().getTime();
          var day1 = (AA1 - RLDate) / 86400000;
          if (day1 > 5) {
            FH = "3";
          }
        }
      }
      //更新子表
      var updateWrapper = new Wrapper();
      updateWrapper.eq("id", result[i].shengchangonghao);
      // 待更新字段内容
      var toUpdate = { renwuxiadadantijiaoriqi: date, fahuo5tiannazhuangtai: FH };
      // 执行更新
      var res = ObjectStore.update("GT102917AT3.GT102917AT3.BasicInformationDetails", toUpdate, updateWrapper, "86d71aab");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });