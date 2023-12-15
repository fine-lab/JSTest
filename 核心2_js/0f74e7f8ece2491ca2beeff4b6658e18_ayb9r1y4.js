let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 查询安装合同主表
    var sql = "select * from GT102917AT3.GT102917AT3.basicinformation";
    var res = ObjectStore.queryByYonQL(sql);
    // 查询安装合同子表
    var sql1 = "select * from GT102917AT3.GT102917AT3.BasicInformationDetails";
    var res1 = ObjectStore.queryByYonQL(sql1);
    // 查询施工前孙表
    var sql2 = "select * from GT102917AT3.GT102917AT3.Beforetheconstruction";
    var res2 = ObjectStore.queryByYonQL(sql2);
    // 查询施工中孙表
    var sql3 = "select * from GT102917AT3.GT102917AT3.constructionof";
    var res3 = ObjectStore.queryByYonQL(sql3);
    // 遍历安装合同主表
    for (var i = 0; i < res.length; i++) {
      // 获取安装合同主表id
      var id = res[i].id;
      // 获取合同号
      var hth = res[i].contractno;
      // 遍历安装合同子表
      for (var j = 0; j < res1.length; j++) {
        // 获取安装合同子表子表主键
        var pid = res1[j].BasicInformationDetailsFk;
        // 获取安装合同子表id
        var zid = res1[j].id;
        // 获取生产工号
        var scgh = res1[j].Productionworknumber;
        // 获取监理人员信息
        var jianli = res1[j].Supervisorystaff;
        // 判断安装合同主表id是否等于安装合同子表外键
        if (id == pid) {
          // 遍历孙表
          for (var q = 0; q < res2.length; q++) {
            // 获取施工前孙表外键
            var sgqwid = res2[q].BasicInformationDetails_id;
            // 获取施工前孙表id
            var sgqid = res2[q].id;
            // 判断子表id是否等于孙表外键
            if (sgqwid == zid) {
              // 系统当前时间
              var date1 = new Date();
              var tt = Date.parse(date1);
              var hitachi = new Date();
              // 获取日立发货日期
              hitachi = res2[q].rilifahuoriqi;
              var hitachiDate = Date.parse(hitachi);
              // 日立发货日期转换天数
              var hitachiDateDays = Math.ceil((tt - hitachiDate) / (24 * 60 * 60 * 1000));
              // 判断日立发货日期天数大于13小于15时
              if (hitachiDateDays > 13 && hitachiDateDays < 15) {
                for (var z = 0; z < res3.length; z++) {
                  // 获取施工中孙表外键
                  var sgzwid = res3[z].BasicInformationDetails_id;
                  // 获取监检提交日期
                  var a = res3[z].jianjiantijiaoriqi;
                  // 判断施工前主键是否等于施工中外键
                  if (sgqid == sgzwid) {
                    // 判断监检提交日期
                    if (a == null) {
                      var YJType = "日立发货日期预警!";
                      var YJContent = "请注意合同号为：" + hth + ",下的生产工号为：" + scgh + ",距您上次填写的日立发货日期已经过去了十四天,离十五天仅剩一天,请您尽快处理,祝您生活愉快再见!!!";
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