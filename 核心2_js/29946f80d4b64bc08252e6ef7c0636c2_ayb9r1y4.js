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
            // 获取发货5天内状态
            var a = res2[q].fahuo5tiannazhuangtai;
            // 判断子表id是否等于孙表外键
            if (sid == zid) {
              // 系统当前时间
              var date1 = new Date();
              var tt = Date.parse(date1);
              var task = new Date();
              // 获取任务下达单提交日期
              task = res2[q].renwuxiadadantijiaoriqi;
              var taskDate = Date.parse(task);
              var construction = new Date();
              // 获取客户施工计划
              construction = res2[q].kehushigongjihua;
              var constructionDate = Date.parse(construction);
              throw new Error(JSON.stringify(constructionDate));
              var inform = new Date();
              // 获取告知日期
              inform = res2[q].gaozhiriqi;
              var informDate = Date.parse(inform);
              // 任务下达单提交日期转换天数
              var taskDateDays = Math.ceil((tt - taskDate) / (24 * 60 * 60 * 1000));
              // 客户施工计划日期转换天数
              var constructionDateDays = Math.ceil((tt - constructionDate) / (24 * 60 * 60 * 1000));
              // 告知日期转换天数
              var informDateDays = Math.ceil((tt - informDate) / (24 * 60 * 60 * 1000));
              // 判断天数大于3小于5时
              if (taskDateDays > 3 && taskDateDays < 5 && constructionDateDays > 3 && constructionDateDays < 5 && informDateDays > 3 && informDateDays < 5) {
                var YJType = "任务下达单提交日期、客户施工计划、告知日期预警!";
                var YJContent =
                  "请注意合同号为：" + hth + ",下的生产工号为：" + scgh + ",距您上次填写的任务下达单提交日期或客户施工计划或告知日期,已经过了四天,仅剩一天,请您尽快处理,祝您生活愉快再见！";
                //调用预警公共函数
                let func1 = extrequire("GT102917AT3.backend.earlyWarning");
                let param1 = { jianli: jianli, YJType: YJType, YJContent: YJContent };
                let res = func1.execute(context, param1);
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