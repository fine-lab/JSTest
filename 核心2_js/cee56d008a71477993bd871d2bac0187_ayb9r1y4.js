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
    var sql2 = "select * from GT102917AT3.GT102917AT3.Completionofthe";
    var res2 = ObjectStore.queryByYonQL(sql2);
    // 遍历主表
    for (var i = 0; i < res.length; i++) {
      // 获取主表id
      var id = res[i].id;
      //获取合同号
      var contractno = res[i].contractno;
      // 遍历子表
      for (var j = 0; j < res1.length; j++) {
        // 获取子表子表主键
        var pid = res1[j].BasicInformationDetailsFk;
        // 获取子表id
        var zid = res1[j].id;
        // 获取监理人员id
        var jianli = res1[j].Supervisorystaff;
        //获取生产工号
        var Productionworknumber = res1[j].Productionworknumber;
        // 判断主表id是否等于子表外键
        if (id == pid) {
          // 遍历孙表
          for (var q = 0; q < res2.length; q++) {
            // 获取孙表外键
            var sid = res2[q].BasicInformationDetails_id;
            // 判断子表id是否等于孙表外键
            if (sid == zid) {
              //获取资料移交表日期
              let ziliaoyijiaobiao = res2[q].ziliaoyijiaobiao;
              //获取使用登记证完成日期
              let shiyongdengjizhengwanchengriqi = res2[q].shiyongdengjizhengbanliriqi;
              //转化为时间戳
              var tt = Date.parse(shiyongdengjizhengwanchengriqi); // 2022/06/22 12:00:
              //获取当前时间戳
              var aa1 = new Date().getTime();
              var day = Math.ceil((aa1 - tt) / 86400000);
              //判断电梯移交周期是否为空
              if (shiyongdengjizhengwanchengriqi != null && ziliaoyijiaobiao == null) {
                // 判断天数是否等于30
                if (day == 30) {
                  var YJType = "资料移交表日期预警!";
                  var YJContent = "请注意合同" + contractno + "下的生产工号为" + Productionworknumber + "的使用登记证提交已过三十天，请尽快完成资料移交表确认！";
                  //调用预警公共函数
                  let func1 = extrequire("GT102917AT3.backend.earlyWarning");
                  let param1 = { jianli: jianli, YJType: YJType, YJContent: YJContent };
                  let res = func1.execute(context, param1);
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