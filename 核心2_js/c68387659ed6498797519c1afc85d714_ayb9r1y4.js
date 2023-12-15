let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 查询主表
    var sql = "select * from GT102917AT3.GT102917AT3.basicinformation";
    var res = ObjectStore.queryByYonQL(sql);
    // 查询子表
    var sql1 = "select * from GT102917AT3.GT102917AT3.BasicInformationDetails";
    var res1 = ObjectStore.queryByYonQL(sql1);
    // 查询完工孙表
    var sql2 = "select * from GT102917AT3.GT102917AT3.Completionofthe";
    var res2 = ObjectStore.queryByYonQL(sql2);
    //查询施工中孙表
    var sql22 = "select * from GT102917AT3.GT102917AT3.constructionof";
    var res22 = ObjectStore.queryByYonQL(sql22);
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
          //遍历施工中孙表
          for (var q = 0; q < res2.length; q++) {
            // 获取孙表外键
            var sid2 = res22[q].BasicInformationDetails_id;
            // 判断子表id是否等于孙表外键
            if (sid2 == zid) {
              //获取厂检报告日期
              var changjianbaogao = res22[q].changjianbaogao;
            }
          }
          // 遍历完工孙表
          for (var q = 0; q < res2.length; q++) {
            // 获取孙表外键
            var sid = res2[q].BasicInformationDetails_id;
            // 判断子表id是否等于孙表外键
            if (sid == zid) {
              //厂检报告日期转化为时间戳
              var tt = Date.parse(changjianbaogao); // 2022/06/22 12:00:
              //获取当前时间戳
              var aa1 = new Date().getTime();
              var day = Math.ceil((aa1 - tt) / 86400000);
              //获取电梯移交确认书日期
              let diantiyijiaoquerenshu = res2[q].diantiyijiaoquerenshu;
              //判断厂检报告不为空且获取电梯移交确认书上传日期为空
              if (changjianbaogao != null && diantiyijiaoquerenshu == null) {
                // 判断天数是否等于7
                if (day == "7天") {
                  var YJType = "电梯移交确认书日期预警!";
                  var YJContent = "请注意合同" + contractno + "下的生产工号为" + Productionworknumber + "的厂检报告完成已过七天，请尽快完成电梯移交确认！";
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