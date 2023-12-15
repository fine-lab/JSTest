let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取生产工号
    var SCNO = request.SCNO;
    // 安装合同号
    var contractNumber_subcontractNo = request.contractNumber_subcontractNo;
    // 生产工号名称
    var name = request.name;
    // 主表id
    var mainid = request.mainid;
    // 获取总金额
    var sum = 0;
    var anzhuangzujiesuanjin = 0;
    var jisuangongshi = 0;
    var anzhuangzujiesuanjinList = new Array();
    // 查询安装合同
    var installsql = "select id from GT102917AT3.GT102917AT3.basicinformation where contractno = '" + contractNumber_subcontractNo + "'";
    var installres = ObjectStore.queryByYonQL(installsql);
    if (installres.length > 0) {
      // 查询安装合同子表
      var installSunSql = "select Productionworknumber from GT102917AT3.GT102917AT3.BasicInformationDetails where BasicInformationDetailsFk = '" + installres[0].id + "'";
      var installSunRes = ObjectStore.queryByYonQL(installSunSql);
      if (installSunRes.length > 0) {
        for (var j = 0; j < installSunRes.length; j++) {
          var Productionworknumber = installSunRes[j].Productionworknumber;
          if (Productionworknumber == name) {
            //根据工号查询任务下达单
            var anzhuangzujiesuanjinSql = "select anzhuangzujiesuanjin from GT102917AT3.GT102917AT3.Taskorderdetailss where gonghao = '" + Productionworknumber + "'";
            var anzhuangzujiesuanjinRes = ObjectStore.queryByYonQL(anzhuangzujiesuanjinSql);
            // 任务下达单安装组结算金额
            if (anzhuangzujiesuanjinRes.length != 0) {
              anzhuangzujiesuanjin = anzhuangzujiesuanjinRes[0].anzhuangzujiesuanjin;
              // 获取计算公式
              jisuangongshi = anzhuangzujiesuanjinRes[0].jisuangongshi;
            }
          }
        }
      }
    }
    //查询预支信息表的外键 根据生产工号
    var advanceMainsql = "select advanceInformationSheet_id as id from GT102917AT3.GT102917AT3.advanceInformationSheetDetail where productionWorkNumber='" + SCNO + "' and dr=0";
    var advanceMainres = ObjectStore.queryByYonQL(advanceMainsql);
    // 循环出属于安装类型的预支信息
    if (advanceMainres.length > 0) {
      for (var i = 0; i < advanceMainres.length; i++) {
        var id = advanceMainres[i].id;
        // 查询 所有属于该工号的单据（主表）   类型
        var advanceSunsql = "select advanceType,id from GT102917AT3.GT102917AT3.advanceInformationSheet where id ='" + id + "' and dr = 0";
        var advanceSunres = ObjectStore.queryByYonQL(advanceSunsql);
        var advanceType = advanceSunres[0].advanceType;
        if (advanceType == 1) {
          // 保存属于安装类型的预支信息表id
          var YZid = advanceSunres[0].id;
          var saveSql = "select amountOfAdvanceThisTime,productionWorkNumber from GT102917AT3.GT102917AT3.advanceInformationSheetDetail where advanceInformationSheet_id= '" + YZid + "' and dr=0";
          var saveRes = ObjectStore.queryByYonQL(saveSql);
          for (var j = 0; j < saveRes.length; j++) {
            var aa = saveRes[j].productionWorkNumber;
            var amountOfAdvanceThisTime = saveRes[j].amountOfAdvanceThisTime;
            if (aa == SCNO) {
              //  获取值  进行累加得到汇总金额
              sum = sum + amountOfAdvanceThisTime;
            }
          }
        }
      }
    }
    var list = {
      anzhuangzujiesuanjin: anzhuangzujiesuanjin,
      sum: sum,
      jisuangongshi: jisuangongshi
    };
    anzhuangzujiesuanjinList.push(list);
    return { anzhuangzujiesuanjinList: anzhuangzujiesuanjinList };
  }
}
exports({ entryPoint: MyAPIHandler });