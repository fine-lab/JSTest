let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取生产工号id
    var number = request.number;
    // 获取总金额
    var sum = 0;
    //查询预支信息表的外键 根据生产工号
    var sql = "select advanceInformationSheet_id as id from GT102917AT3.GT102917AT3.advanceInformationSheetDetail where productionWorkNumber='" + number + "' and dr=0";
    var res = ObjectStore.queryByYonQL(sql);
    // 循环出属于安装类型的预支信息
    if (res.length > 0) {
      for (var i = 0; i < res.length; i++) {
        var id = res[i].id;
        // 查询 所有属于该工号的单据（主表）   类型
        var sql2 = "select advanceType,id from GT102917AT3.GT102917AT3.advanceInformationSheet where id ='" + id + "' and dr = 0";
        var YZList = ObjectStore.queryByYonQL(sql2);
        var advanceType = YZList[0].advanceType;
        if (advanceType == 1) {
          // 保存属于安装类型的预支信息表id
          var YZid = YZList[0].id;
          var sql1 = "select amountOfAdvanceThisTime,productionWorkNumber from GT102917AT3.GT102917AT3.advanceInformationSheetDetail where advanceInformationSheet_id= '" + YZid + "' and dr=0";
          var ss = ObjectStore.queryByYonQL(sql1);
          for (var j = 0; j < ss.length; j++) {
            var aa = ss[j].productionWorkNumber;
            var amountOfAdvanceThisTime = ss[j].amountOfAdvanceThisTime;
            if (aa == number) {
              //  获取值  进行累加得到汇总金额
              sum = sum + amountOfAdvanceThisTime;
            }
          }
        }
      }
    }
    return { sum: sum };
  }
}
exports({ entryPoint: MyAPIHandler });