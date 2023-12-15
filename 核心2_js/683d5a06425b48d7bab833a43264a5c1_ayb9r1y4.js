let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 主表id
    let hostid = param.data[0].id;
    // 根据主表id查询子表信息
    var updateWrapper = new Wrapper();
    // 声明变量
    var additionAmount = 0;
    var subadditionalAmount = 0;
    let SonSql = "select productionWorkNumber,additionAmount from GT102917AT3.GT102917AT3.additionalConditionDetails where additionalDetails_id = '" + hostid + "'";
    let SonRes = ObjectStore.queryByYonQL(SonSql);
    if (SonRes.length > 0) {
      for (var i = 0; i < SonRes.length; i++) {
        // 获取附加明细中的生产工号
        let productionWorkNumber = SonRes[i].productionWorkNumber;
        // 获取附加明细中的附加金额
        additionAmount = SonRes[i].additionAmount;
        let subcontractSql = "select additionalAmount from GT102917AT3.GT102917AT3.subcontractDetails where id='" + productionWorkNumber + "'";
        let subcontractRes = ObjectStore.queryByYonQL(subcontractSql);
        if (subcontractRes.length > 0) {
          subadditionalAmount = subcontractRes[0].additionalAmount;
          // 更新条件
          updateWrapper.eq("id", productionWorkNumber);
          // 待更新字段内容
          var toUpdate = { additionalAmount: subadditionalAmount - additionAmount };
          // 执行更新
          var res = ObjectStore.update("GT102917AT3.GT102917AT3.subcontractDetails", toUpdate, updateWrapper, "82884516");
        } else {
          throw new Error("未查询到分包合同有当前生产工号，请确认");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });