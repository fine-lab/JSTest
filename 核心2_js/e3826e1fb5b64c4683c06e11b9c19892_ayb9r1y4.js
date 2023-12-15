let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 查询主表
    var sql = "select * from GT102917AT3.GT102917AT3.basicinformation";
    var res = ObjectStore.queryByYonQL(sql);
    // 查询子表
    var sql1 = "select * from GT102917AT3.GT102917AT3.BasicInformationDetails";
    var res1 = ObjectStore.queryByYonQL(sql1);
    // 查询孙表
    var sql2 = "select * from GT102917AT3.GT102917AT3.constructionof";
    var res2 = ObjectStore.queryByYonQL(sql2);
    // 遍历主表
    for (var i = 0; i < res.length; i++) {
      // 获取主表id
      var id = res[i].id;
      // 遍历子表
      for (var j = 0; j < res1.length; j++) {
        // 获取子表子表主键
        var pid = res1[j].BasicInformationDetailsFk;
        // 获取子表id
        var zid = res1[j].id;
        // 获取监理人员信息
        var jianli = res1[j].Supervisorystaff;
        // 判断主表id是否等于子表外键
        if (id == pid) {
          // 遍历孙表
          for (var q = 0; q < res2.length; q++) {
            // 获取孙表外键
            var sid = res2[q].BasicInformationDetails_id;
            // 获取技检报告
            var a = res2[q].jijianbaogao;
            // 判断子表id是否等于孙表外键
            if (sid == zid) {
              // 系统当前时间
              var date1 = new Date();
              var tt = Date.parse(date1);
              var actualTest = new Date();
              // 获取实际技检日期
              actualTest = res2[q].shijijijianriqi;
              var actualTestDate = Date.parse(actualTest);
              // 实际技检日期转换天数
              var actualTestDateDays = Math.ceil((tt - actualTestDate) / (24 * 60 * 60 * 1000));
              // 判断实际技检日期天数大于12小于14时
              if (actualTestDateDays > 12 && actualTestDateDays < 14) {
                // 判断技检报告
                if (a == null) {
                  var YJType = "实际技检日期预警!";
                  var YJContent = "亲爱的租户,您好:请注意!距您上一次填写实际技检日期已经过了十三天,距离十四天还剩一天,望请您尽快处理,祝您生活愉快再见！";
                  //调用预警公共函数
                  let func1 = extrequire("GT102917AT3.backend.earlyWarning");
                  let param1 = { jianli: jianli, YJType: YJType, YJContent: YJContent };
                  let res = func1.execute(context, param1);
                }
              } else {
                continue;
              }
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });