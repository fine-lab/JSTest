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
    var sql2 = "select * from GT102917AT3.GT102917AT3.Beforetheconstruction";
    var res2 = ObjectStore.queryByYonQL(sql2);
    // 遍历主表
    for (var i = 0; i < res.length; i++) {
      // 获取主表id
      var id = res[i].id;
      // 获取合同号
      var hth = res[i].contractno;
      // 遍历子表
      for (var j = 0; j < res1.length; j++) {
        // 获取子表子表主键
        var pid = res1[j].BasicInformationDetailsFk;
        // 获取子表id
        var zid = res1[j].id;
        // 获取生产工号
        var scgh = res1[j].Productionworknumber;
        // 获取监理人员信息
        var jianli = res1[j].Supervisorystaff;
        // 判断主表id是否等于子表外键
        if (id == pid) {
          // 遍历孙表
          for (var q = 0; q < res2.length; q++) {
            // 获取孙表外键
            var sid = res2[q].BasicInformationDetails_id;
            // 获取二次地盘检查报告
            var a = res2[q].ercidipanjianchabaogao;
            // 判断子表id是否等于孙表外键
            if (sid == zid) {
              var date = new Date();
              // 获取上二排日期
              date = res2[q].shangerpairiqi;
              var date1 = new Date();
              var tt = Date.parse(date1);
              var ss = Date.parse(date);
              // 上二排日期转换天数
              var min = Math.ceil((tt - ss) / (24 * 60 * 60 * 1000));
              // 判断上二排日期天数大于3小于5时
              if (min > 3 && min < 5) {
                // 判断二次地盘检查报告
                if (a == null) {
                  //判断监理人员
                  if (jianli == "2663924627231488") {
                    // 发送预警信息
                    var YJType = "上二排日期预警!";
                    var YJContent = "请注意合同号为：" + hth + ",下的生产工号为：" + scgh + ",距您上次填写的上二排日期已经过去了四天,离五天仅剩一天,请您尽快处理,祝您生活愉快再见!!!";
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
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });