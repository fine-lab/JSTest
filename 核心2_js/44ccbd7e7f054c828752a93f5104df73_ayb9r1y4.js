let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var a = "";
    var b = null;
    var c = 1;
    throw new Error(JSON.stringify(b, c));
    throw new Error(JSON.stringify(b));
    throw new Error(JSON.stringify(c));
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
              //获取实际验收日期
              var shijiyanshouriqi = res22[q].shijiyanshouriqi;
            }
          }
          // 遍历完工孙表
          for (var q = 0; q < res2.length; q++) {
            // 获取孙表外键
            var sid = res2[q].BasicInformationDetails_id;
            // 判断子表id是否等于孙表外键
            if (sid == zid) {
              //实际验收日期转化为时间戳
              var tt = Date.parse(shijiyanshouriqi); // 2022/06/22 12:00:
              //获取当前时间戳
              var aa1 = new Date().getTime();
              var day = Math.ceil((aa1 - tt) / 86400000);
              //获取日立确认完工日期
              let wangongdaiwanchengriqi = res2[q].wangongdaiwanchengriqi;
              //判断实际验收日期不为空且获取取日立确认完工日期为空
              if (shijiyanshouriqi != null && wangongdaiwanchengriqi == null) {
                // 判断天数是否等于150
                if (day == 150) {
                  var YJType = "完工袋完成日期预警!";
                  var YJContent = "请注意合同" + contractno + "下的生产工号为" + Productionworknumber + "的实际验收日期已过一百五十天，请尽快完成完工袋完成！";
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