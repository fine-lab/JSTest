let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 查询主表
    var sql = "select * from GT102917AT3.GT102917AT3.basicinformation";
    var res = ObjectStore.queryByYonQL(sql);
    // 查询子表
    var sql1 = "select * from GT102917AT3.GT102917AT3.BasicInformationDetails";
    var res1 = ObjectStore.queryByYonQL(sql1);
    // 查询施工前孙表
    var sql2 = "select * from GT102917AT3.GT102917AT3.Beforetheconstruction";
    var res2 = ObjectStore.queryByYonQL(sql2);
    // 遍历主表集合
    for (var i = 0; i < res.length; i++) {
      // 获取主表id
      var id = res[i].id;
      // 获取合同号
      var hth = res[i].contractno;
      var date = new Date();
      // 获取接收合同日期
      date = res[i].Acceptance_date;
      var date1 = new Date();
      var tt = Date.parse(date1);
      var ss = Date.parse(date);
      // 转换天数
      var min = Math.ceil((tt - ss) / (24 * 60 * 60 * 1000));
      // 遍历子表集合
      for (var j = 0; j < res1.length; i++) {
        // 获取子表外键
        var pid = res1[j].BasicInformationDetailsFk;
        // 获取子表id
        var zid = res1[j].id;
        // 获取生产工号
        var scgh = res1[j].Productionworknumber;
        // 获取监理人员信息
        var jianli = res1[j].Supervisorystaff;
        if (id == pid) {
          if (min > 1 && min < 9) {
            // 遍历施工前孙表集合
            for (var k = 0; k < res2.length; k++) {
              // 获取监理微信群
              var a = res2[k].jianliweixinqun;
              throw new Error(JSON.stringify(a));
              // 获取一次地盘检查报告
              var b = res2[k].yicidipanjianchabaogao;
              // 获取现场检查照片
              var c = res2[k].xianchangjianchazhaopian;
              // 获取温馨提示
              var d = res2[k].wenxintishi;
              // 获取报装资料提示
              var e = res2[k].baozhuangziliaotishi;
              // 获取孙表外键
              var sid = res2[k].BasicInformationDetails_id;
              // 判断孙表外键是否等于子表id
              if (sid == zid) {
                // 判断监理微信群，一次地盘检查报告，现场检查照片，获取温馨提示，报装资料提示
                if (a != null && b != null && c != null && d != null && e != null) {
                  continue;
                } else {
                  //判断监理人员
                  if (jianli == "2663924627231488") {
                    // 发送预警信息
                    var YJType = "接受合同日期预警!";
                    var YJContent = "请注意合同号为：" + hth + ",下的生产工号为：" + scgh + ",距您上次填写的接受合同日期已经过去了二十九天,离三十天仅剩一天,请您尽快处理,祝您生活愉快再见!!!";
                    //调用预警公共函数
                    let func1 = extrequire("GT102917AT3.backend.earlyWarning");
                    let param1 = { jianli: jianli, YJType: YJType, YJContent: YJContent };
                    let res = func1.execute(context, param1);
                  }
                }
              }
            }
          } else {
            continue;
          }
        }
      }
      return {};
    }
  }
}
exports({ entryPoint: MyTrigger });