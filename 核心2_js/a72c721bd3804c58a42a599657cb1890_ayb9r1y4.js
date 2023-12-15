let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0].advanceInformationSheetDetailList;
    //获取预支类型
    var advanceType = param.data[0].advanceType;
    if (data != null) {
      for (var i = 0; i < data.length; i++) {
        // 新增的生产工号
        var NewproductionWorkNumber = data[i].productionWorkNumber;
        // 查询分包合同子表
        var fenbaoSun = "select * from GT102917AT3.GT102917AT3.subcontractDetails where id = '" + NewproductionWorkNumber + "'";
        var scaffoldWhether = 0;
        var fenbaoSunRes = ObjectStore.queryByYonQL(fenbaoSun);
        var hoistingWhether = 0;
        var installWhether = 0;
        if (fenbaoSunRes[0].scaffoldWhether != undefined) {
          scaffoldWhether = fenbaoSunRes[0].scaffoldWhether;
        }
        if (fenbaoSunRes[0].hoistingWhether != undefined) {
          hoistingWhether = fenbaoSunRes[0].hoistingWhether;
        }
        if (fenbaoSunRes[0].installWhether != undefined) {
          installWhether = fenbaoSunRes[0].installWhether;
        }
        if (scaffoldWhether == 1 && advanceType == 3) {
          throw new Error("生产工号" + data[i].productionWorkNumber_productionWorkNumber + "已搭棚结算");
        } else if (hoistingWhether == 1 && advanceType == 2) {
          throw new Error("生产工号" + data[i].productionWorkNumber_productionWorkNumber + "已吊装结算");
        } else if (installWhether == 1 && advanceType == 1) {
          throw new Error("生产工号" + data[i].productionWorkNumber_productionWorkNumber + "已安装结算");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });