let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 查询主表
    var sql = "select * from GT102917AT3.GT102917AT3.basicinformation";
    var res = ObjectStore.queryByYonQL(sql);
    // 查询子表
    var sql1 = "select * from GT102917AT3.GT102917AT3.BasicInformationDetails";
    var res1 = ObjectStore.queryByYonQL(sql1);
    // 查询施工中孙表
    var sql2 = "select * from GT102917AT3.GT102917AT3.constructionof";
    var res2 = ObjectStore.queryByYonQL(sql2);
    // 查询完工孙表
    var sql3 = "select * from GT102917AT3.GT102917AT3.Completionofthe";
    var res3 = ObjectStore.queryByYonQL(sql3);
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
            // 获取施工中孙表外键
            var sgzwid = res2[q].BasicInformationDetails_id;
            // 判断子表id是否等于孙表外键
            if (sgzwid == zid) {
              // 系统当前时间
              var date1 = new Date();
              var tt = Date.parse(date1);
              var report = new Date();
              // 获取技检报告
              report = res2[q].jijianbaogao;
              var reportDate = Date.parse(report);
              // 技检报告转换天数
              var reportDateDays = Math.ceil((tt - reportDate) / (24 * 60 * 60 * 1000));
              // 判断技检报告天数大于28小于30时
              if (reportDateDays > 28 && reportDateDays < 30) {
                for (var z = 0; z < res3.length; z++) {
                  // 获取完工孙表外键
                  var wgwid = res3[z].BasicInformationDetails_id;
                  // 获取质保合同双方盖章
                  var a = res3[z].zhibaohetongshuangfanggaizhang;
                  // 判断施工中主键是否等于完工外键
                  if (zid == wgwid) {
                    // 判断质保合同双方盖章
                    if (a == null) {
                      var YJType = "技检报告日期预警!";
                      var YJContent =
                        "：请注意合同号:" + hth + "下的生产工号为" + scgh + "距您上一次添加技检报告日期已经过去了二十九天,离三十天仅剩一天,请您在三十天之前完成,请您尽快处理,祝您生活愉快再见！";
                      //调用预警公共函数
                      let func1 = extrequire("GT102917AT3.backend.earlyWarning");
                      let param1 = { jianli: jianli, YJType: YJType, YJContent: YJContent };
                      let res = func1.execute(context, param1);
                    } else {
                      continue;
                    }
                  }
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